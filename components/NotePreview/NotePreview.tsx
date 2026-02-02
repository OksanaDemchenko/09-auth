'use client';
import { useState, useEffect } from 'react';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';
import { Note } from '@/types/note';
import css from './NotePreview.module.css';

interface Props {
  id: string;
  onClose: () => void;
}

export default function NotePreview({ id, onClose }: Props) {
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    fetchNoteById(id).then(setNote);
  }, [id]);

  if (!note) return <p>Loading...</p>;

  return (
    <Modal onClose={onClose}>
      <div className={css.container}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <button className={css.backBtn} onClick={onClose}>
            Back
          </button>
        </div>

        <div className={css.item}>
          <p className={css.content}>{note.content}</p>
          <p className={css.tag}>Tag: {note.tag}</p>
          <p className={css.date}>Created: {new Date(note.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </Modal>
  );
}
