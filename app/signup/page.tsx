'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient } from '../../lib/supabaseClient';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [stayStartDate, setStayStartDate] = useState('');
  const [stayEndDate, setStayEndDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!agreePrivacy) {
      setError('개인정보 수집·이용 동의가 필요합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 서로 일치하지 않습니다.');
      return;
    }

    if (!stayStartDate || !stayEndDate) {
      setError('투어 시작일과 종료일을 모두 선택해주세요.');
      return;
    }

    if (stayStartDate > stayEndDate) {
      setError('투어 시작일이 종료일보다 늦을 수 없습니다.');
      return;
    }

    setLoading(true);

    const supabase = getSupabaseClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          stayStartDate,
          stayEndDate,
        },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(`회원가입 오류: ${signUpError.message}`);
      return;
    }

    try {
      const signedUpEmail = data.user?.email ?? email;
      await supabase.from('customers').insert({
        name,
        email: signedUpEmail,
        phone,
        tour: '가이드 회원',
        memo: null,
        stay_start_date: stayStartDate,
        stay_end_date: stayEndDate,
      });
    } catch (customerError) {
      console.error('Failed to save signup user into customers table', customerError);
    }

    setLoading(false);
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
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="phone">
              전화번호
            </label>
            <input
              className="shadow-sm appearance-none border border-sky-100 rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="010-0000-0000"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="stayStart">
                투어 시작일
              </label>
              <input
                className="shadow-sm appearance-none border border-sky-100 rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                id="stayStart"
                type="date"
                value={stayStartDate}
                onChange={(e) => setStayStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="stayEnd">
                투어 종료일
              </label>
              <input
                className="shadow-sm appearance-none border border-sky-100 rounded w-full py-2.5 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                id="stayEnd"
                type="date"
                value={stayEndDate}
                min={stayStartDate || undefined}
                onChange={(e) => setStayEndDate(e.target.value)}
                required
              />
            </div>
            <p className="sm:col-span-2 mt-1 text-[11px] text-gray-500">
              달력에서 투어 시작일과 종료일을 선택하면, 그 기간에 해당하는 일정만 메인 화면에서 선택할 수 있습니다.
            </p>
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
          <div className="space-y-2 text-xs text-gray-600 border border-sky-100 rounded-lg p-3 bg-sky-50/40">
            <div className="max-h-32 overflow-y-auto text-[11px] leading-relaxed">
              <p className="font-semibold mb-1">[필수] 개인정보 수집·이용 동의</p>
              <p>
                한주 투어 가이드는 회원가입 및 서비스 제공을 위해 다음과 같은 개인정보를
                수집·이용합니다.
              </p>
              <ul className="list-disc list-inside mt-1">
                <li>수집 항목: 이름, 이메일, 비밀번호, 전화번호</li>
                <li>이용 목적: 가이드 본인 확인, 계정 관리, 서비스 안내 및 고객 문의 대응</li>
                <li>보유 기간: 회원 탈퇴 시까지 또는 관련 법령에서 정한 기간</li>
              </ul>
              <p className="mt-1">
                위 개인정보 수집·이용에 동의하지 않으실 수 있으나, 이 경우 서비스 이용이 제한될 수 있습니다.
              </p>
            </div>
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-sky-300 text-sky-500 focus:ring-sky-400"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
              />
              <span>위 개인정보 수집·이용 방침을 읽고 동의합니다. (필수)</span>
            </label>
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

