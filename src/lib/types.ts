export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  pinned?: boolean;
}

export type SortKey = 'createdAt' | 'title' | 'id';
export type SortDir = 'asc' | 'desc';
export type SyncStatus = 'online' | 'offline' | 'syncing';
