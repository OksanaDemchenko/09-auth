// lib/api/serverApi.ts
import axios from 'axios';
import type { Note } from '../../types/note';
import type { User } from '../../types/user';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const serverApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});

export const fetchNotes = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<Note[]> => {
  const response = await serverApi.get<Note[]>('/notes', { params });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await serverApi.get<Note>(`/notes/${id}`);
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await serverApi.get<User>('/users/me');
  return response.data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const response = await serverApi.get<User>('/auth/session');
    return response.data || null;
  } catch {
    throw new Error('Failed to fetch');
  }
};
