'use client';

import Image from 'next/image';
import Link from 'next/link';
import css from './ProfilePage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);

  if (!user) return null; 

  const handleLogout = async () => {
    try {
      await logout();
      clearUser();
      router.push('/sign-in');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
            <h1 className={css.formTitle}>Profile Page</h1>
            <div className={css.actions}>
                <Link href="/profile/edit" className={css.editProfileButton}>
                Edit Profile
                 </Link>
                 
                 <button
                 type="button"
                 onClick={handleLogout}
                 className={css.logoutButton}
                 >
                    Log out
                    </button>
             </div>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || '/default-avatar.png'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
