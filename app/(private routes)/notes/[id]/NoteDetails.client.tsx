'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';
import css from './NoteDetails.module.css';

type Props = {
  id: string;
};

export default function NoteDetailsClient({ id }: Props) {
  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !note) {
    throw new Error('Failed to load note');
  }

  return (
    <div className={css.container}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>{note.createdAt}</p>
    </div>
  );
}
