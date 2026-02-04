import type { Note } from '../../types/note';
import type { User } from '../../types/user';
import { api } from './api'; 

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

  const res = await api.get(`/notes?${query.toString()}`);
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get(`/notes/${id}`);
  return res.data;
};

export const createNote = async (payload: {
  title: string;
  content: string;
  tag: Note['tag'];
}): Promise<Note> => {
  const res = await api.post('/notes', payload);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
};


export const register = async (email: string, password: string): Promise<User> => {
  const res = await api.post('/auth/register', { email, password });
  return res.data;
};

export const login = async (email: string, password: string): Promise<User> => {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const res = await api.get('/auth/session');
    return res.data;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  const res = await api.get('/users/me');
  return res.data;
};

export const updateMe = async (data: { username: string }): Promise<User> => {
  const res = await api.patch('/users/me', data);
  return res.data;
};
