import type { Metadata } from 'next';
import css from './Home.module.css';

export const metadata: Metadata = {
  title: 'Page not found | NoteHub',
  description: 'The page you are looking for does not exist',
  openGraph: {
    title: 'Page not found | NoteHub',
    description: 'The page you are looking for does not exist',
    url: 'https://your-vercel-url.vercel.app/not-found',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      },
    ],
  },
};


export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
