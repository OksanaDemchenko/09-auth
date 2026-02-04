import { notFound } from 'next/navigation';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';
import css from './NotesPage.module.css';


import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from '@tanstack/react-query';

const ALLOWED_SLUGS = ['work', 'personal', 'all'];

export async function generateMetadata(
  { params }: { params: Promise<{ slug?: string[] }> }
): Promise<Metadata> {
  const { slug } = await params; 
  const slugParam = slug?.[0];

  if (!slugParam || !ALLOWED_SLUGS.includes(slugParam)) {
    return {
      title: 'Notes | NoteHub',
      description: 'Filter notes in NoteHub',
      openGraph: {
        title: 'Notes | NoteHub',
        description: 'Filter notes in NoteHub',
        url: 'https://your-vercel-url.vercel.app/notes/filter',
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          },
        ],
      },
    };
  }

    const tagName= slugParam === 'all'
    ? 'All'
    : slugParam.charAt(0).toUpperCase() + slugParam.slice(1);



  return {
    title: `${tagName} notes | NoteHub`,
    description: `Viewing ${tagName} notes in NoteHub`,
    openGraph: {
      title: `${tagName} notes | NoteHub`,
      description: `Viewing ${tagName} notes in NoteHub`,
      url: `https://your-vercel-url.vercel.app/notes/filter/${slugParam}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        },
      ],
    },
  };
}

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function NotesFilterPage({ params }: Props) {
  const { slug } = await params; 
  const slugParam = slug?.[0];

if (slugParam && !ALLOWED_SLUGS.includes(slugParam)) {
  notFound();
}


  const tag = slugParam === 'all' ? undefined : slugParam;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, tag, ''],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        tag,
        search: undefined,
      }),
  });

  return (
     <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={css.app}>
        <div className={css.toolbar}>
          <button className={css.button}>Filter Notes</button>
        </div>
        <NotesClient tag={tag} />
      </div>
    </HydrationBoundary>
  );
}
