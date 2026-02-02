'use client';

import Link from 'next/link';
import css from './SidebarNotes.module.css';

const TAGS = ['work', 'personal', 'todo', 'meeting', 'shopping'];

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/filter/all" className={css.menuLink}>
          All notes
        </Link>
      </li>

      {TAGS.map(tag => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${tag}`}
            className={css.menuLink}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </Link>
        </li>
      ))}
    </ul>
  );
}


