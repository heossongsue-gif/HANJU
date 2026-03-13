'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (password !== confirmPassword) {
      setError('비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    const supabase = getSupabaseClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(`회원가입 오류: ${signUpError.message}`);
      return;
    }

    setInfo('회원가입이 완료되었습니다. 이메일을 확인하고 인증을 완료해주세요!');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sky-50">
      <div className="p-8 bg-white rounded-2xl shadow-xl w-full max-w-md border border-sky-100">
        <h1 className="text-2xl font-bold text-center mb-2 text-sky-700">한주 투어 가이드 회원가입</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          가이드 전용 계정을 생성하고 투어 일정을 편하게 관리해 보세요.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
              이름
            </label>
            <input
              className="shadow-sm appearance-none border border-sky-100 rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="홍길동"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
              이메일
            </label>
            <input
              className="shadow-sm appearance-none border border-sky-100 rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="guide@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
              비밀번호
            </label>
            <input
              className="shadow-sm appearance-none border border-sky-100 rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="8자 이상 입력하세요"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
              비밀번호 확인
            </label>
            <input
              className="shadow-sm appearance-none border border-sky-100 rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {info && <p className="text-sm text-sky-600">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-60"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-sky-600 font-semibold hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}

