import type { Note } from '../../types/note';
import type { User } from '../../types/user';
import { api } from './api'; 
import { cookies } from 'next/headers';


export const fetchNotes = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}): Promise<Note[]> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await api.get<Note[]>('/notes', {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });
  return res.data;
};


export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const res = await api.get<User>('/users/me', {
    headers: { Cookie: cookieHeader },
  });
  return res.data;
};


export const checkSession = async () => {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const res = await api.get('/auth/session', {
      headers: { Cookie: cookieHeader },
    });
    return res; 
  } catch {
    return null;
  }
};
