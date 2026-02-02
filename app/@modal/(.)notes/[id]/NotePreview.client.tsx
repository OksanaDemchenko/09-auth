'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';

type Props = {
  id: string;
};

type Note = {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
};

export default function NoteModalClient({ id }: Props) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false, 
  });

  if (isLoading) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Loading note...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Failed to load note</p>
      </Modal>
    );
  }

  return (
    <Modal onClose={() => router.back()}>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <p>
        <strong>Tag:</strong> {note.tag}
      </p>
      <p>
        <strong>Created:</strong>{' '}
        {new Date(note.createdAt).toLocaleDateString()}
      </p>
    </Modal>
  );
}
