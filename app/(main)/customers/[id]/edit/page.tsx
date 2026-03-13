'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCustomers } from '../../../../context/CustomersContext';

export default function EditCustomerPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { getCustomerById, updateCustomer } = useCustomers();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tour, setTour] = useState('');
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (!params?.id) return;
    const customerId = Number(params.id);
    const customer = getCustomerById(customerId);

    if (!customer) {
      router.replace('/customers');
      return;
    }

    setName(customer.name);
    setEmail(customer.email);
    setPhone(customer.phone);
    setTour(customer.tour);
    setMemo(customer.memo ?? '');
  }, [params, getCustomerById, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!params?.id) return;

    const customerId = Number(params.id);
    await updateCustomer({
      id: customerId,
      name,
      email,
      phone,
      tour,
      memo: memo.trim() || null,
    });

    router.push('/customers');
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">고객 정보 수정</h1>
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

