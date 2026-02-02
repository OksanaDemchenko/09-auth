'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';

import { fetchNotes, type FetchNotesResponse } from '@/lib/api/clientApi';
import type { NoteTag } from '@/types/note';

import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';

import css from './NotesPage.module.css';

const PER_PAGE = 12;


const VALID_TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

interface NotesClientProps {
  tag?: string; 
}


function formatTag(tag?: string): NoteTag | undefined {
  if (!tag) return undefined;
  const formatted = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
  return VALID_TAGS.includes(formatted as NoteTag) ? (formatted as NoteTag) : undefined;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);


  const validTag = formatTag(tag);

  const { data, isFetching } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, validTag, debouncedSearch],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        tag: validTag,
        search: debouncedSearch || undefined,
      }),
     
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {isFetching ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes found</p>
      ) : (
        <NoteList notes={notes} />
      )}
    </div>
  );
}
