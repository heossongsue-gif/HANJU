'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCustomers } from '../../context/CustomersContext';
import { useNotices } from '../../context/NoticesContext';
import { supabase } from '../../../lib/supabaseClient';

export default function CustomersPage() {
  const { customers, deleteCustomer } = useCustomers();
  const { notices, addNotice, deleteNotice } = useNotices();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState('전체');
  const [activePane, setActivePane] = useState<'customers' | 'notices'>('customers');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('전체');

  useEffect(() => {
    const loadUser = async () => {
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
    if (window.confirm('정말 이 고객을 삭제하시겠습니까?')) {
      void deleteCustomer(id);
    }
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isGuide) return;
    if (!title.trim()) return;

    addNotice({
      title: title.trim(),
      content: content.trim(),
      folder: folder || '전체',
    });

    setTitle('');
    setContent('');
  };

  const filteredNotices =
    folderFilter === '전체'
      ? notices
      : notices.filter((n) => n.folder === folderFilter);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">고객 관리</h1>
        {isGuide && (
          <Link
            href="/customers/new"
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded"
          >
            + 새 고객 추가
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* 왼쪽 메뉴 */}
        <aside className="bg-white shadow-md rounded-2xl border border-sky-100 p-4 lg:col-span-1 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-gray-800">메뉴</h2>
          <button
            onClick={() => setActivePane('customers')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activePane === 'customers'
                ? 'bg-sky-500 text-white'
                : 'bg-sky-50 text-gray-700 hover:bg-sky-100'
            }`}
          >
            고객 목록
          </button>
          <button
            onClick={() => setActivePane('notices')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activePane === 'notices'
                ? 'bg-sky-500 text-white'
                : 'bg-sky-50 text-gray-700 hover:bg-sky-100'
            }`}
          >
            공지사항
          </button>
          <p className="text-[11px] text-gray-500 mt-2">
            공지사항 작성 및 삭제는 가이드 계정만 가능합니다.
          </p>
        </aside>

        {/* 오른쪽 콘텐츠 */}
        <section className="bg-white shadow-md rounded-2xl border border-sky-100 p-4 lg:col-span-3">
          {activePane === 'customers' && (
            <div className="bg-white rounded">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm">이름</th>
                    <th className="px-4 py-2 text-left text-sm">이메일</th>
                    <th className="px-4 py-2 text-left text-sm">전화번호</th>
                    <th className="px-4 py-2 text-left text-sm">배정된 투어</th>
                    <th className="px-4 py-2 text-left text-sm">관리</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b">
                      <td className="px-4 py-2 text-sm">{customer.name}</td>
                      <td className="px-4 py-2 text-sm">{customer.email}</td>
                      <td className="px-4 py-2 text-sm">{customer.phone}</td>
                      <td className="px-4 py-2 text-sm">{customer.tour}</td>
                      <td className="px-4 py-2 text-sm">
                        {isGuide ? (
                          <>
                            <Link
                              href={`/customers/${customer.id}/edit`}
                              className="text-sky-600 hover:underline mr-2"
                            >
                              수정
                            </Link>
                            <button
                              onClick={() => handleDelete(customer.id)}
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
          )}

          {activePane === 'notices' && (
            <div className="flex flex-col gap-3 h-full">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">공지사항</h2>
                <select
                  value={folderFilter}
                  onChange={(e) => setFolderFilter(e.target.value)}
                  className="text-xs border border-sky-100 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
                >
                  <option value="전체">전체</option>
                  <option value="중요">중요</option>
                  <option value="문의">문의 관련</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto max-h-80 space-y-2 text-sm">
                {filteredNotices.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    등록된 공지사항이 없습니다.
                  </p>
                )}
                {filteredNotices
                  .slice()
                  .reverse()
                  .map((notice) => (
                    <div
                      key={notice.id}
                      className="p-2 rounded-lg bg-sky-50 border border-sky-100"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-sky-100 text-sky-600">
                          {notice.folder}
                        </span>
                        {isGuide && (
                          <button
                            onClick={() => deleteNotice(notice.id)}
                            className="text-[11px] text-red-500 hover:underline"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {notice.title}
                      </h3>
                      {notice.content && (
                        <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">
                          {notice.content}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(notice.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
              </div>

              {isGuide ? (
                <form onSubmit={handleAddNotice} className="pt-2 border-t border-sky-100 space-y-2">
                  <h3 className="text-sm font-semibold text-gray-800">
                    새 공지 작성
                  </h3>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목"
                    className="w-full border border-sky-100 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                    required
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용 (선택)"
                    className="w-full border border-sky-100 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                    rows={3}
                  />
                  <select
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="w-full border border-sky-100 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                  >
                    <option value="전체">전체</option>
                    <option value="중요">중요</option>
                    <option value="문의">문의 관련</option>
                    <option value="기타">기타</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2 rounded-md"
                  >
                    공지 저장
                  </button>
                </form>
              ) : (
                <p className="text-[11px] text-gray-500 pt-2 border-t border-sky-100">
                  공지사항은 가이드 계정만 작성·수정·삭제할 수 있습니다.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
