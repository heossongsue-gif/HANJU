'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCustomers } from '../../../context/CustomersContext';

export default function NewCustomerPage() {
  const router = useRouter();
  const { addCustomer } = useCustomers();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tour, setTour] = useState('');
  const [memo, setMemo] = useState('');
  const [stayStartDate, setStayStartDate] = useState('');
  const [stayEndDate, setStayEndDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCustomer({
      name,
      email,
      phone,
      tour,
      memo: memo.trim() || null,
      stayStartDate: stayStartDate || null,
      stayEndDate: stayEndDate || null,
    } as any);
    router.push('/customers');
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">새 고객 등록</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 rounded-lg shadow-md space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            이름
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            이메일
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            전화번호
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            id="phone"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stayStartDate">
              투어 시작일
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="stayStartDate"
              type="date"
              value={stayStartDate}
              onChange={(e) => setStayStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stayEndDate">
              투어 종료일
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              id="stayEndDate"
              type="date"
              min={stayStartDate || undefined}
              value={stayEndDate}
              onChange={(e) => setStayEndDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tour">
            방문 경로나 간단 정보
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            id="tour"
            type="text"
            value={tour}
            onChange={(e) => setTour(e.target.value)}
            placeholder="예: 6월 제주 3박4일, 1조 배정"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="memo">
            가이드 메모 (가이드만 볼 수 있음)
          </label>
          <textarea
            id="memo"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            rows={3}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="예: 알레르기, 특이사항, 요청 사항 등"
          />
        </div>
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
}

