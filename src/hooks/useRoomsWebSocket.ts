import { useEffect, useRef, useState, useCallback } from 'react';
import type { StudyRoom } from '../types';

export interface RoomWebSocketCallbacks {
  onRoomCreated?: (room: StudyRoom) => void;
  onMemberJoined?: (data: { roomId: string; member: any }) => void;
  onMemberStatusChanged?: (data: {
    roomId: string;
    userId: string;
    isStudying: boolean;
    studyStartedAt?: number;
    todaySeconds?: number;
  }) => void;
  onCheerReceived?: (data: { roomId: string; cheer: any }) => void;
}

export function useRoomsWebSocket(callbacks?: RoomWebSocketCallbacks) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const reconnectTimeoutRef = useRef<number | null>(null);
  const retryCountRef = useRef(0);
  const pingIntervalRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    // Determine WS protocol & host
    const isSecure = window.location.protocol === 'https:';
    const wsProto = isSecure ? 'wss:' : 'ws:';
    const backendHost = 'localhost:8000'; // FastAPI backend port
    const wsUrl = `${wsProto}//${backendHost}/ws/rooms`;

    try {
      const socket = new WebSocket(wsUrl);
      wsRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        retryCountRef.current = 0;

        // Start ping keepalive
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = window.setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ action: 'PING' }));
          }
        }, 20000);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const type = message.type;

          if (type === 'PONG') return;

          if (type === 'ROOM_CREATED' && callbacksRef.current?.onRoomCreated) {
            callbacksRef.current.onRoomCreated(message.room);
          } else if (type === 'MEMBER_JOINED' && callbacksRef.current?.onMemberJoined) {
            callbacksRef.current.onMemberJoined(message);
          } else if (type === 'MEMBER_STUDY_STATUS' && callbacksRef.current?.onMemberStatusChanged) {
            callbacksRef.current.onMemberStatusChanged(message);
          } else if (type === 'CHEER_RECEIVED' && callbacksRef.current?.onCheerReceived) {
            callbacksRef.current.onCheerReceived(message);
          }
        } catch {
          // Ignore parse errors
        }
      };

      socket.onclose = () => {
        setIsConnected(false);
        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

        // Exponential backoff auto-reconnect (1s, 2s, 4s, 8s, up to 15s)
        const delay = Math.min(15000, 1000 * Math.pow(2, retryCountRef.current));
        retryCountRef.current += 1;
        reconnectTimeoutRef.current = window.setTimeout(connect, delay);
      };

      socket.onerror = () => {
        socket.close();
      };
    } catch {
      setIsConnected(false);
      const delay = Math.min(15000, 1000 * Math.pow(2, retryCountRef.current));
      retryCountRef.current += 1;
      reconnectTimeoutRef.current = window.setTimeout(connect, delay);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  // Action dispatchers
  const sendAction = useCallback((action: string, data: Record<string, any>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action, ...data }));
      return true;
    }
    return false;
  }, []);

  const createRoomWS = useCallback(
    (payload: Partial<StudyRoom>, userId?: string, creatorName?: string) => {
      return sendAction('CREATE_ROOM', { payload, userId, creatorName });
    },
    [sendAction]
  );

  const joinRoomWS = useCallback(
    (roomId: string, userId: string, userName: string, avatarBg?: string) => {
      return sendAction('JOIN_ROOM', { roomId, userId, userName, avatarBg });
    },
    [sendAction]
  );

  const startStudyWS = useCallback(
    (roomId: string, userId: string, ghostMode: boolean = false) => {
      return sendAction('START_STUDY', { roomId, userId, ghostMode });
    },
    [sendAction]
  );

  const stopStudyWS = useCallback(
    (roomId: string, userId: string, sessionSeconds: number) => {
      return sendAction('STOP_STUDY', { roomId, userId, sessionSeconds });
    },
    [sendAction]
  );

  const sendCheerWS = useCallback(
    (roomId: string, fromUserName: string, toUserName: string, reaction: string) => {
      return sendAction('SEND_CHEER', { roomId, fromUserName, toUserName, reaction });
    },
    [sendAction]
  );

  const subscribeRoomWS = useCallback(
    (roomId: string) => {
      return sendAction('SUBSCRIBE_ROOM', { roomId });
    },
    [sendAction]
  );

  return {
    isConnected,
    createRoomWS,
    joinRoomWS,
    startStudyWS,
    stopStudyWS,
    sendCheerWS,
    subscribeRoomWS,
  };
}
