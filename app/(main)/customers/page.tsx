'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCustomers } from '../../context/CustomersContext';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function CustomersPage() {
  const { customers, addCustomer, deleteCustomer } = useCustomers();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [selfSynced, setSelfSynced] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setUserEmail(user?.email ?? null);
      const meta = user?.user_metadata || {};
      setUserName((meta.name as string | undefined) || user?.email || null);
      setUserPhone((meta.phone as string | undefined) || null);
    };
    void loadUser();
  }, []);

  useEffect(() => {
    if (selfSynced) return;
    if (!userEmail) return;

    void (async () => {
      const supabase = getSupabaseClient();
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('id')
          .eq('email', userEmail)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Failed to check existing customer for current guide', error);
          setSelfSynced(true);
          return;
        }

        if (data) {
          setSelfSynced(true);
          return;
        }

        await addCustomer({
          name: userName || userEmail,
          email: userEmail,
          phone: userPhone || '',
          tour: '가이드 회원',
          memo: null,
        });
      } catch (err) {
        console.error('Failed to auto-sync signed-up guide into customers table', err);
      } finally {
        setSelfSynced(true);
      }
    })();
  }, [addCustomer, selfSynced, userEmail, userName, userPhone]);

  const rawGuideEmails = process.env.NEXT_PUBLIC_GUIDE_EMAIL || '';
  const guideEmails = rawGuideEmails
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  const isGuide =
    guideEmails.length === 0 ||
    (userEmail !== null && guideEmails.includes(userEmail.toLowerCase()));

  // 가이드가 아닌 경우: 고객 관리 페이지 자체를 숨김
  if (!isGuide) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h1 className="text-xl font-semibold text-gray-800 mb-3">
          접근 권한이 없습니다.
        </h1>
        <p className="text-sm text-gray-500">
          고객 관리 메뉴는 가이드 전용 기능입니다.
        </p>
      </div>
    );
  }

  const handleDelete = (id: number) => {
    if (!isGuide) return;
    if (window.confirm('정말 이 고객을 삭제하시겠습니까?')) {
      void deleteCustomer(id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">고객 관리</h1>
        <Link
          href="/customers/new"
          className="inline-flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded text-sm"
        >
          + 새 고객 추가
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-2xl border border-sky-100 p-3 sm:p-4 overflow-x-auto">
        <table className="min-w-full table-fixed text-xs sm:text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 sm:px-3 py-2 text-left w-20 sm:w-24">이름</th>
              <th className="px-2 sm:px-3 py-2 text-left w-32 sm:w-40">이메일</th>
              <th className="px-2 sm:px-3 py-2 text-left w-24 sm:w-28">
                전화번호
              </th>
              <th className="px-2 sm:px-3 py-2 text-left w-40 sm:w-56">
                기본 정보
              </th>
              <th className="px-2 sm:px-3 py-2 text-left w-40 sm:w-64">
                가이드 메모
              </th>
              <th className="px-2 sm:px-3 py-2 text-left w-20 sm:w-24">관리</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b align-top">
                <td className="px-2 sm:px-3 py-2 break-words">{customer.name}</td>
                <td className="px-2 sm:px-3 py-2 break-all">{customer.email}</td>
                <td className="px-2 sm:px-3 py-2 whitespace-nowrap">
                  {customer.phone}
                </td>
                <td className="px-2 sm:px-3 py-2 break-words">
                  {customer.tour}
                </td>
                <td className="px-2 sm:px-3 py-2 break-words text-[11px] sm:text-xs text-gray-700">
                  {customer.memo || '-'}
                </td>
                <td className="px-2 sm:px-3 py-2">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 text-[11px] sm:text-xs">
                    <Link
                      href={`/customers/${customer.id}/edit`}
                      className="text-sky-600 hover:underline"
                    >
                      수정
                    </Link>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-[11px] text-gray-500">
          이 페이지의 고객 정보와 메모는 가이드 계정에서만 보입니다.
        </p>
      </div>
    </div>
  );
}
