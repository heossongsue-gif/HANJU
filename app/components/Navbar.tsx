'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function Navbar() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        setDisplayName(null);
        setGroup(null);
        setUserEmail(null);
        return;
      }
      const meta = user.user_metadata || {};
      const nameInMeta = (meta.name as string | undefined) || null;
      const groupInMeta = (meta.group as string | undefined) || null;
      setDisplayName(nameInMeta || user.email || null);
      setGroup(groupInMeta || null);
       setUserEmail(user.email ?? null);
    };

    void loadUser();
  }, []);

  const rawGuideEmails = process.env.NEXT_PUBLIC_GUIDE_EMAIL || '';
  const guideEmails = rawGuideEmails
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  const isGuide =
    guideEmails.length === 0 ||
    (userEmail !== null && guideEmails.includes(userEmail.toLowerCase()));

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-sky-100">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/dashboard" className="font-bold text-xl text-sky-600">
          한주 투어 가이드
        </Link>
        <div className="space-x-2">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-600"
          >
            일정
          </Link>
          {isGuide && (
            <Link
              href="/customers"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-600"
            >
              고객 관리
            </Link>
          )}
          <Link
            href="/notices"
            className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-sky-50 hover:text-sky-600"
          >
            공지사항
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {displayName && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-700 bg-sky-50 border border-sky-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
                {group && (
                  <span className="text-xs font-semibold text-sky-600">{group}</span>
                )}
                <span className="font-semibold text-sky-700">{displayName}</span>
                <span className="ml-1">님</span>
              </div>
              <Link
                href="/profile"
                className="text-xs text-sky-600 underline-offset-2 hover:underline"
              >
                프로필
              </Link>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold"
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}
