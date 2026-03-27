import { writable, derived } from 'svelte/store';
import type { Note, SyncStatus, SortKey, SortDir } from './types';

export const notes = writable<Note[]>([]);
export const syncStatus = writable<SyncStatus>('online');
export const searchFilter = writable('');
export const sortKey = writable<SortKey>('createdAt');
export const sortDir = writable<SortDir>('desc');

export const darkMode = writable<boolean>(false);
export const currentRoute = writable<string>(typeof window !== 'undefined' ? window.location.pathname : '/');

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    currentRoute.set(window.location.pathname);
  });
}

export function navigate(path: string) {
  if (typeof window !== 'undefined') {
    window.history.pushState({}, '', path);
    currentRoute.set(path);
  }
}

if (typeof window !== 'undefined') {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    darkMode.set(true);
    document.documentElement.classList.add('dark');
  }

  darkMode.subscribe(val => {
    if (val) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });
}

