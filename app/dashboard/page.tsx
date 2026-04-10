'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from '@/components/custom/dashboard';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
    }
  }, []);

  return <DashboardContent />;
}
