'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe } from '@/lib/api/clientApi';

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
const [checking, setChecking] = useState(true);

useEffect(() => {
  const checkUser = async () => {
    if (!user) {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        router.push('/sign-in');
      } finally {
        setChecking(false);
      }
    } else {
      Promise.resolve().then(() => setChecking(false));
    }
  };

  checkUser();
}, [user, setUser, router]);

if (checking) return <p>Loading...</p>;


  return (
    <>
      <AuthNavigation />
      {children}
    </>
  );
}
