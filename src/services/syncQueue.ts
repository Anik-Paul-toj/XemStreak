import { storageService } from './storage';
import { api } from './api';
import type { CompletedSessionSummary } from '../types';

class SyncManager {
  private isSyncing = false;

  async recordSession(session: CompletedSessionSummary): Promise<boolean> {
    // 1. Always persist locally first (offline-first requirement)
    storageService.addCompletedSession(session);

    // 2. Try to sync with FastAPI backend
    try {
      await api.createSession(session);
      return true;
    } catch {
      // Backend is unavailable or offline: save to pending queue
      storageService.enqueueOfflineSession(session);
      return false;
    }
  }

  async syncPendingQueue(): Promise<number> {
    if (this.isSyncing) return 0;
    const queue = storageService.getOfflineQueue();
    if (queue.length === 0) return 0;

    this.isSyncing = true;
    try {
      const isOnline = await api.checkHealth();
      if (!isOnline) {
        this.isSyncing = false;
        return 0;
      }

      const res = await api.batchSync(queue);
      storageService.clearOfflineQueue();
      this.isSyncing = false;
      return res.synced_count;
    } catch (err) {
      console.error('Failed to sync offline queue:', err);
      this.isSyncing = false;
      return 0;
    }
  }

  initAutoSync(onSyncedCallback?: (count: number) => void) {
    // Listen for reconnection
    window.addEventListener('online', async () => {
      const count = await this.syncPendingQueue();
      if (count > 0 && onSyncedCallback) {
        onSyncedCallback(count);
      }
    });

    // Periodic check every 30 seconds
    setInterval(async () => {
      if (navigator.onLine) {
        const count = await this.syncPendingQueue();
        if (count > 0 && onSyncedCallback) {
          onSyncedCallback(count);
        }
      }
    }, 30000);
  }
}

export const syncManager = new SyncManager();
