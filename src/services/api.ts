import type {
  StudyRoom,
  CompletedSessionSummary,
  LeaderboardEntry,
  RoomCheer
} from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('xemstreak_auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('xemstreak_auth_token', token);
    } else {
      localStorage.removeItem('xemstreak_auth_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
    }

    return response.json();
  }

  // Health
  async checkHealth(): Promise<boolean> {
    try {
      const data = await this.request<{ status: string }>('/health');
      return data.status === 'ok';
    } catch {
      return false;
    }
  }

  // Auth
  async register(
    username: string,
    email: string,
    password: string,
    dailyGoalSeconds: number = 7200
  ): Promise<{ access_token: string; user_id: string; username: string }> {
    const data = await this.request<{ access_token: string; user_id: string; username: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password,
        daily_goal_seconds: dailyGoalSeconds,
      }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async login(
    username: string,
    password: string
  ): Promise<{ access_token: string; user_id: string; username: string }> {
    const data = await this.request<{ access_token: string; user_id: string; username: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  logout(): void {
    this.setToken(null);
  }

  async getMe(): Promise<{
    id: string;
    username: string;
    email: string;
    avatar_bg: string;
    daily_goal_seconds: number;
    ghost_mode: boolean;
    ambient_sound: string;
    current_streak: number;
    longest_streak: number;
    total_study_days: number;
    tree_level: number;
    total_leaves: number;
    leaves_today: number;
    xp: number;
    pot_type: string;
    flora_type: string;
    aura_type: string;
  }> {
    return this.request('/auth/me');
  }

  // Study Sessions
  async createSession(session: CompletedSessionSummary): Promise<CompletedSessionSummary> {
    return this.request('/study/session', {
      method: 'POST',
      body: JSON.stringify({
        id: session.id,
        mode: session.mode,
        title: session.title,
        duration_seconds: session.durationSeconds,
        target_seconds: 0,
        room_id: session.roomId,
        completed_at: session.completedAt,
      }),
    });
  }

  // Offline Sync (Section 24)
  async batchSync(sessions: CompletedSessionSummary[]): Promise<{
    synced_count: number;
    total_study_seconds: number;
    current_streak: number;
    total_leaves: number;
    tree_level: number;
  }> {
    const payload = sessions.map((s) => ({
      id: s.id,
      mode: s.mode,
      title: s.title,
      duration_seconds: s.durationSeconds,
      target_seconds: 0,
      room_id: s.roomId,
      completed_at: s.completedAt,
    }));

    return this.request('/sync/batch', {
      method: 'POST',
      body: JSON.stringify({ sessions: payload }),
    });
  }

  // Rooms & Social (Sections 12 - 17)
  async getRooms(): Promise<StudyRoom[]> {
    return this.request('/rooms');
  }

  async createRoom(room: {
    id?: string;
    name: string;
    description?: string;
    is_private: boolean;
    passcode?: string;
    tags?: string;
    creator_name?: string;
  }): Promise<StudyRoom> {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(room),
    });
  }

  async getRoomLeaderboard(roomId: string): Promise<LeaderboardEntry[]> {
    return this.request(`/rooms/${roomId}/leaderboard`);
  }

  async sendRoomCheer(roomId: string, reaction: string, toUserName?: string): Promise<RoomCheer> {
    return this.request(`/rooms/${roomId}/cheer`, {
      method: 'POST',
      body: JSON.stringify({ reaction, to_user_name: toUserName }),
    });
  }

  async getRoomCheers(roomId: string): Promise<RoomCheer[]> {
    return this.request(`/rooms/${roomId}/cheers`);
  }

  // AI Study Companion (Sections 18, 19, 20)
  async sendAIChat(message: string, roomName?: string): Promise<{ reply: string; provider: string }> {
    return this.request('/ai/companion/chat', {
      method: 'POST',
      body: JSON.stringify({ message, room_name: roomName }),
    });
  }

  // Analytics (Section 28)
  async getAnalytics(): Promise<{
    today_seconds: number;
    total_seconds: number;
    week_history: Array<{ day: string; date: string; seconds: number; met_goal: boolean }>;
    current_streak: number;
    longest_streak: number;
    total_leaves: number;
    tree_level: number;
  }> {
    return this.request('/study/analytics');
  }
}

export const api = new ApiClient();
