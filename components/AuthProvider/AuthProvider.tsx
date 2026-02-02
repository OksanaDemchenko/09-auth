'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, logout } from '@/lib/api/clientApi';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [checking, setChecking] = useState(true);

  const privateRoutes = ['/profile', '/profile/edit', '/notes'];
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    const verifySession = async () => {
      setChecking(true);
      try {
        const currentUser = await checkSession();
        if (currentUser) {
          setUser(currentUser);
        } else {
          if (isPrivateRoute) {
            await logout();
            setUser(null);
            router.push('/sign-in');
          }
        }
      } catch (err) {
        console.error('Session check failed', err);
        if (isPrivateRoute) {
          await logout();
          setUser(null);
          router.push('/sign-in');
        }
      } finally {
        setChecking(false);
      }
    };

    verifySession();
  }, [pathname, isPrivateRoute, router, setUser]);

  if (checking) {
    return <p>Loading...</p>; 
  }

  if (isPrivateRoute && !user) {
    return null;
  }

  return <>{children}</>;
}
