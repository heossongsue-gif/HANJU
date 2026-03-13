'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        router.replace('/login');
        return;
      }
      setEmail(user.email ?? null);
      const meta = user.user_metadata || {};
      setName((meta.name as string | undefined) || '');
      setGroup((meta.group as string | undefined) || '');
      setLoading(false);
    };
    void load();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSaving(true);

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name: name.trim(),
        group: group.trim(),
      },
    });

    setSaving(false);

    if (updateError) {
      setError('프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    setInfo('프로필이 저장되었습니다.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-sky-600 font-semibold">프로필 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md border border-sky-100 p-6">
      <h1 className="text-2xl font-bold text-sky-700 mb-1">프로필 설정</h1>
      <p className="text-gray-500 text-sm mb-6">
        가이드 이름과 조 편성을 수정할 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            이메일
          </label>
          <div className="text-sm text-gray-600 bg-sky-50 border border-sky-100 rounded-md px-3 py-2">
            {email}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
            이름
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-sky-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            placeholder="예: 짱아님"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="group">
            조 편성
          </label>
          <input
            id="group"
            type="text"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full border border-sky-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            placeholder="예: 1조, 2조, 제주 1팀 등"
          />
          <p className="text-[11px] text-gray-500 mt-1">
            예) 1조, 2조 처럼 자유롭게 입력해서 가이드/투어객을 그룹으로 나눌 수 있습니다.
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {info && <p className="text-sm text-sky-600">{info}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            뒤로가기
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm font-semibold rounded-md bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-60"
          >
            {saving ? '저장 중...' : '프로필 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}

