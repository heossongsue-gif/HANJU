'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTours } from '../../context/ToursContext';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function ToursPage() {
  const { tours, deleteTour } = useTours();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? null);
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

  const handleDelete = (id: number) => {
    if (!isGuide) return;
    if (window.confirm('정말 이 투어를 삭제하시겠습니까?')) {
      void deleteTour(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">투어 관리</h1>
        {isGuide && (
          <Link
            href="/tours/new"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
          >
            + 새 투어 추가
          </Link>
        )}
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm">투어 이름</th>
              <th className="px-4 py-2 text-left text-sm">시작일</th>
              <th className="px-4 py-2 text-left text-sm">종료일</th>
              <th className="px-4 py-2 text-left text-sm">담당 가이드</th>
              <th className="px-4 py-2 text-left text-sm">관리</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="border-b">
                <td className="px-4 py-2 text-sm">{tour.name}</td>
                <td className="px-4 py-2 text-sm">{tour.startDate}</td>
                <td className="px-4 py-2 text-sm">{tour.endDate}</td>
                <td className="px-4 py-2 text-sm">{tour.guide}</td>
                <td className="px-4 py-2 text-sm">
                  {isGuide ? (
                    <>
                      <Link
                        href={`/tours/${tour.id}/edit`}
                        className="text-sky-600 hover:underline mr-2"
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(tour.id)}
                        className="text-red-500 hover:underline"
                      >
                        삭제
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-xs">
                      조회 전용
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
