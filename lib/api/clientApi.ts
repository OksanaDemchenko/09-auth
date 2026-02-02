import type { Note } from '../../types/note';
import type { User } from '../../types/user';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const query = new URLSearchParams();
  query.append('page', String(params.page));
  query.append('perPage', String(params.perPage));
  if (params.search) query.append('search', params.search);
  if (params.tag) query.append('tag', params.tag);

  const res = await fetch(`/api/notes?${query.toString()}`, {
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await fetch(`/api/notes/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch note');
  return res.json();
};

export const createNote = async (payload: {
  title: string;
  content: string;
  tag: Note['tag'];
}): Promise<Note> => {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create note');
  return res.json();
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return res.json();
};


export const register = async (email: string, password: string): Promise<User> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
};

export const login = async (email: string, password: string): Promise<User> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', 
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
};

export const logout = async (): Promise<void> => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const res = await fetch('/api/users/me', { credentials: 'include' });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
};

export const updateMe = async (data: { username: string }): Promise<User> => {
  const res = await fetch('/api/users/me', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
};
