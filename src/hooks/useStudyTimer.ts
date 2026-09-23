import { useState, useEffect, useCallback, useRef } from 'react';
import type { StudySession, SessionMode, CompletedSessionSummary } from '../types';
import { storageService } from '../services/storage';

export function calculateCurrentElapsed(session: StudySession | null): number {
  if (!session) return 0;
  if (!session.isRunning) {
    return session.accumulatedSeconds;
  }
  const now = Date.now();
  const additionalSeconds = Math.max(0, Math.floor((now - session.startedAt) / 1000));
  return session.accumulatedSeconds + additionalSeconds;
}

export function useStudyTimer(onSessionCompleted?: (summary: CompletedSessionSummary) => void) {
  const [session, setSession] = useState<StudySession | null>(() => storageService.getActiveSession());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => calculateCurrentElapsed(session));
  const callbackRef = useRef(onSessionCompleted);
  callbackRef.current = onSessionCompleted;

  // Sync elapsed seconds via timestamp-based tick
  useEffect(() => {
    if (!session || !session.isRunning) {
      if (session) {
        setElapsedSeconds(session.accumulatedSeconds);
      }
      return;
    }

    const updateTimer = () => {
      const current = calculateCurrentElapsed(session);
      setElapsedSeconds(current);

      // Check if target completed for fixed focus sessions
      if (session.targetSeconds > 0 && current >= session.targetSeconds) {
        // We can either auto-complete or let the user complete
        // Updating title to show completion
        document.title = `[Done!] ${session.title} • XemStreak`;
      } else {
        const mins = Math.floor(current / 60);
        const secs = current % 60;
        const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        document.title = `(${timeStr}) ${session.title} • XemStreak`;
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);

    return () => {
      clearInterval(interval);
      document.title = 'XemStreak • Focus & Habit Garden';
    };
  }, [session]);

  const startSession = useCallback((
    mode: SessionMode,
    title: string,
    targetMinutes: number,
    roomId?: string
  ) => {
    const newSession: StudySession = {
      id: 'session-' + Date.now(),
      mode,
      title: title.trim() || (mode === 'focus' ? 'Focus Session' : mode === 'goal' ? 'Study Goal' : 'Deep Work'),
      targetSeconds: targetMinutes * 60,
      accumulatedSeconds: 0,
      startedAt: Date.now(),
      pausedAt: null,
      isRunning: true,
      roomId,
    };

    storageService.saveActiveSession(newSession);
    setSession(newSession);
    setElapsedSeconds(0);
  }, []);

  const pauseSession = useCallback(() => {
    if (!session || !session.isRunning) return;

    const currentElapsed = calculateCurrentElapsed(session);
    const updated: StudySession = {
      ...session,
      accumulatedSeconds: currentElapsed,
      pausedAt: Date.now(),
      isRunning: false,
    };

    storageService.saveActiveSession(updated);
    setSession(updated);
    setElapsedSeconds(currentElapsed);
  }, [session]);

  const resumeSession = useCallback(() => {
    if (!session || session.isRunning) return;

    const updated: StudySession = {
      ...session,
      startedAt: Date.now(),
      pausedAt: null,
      isRunning: true,
    };

    storageService.saveActiveSession(updated);
    setSession(updated);
  }, [session]);

  const finishSession = useCallback(() => {
    if (!session) return null;

    const finalDuration = calculateCurrentElapsed(session);
    // Tree leaf calculation: ~1 leaf per 15-20 min of study, minimum 1 if > 3 min
    const leavesEarned = finalDuration < 180 ? 0 : Math.max(1, Math.floor(finalDuration / 900));

    const summary: CompletedSessionSummary = {
      id: session.id,
      mode: session.mode,
      title: session.title,
      durationSeconds: finalDuration,
      leavesEarned,
      completedAt: new Date().toISOString(),
      roomId: session.roomId,
    };

    storageService.addCompletedSession(summary);
    storageService.saveActiveSession(null);
    setSession(null);
    setElapsedSeconds(0);
    document.title = 'XemStreak • Focus & Habit Garden';

    if (callbackRef.current) {
      callbackRef.current(summary);
    }
    return summary;
  }, [session]);

  const cancelSession = useCallback(() => {
    storageService.saveActiveSession(null);
    setSession(null);
    setElapsedSeconds(0);
    document.title = 'XemStreak • Focus & Habit Garden';
  }, []);

  return {
    activeSession: session,
    elapsedSeconds,
    isRunning: session ? session.isRunning : false,
    isPaused: session ? !session.isRunning : false,
    startSession,
    pauseSession,
    resumeSession,
    finishSession,
    cancelSession,
  };
}
