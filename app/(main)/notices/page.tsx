'use client';

import { useEffect, useState } from 'react';
import { useNotices } from '../../context/NoticesContext';
import { getSupabaseClient } from '../../../lib/supabaseClient';

export default function NoticesPage() {
  const { notices, addNotice, deleteNotice } = useNotices();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [folderFilter, setFolderFilter] = useState<'전체' | '중요' | '기타'>(
    '전체',
  );

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState<'전체' | '중요' | '기타'>('전체');
  const [selectedNoticeId, setSelectedNoticeId] = useState<number | null>(null);

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

  const selectedNotice =
    selectedNoticeId === null
      ? null
      : notices.find((n) => n.id === selectedNoticeId) ?? null;

  return (
    <div className="space-y-4">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sky-700">
            공지사항
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            가이드가 올린 중요한 안내를 확인하세요.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-sky-100 bg-white shadow-sm text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setFolderFilter('전체')}
            className={`px-3 py-1.5 rounded-l-lg font-medium ${
              folderFilter === '전체'
                ? 'bg-sky-500 text-white'
                : 'text-gray-600 hover:bg-sky-50'
            }`}
          >
            전체
          </button>
          <button
            type="button"
            onClick={() => setFolderFilter('중요')}
            className={`px-3 py-1.5 font-medium ${
              folderFilter === '중요'
                ? 'bg-sky-500 text-white'
                : 'text-gray-600 hover:bg-sky-50'
            }`}
          >
            중요
          </button>
          <button
            type="button"
            onClick={() => setFolderFilter('기타')}
            className={`px-3 py-1.5 rounded-r-lg font-medium ${
              folderFilter === '기타'
                ? 'bg-sky-500 text-white'
                : 'text-gray-600 hover:bg-sky-50'
            }`}
          >
            기타
          </button>
        </div>
      </header>

      <section className="bg-white shadow-md rounded-2xl border border-sky-100 p-3 sm:p-4 space-y-4">
        <div className="space-y-2 max-h-[420px] overflow-y-auto text-xs sm:text-sm">
          {filteredNotices.length === 0 && (
            <p className="text-gray-500 text-sm">
              등록된 공지사항이 없습니다.
            </p>
          )}
          {filteredNotices
            .slice()
            .reverse()
            .map((notice) => (
              <article
                key={notice.id}
                className="p-3 rounded-lg bg-sky-50 border border-sky-100 cursor-pointer hover:bg-sky-100 transition"
                onClick={() => setSelectedNoticeId(notice.id)}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-white border border-sky-100 text-sky-600 whitespace-nowrap">
                    {notice.folder}
                  </span>
                  {isGuide && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotice(notice.id);
                      }}
                      className="text-[10px] sm:text-[11px] text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <h2 className="text-sm sm:text-base font-semibold text-gray-800 break-words">
                  {notice.title}
                </h2>
                {notice.content && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 whitespace-pre-line break-words">
                    {notice.content}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(notice.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
        </div>

        {selectedNotice && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
            onClick={() => setSelectedNoticeId(null)}
          >
            <div
              className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-sky-100 p-4 space-y-3 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-50 border border-sky-100 text-[11px] text-sky-700">
                    {selectedNotice.folder}
                  </span>
                  <h2 className="mt-2 text-base sm:text-lg font-semibold text-gray-900 break-words">
                    {selectedNotice.title}
                  </h2>
                </div>
                <button
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600"
                  aria-label="닫기"
                  onClick={() => setSelectedNoticeId(null)}
                >
                  ✕
                </button>
              </div>
              {selectedNotice.content && (
                <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line break-words">
                  {selectedNotice.content}
                </p>
              )}
              <p className="text-[11px] text-gray-400">
                {new Date(selectedNotice.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {isGuide ? (
          <form
            onSubmit={handleAddNotice}
            className="pt-3 border-t border-sky-100 space-y-2 text-xs sm:text-sm"
          >
            <h2 className="text-sm font-semibold text-gray-800">
              새 공지 작성
            </h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목"
              className="w-full border border-sky-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-sm"
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용 (선택)"
              className="w-full border border-sky-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-sm"
              rows={3}
            />
            <select
              value={folder}
              onChange={(e) =>
                setFolder(e.target.value as '전체' | '중요' | '기타')
              }
              className="w-full border border-sky-100 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 text-sm bg-white"
            >
              <option value="전체">전체</option>
              <option value="중요">중요</option>
              <option value="기타">기타</option>
            </select>
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-md"
            >
              공지 저장
            </button>
          </form>
        ) : (
          <p className="text-[11px] text-gray-500 pt-2 border-t border-sky-100">
            공지사항은 가이드 계정만 작성·수정·삭제할 수 있습니다.
          </p>
        )}
      </section>
    </div>
  );
}

