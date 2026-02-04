'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    
    router.refresh();
  }, [router]);

  return <div>{children}</div>;
}