import type { Note } from './types';

// Using a public placeholder from MockAPI for this demo.
const API_BASE = 'https://66028a019d7276a755536553.mockapi.io/api/v1';

export async function getNotes(page = 1, limit = 20, search = '', sortBy = 'createdAt', order = 'desc'): Promise<Note[]> {
  const url = new URL(`${API_BASE}/notes`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('sortBy', sortBy);
  url.searchParams.set('order', order);
  
  if (search.trim()) {
    url.searchParams.set('title', search.trim());
  }

  const res = await fetch(url.toString(), {
    headers: { 'Content-Type': 'application/json' }
  });

  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

export async function createNote(data: Partial<Note>): Promise<Note> {
  const res = await fetch(`${API_BASE}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

export async function updateNote(id: string, data: Partial<Note>): Promise<Note> {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return await res.json();
}
