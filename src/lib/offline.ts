import { writable, get } from 'svelte/store';
import { syncStatus } from './store';
import { createNote, updateNote, deleteNote } from './api';
import type { Note } from './types';

type OfflineAction = 
  | { type: 'CREATE'; payload: Partial<Note>; tmpId: string }
  | { type: 'UPDATE'; id: string; payload: Partial<Note> }
  | { type: 'DELETE'; id: string };

const QUEUE_KEY = 'offline_mutations_queue';

function getSavedQueue(): OfflineAction[] {
  if (typeof window === 'undefined') return [];
  const val = localStorage.getItem(QUEUE_KEY);
  return val ? JSON.parse(val) : [];
}

export const offlineQueue = writable<OfflineAction[]>(getSavedQueue());

offlineQueue.subscribe(queue => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }
});

export function queueAction(action: OfflineAction) {
  offlineQueue.update(q => [...q, action]);
  processQueue();
}

let isProcessing = false;

export async function processQueue() {
  if (typeof window === 'undefined' || !navigator.onLine || isProcessing) return;
  
  const queue = get(offlineQueue);
  if (queue.length === 0) {
    syncStatus.set('online');
    return;
  }

  isProcessing = true;
  syncStatus.set('syncing');

  try {
    for (const action of queue) {
      if (action.type === 'CREATE') {
        const { tmpId, payload } = action as any;
        // In a real app we'd map tmpId to realId for subsequent queued updates,
        // but for this simple app we'll just send it.
        await createNote(payload);
      } else if (action.type === 'UPDATE') {
        await updateNote(action.id, action.payload);
      } else if (action.type === 'DELETE') {
        try {
          await deleteNote(action.id);
        } catch(e: any) {
          // If 404, it's already deleted
          if (!e.message.includes('404')) throw e;
        }
      }
      
      // Remove successfully processed action
      offlineQueue.update(q => q.slice(1));
    }
    syncStatus.set('online');
  } catch (error) {
    console.error('Failed to sync offline queue:', error);
    syncStatus.set('offline'); // Still offline or server error
  } finally {
    isProcessing = false;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    syncStatus.set('online');
    processQueue();
  });
  window.addEventListener('offline', () => {
    syncStatus.set('offline');
  });
  // Initial check
  if (!navigator.onLine) {
    syncStatus.set('offline');
  }
}
