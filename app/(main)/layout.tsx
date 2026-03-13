'use client';

import Navbar from '../components/Navbar';
import { ToursProvider } from '../context/ToursContext';
import { CustomersProvider } from '../context/CustomersContext';
import { ScheduleProvider } from '../context/ScheduleContext';
import { NoticesProvider } from '../context/NoticesContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/login');
      } else {
        setChecking(false);
      }
    };

    void checkAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-50">
        <div className="text-sky-600 font-semibold">로그인 상태를 확인하는 중입니다...</div>
      </div>
    );
  }

  return (
    <ScheduleProvider>
      <NoticesProvider>
        <ToursProvider>
          <CustomersProvider>
            <div className="min-h-screen bg-sky-50">
              <Navbar />
              <main className="container mx-auto p-4">{children}</main>
            </div>
          </CustomersProvider>
        </ToursProvider>
      </NoticesProvider>
    </ScheduleProvider>
  );
}
