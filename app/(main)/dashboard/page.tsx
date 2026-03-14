'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../../../lib/supabaseClient';
import { useSchedule } from '../../context/ScheduleContext';

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stayStartDate, setStayStartDate] = useState<string | null>(null);
  const [stayEndDate, setStayEndDate] = useState<string | null>(null);
  const { getEventsByDate, addEvent, deleteEvent } = useSchedule();

  useEffect(() => {
    const loadUser = async () => {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      setUserEmail(user?.email ?? null);
      const meta = user?.user_metadata || {};
      const start = meta.stayStartDate as string | undefined;
      const end = meta.stayEndDate as string | undefined;
      if (start && end) {
        setStayStartDate(start);
        setStayEndDate(end);
      }
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

  const { year, month, weeks } = useMemo(() => {
    const base = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const year = base.getFullYear();
    const month = base.getMonth();
    const firstDayOfWeek = base.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    while (days.length % 7 !== 0) {
      days.push(null);
    }

    const weeks: (number | null)[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return { year, month, weeks };
  }, [currentDate]);

  const monthLabel = useMemo(
    () => `${year}년 ${month + 1}월`,
    [year, month],
  );

  const goPrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const today = new Date();

  const stayStartTime =
    stayStartDate != null
      ? new Date(`${stayStartDate}T00:00:00`).getTime()
      : null;
  const stayEndTime =
    stayEndDate != null
      ? new Date(`${stayEndDate}T23:59:59`).getTime()
      : null;

  const selectedDateKey =
    selectedDate &&
    `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
      selectedDate.getDate(),
    ).padStart(2, '0')}`;

  const eventsForSelectedDate = selectedDateKey
    ? getEventsByDate(selectedDateKey)
    : [];

  const [newTitle, setNewTitle] = useState('');
  const [newMemo, setNewMemo] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDateKey || !newTitle.trim()) return;

    addEvent({
      date: selectedDateKey,
      title: newTitle.trim(),
      memo: newMemo.trim() || undefined,
      linkUrl: newLinkUrl.trim() || undefined,
    });

    setNewTitle('');
    setNewMemo('');
    setNewLinkUrl('');
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-sky-700">
            가이드 일정 관리
          </h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            이 달의 투어 일정을 한 눈에 확인하세요.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <section className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-sky-100 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={goPrevMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sky-600 hover:bg-sky-50"
                aria-label="이전 달"
              >
                ‹
              </button>
              <span className="text-base md:text-lg font-semibold text-gray-800">
                {monthLabel}
              </span>
              <button
                onClick={goNextMonth}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sky-600 hover:bg-sky-50"
                aria-label="다음 달"
              >
                ›
              </button>
            </div>
            <div className="text-xs text-gray-500">
              오늘: {today.getFullYear()}-{today.getMonth() + 1}-{today.getDate()}
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-xs font-semibold text-sky-600 mb-2">
            <div>일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div>토</div>
          </div>

          <div className="space-y-1">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-1">
                {week.map((day, di) => {
                  if (day === null) {
                    return <div key={di} className="h-16 rounded-lg bg-transparent" />;
                  }

                  const isToday =
                    today.getFullYear() === year &&
                    today.getMonth() === month &&
                    today.getDate() === day;

                  const isSelected =
                    selectedDate &&
                    selectedDate.getFullYear() === year &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getDate() === day;

                  const thisDateTime = new Date(
                    year,
                    month,
                    day,
                  ).getTime();
                  const isInRange =
                    stayStartTime === null || stayEndTime === null
                      ? true
                      : thisDateTime >= stayStartTime &&
                        thisDateTime <= stayEndTime;

                  return (
                    <button
                      key={di}
                      onClick={() => {
                        if (!isInRange) return;
                        setSelectedDate(new Date(year, month, day));
                      }}
                      className={`h-20 rounded-lg border text-[11px] md:text-xs flex flex-col items-start p-1.5 transition ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50'
                          : isToday
                          ? 'border-sky-300 bg-sky-50'
                          : 'border-sky-50 hover:border-sky-200 hover:bg-sky-50'
                      } ${
                        !isInRange
                          ? 'opacity-40 cursor-not-allowed hover:bg-white hover:border-sky-50'
                          : ''
                      }`}
                      >
                      <span
                        className={`text-sm md:text-base font-semibold ${
                          isToday || isSelected ? 'text-sky-600' : 'text-gray-700'
                        }`}
                      >
                        {day}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* Right side panel */}
        <section className="bg-white rounded-2xl shadow-md border border-sky-100 p-4 md:p-6">
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  {selectedDateKey
                    ? `${selectedDateKey} 일정`
                    : '날짜를 선택하세요'}
                </h2>
                {isGuide && selectedDateKey && (
                  <span className="text-xs text-sky-600 font-medium">
                    가이드 전용: 일정 추가/수정 가능
                  </span>
                )}
              </div>

              {selectedDateKey ? (
                <>
                  <ul className="space-y-2 text-sm text-gray-700 max-h-40 overflow-y-auto">
                    {eventsForSelectedDate.length === 0 && (
                      <li className="p-3 rounded-lg bg-sky-50 border border-sky-100 text-gray-500 text-sm">
                        아직 등록된 일정이 없습니다.
                      </li>
                    )}
                    {eventsForSelectedDate.map((ev) => (
                      <li
                        key={ev.id}
                        className="p-3 rounded-lg bg-sky-50 border border-sky-100 flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-gray-800">
                            {ev.title}
                          </span>
                          {isGuide && (
                            <button
                              onClick={() => deleteEvent(ev.id)}
                              className="text-xs text-red-500 hover:underline"
                            >
                              삭제
                            </button>
                          )}
                        </div>
                        {ev.memo && (
                          <p className="text-xs text-gray-600">{ev.memo}</p>
                        )}
                        {ev.linkUrl && (
                          <div className="flex flex-col gap-1 text-[11px]">
                            {ev.linkUrl && (
                              <a
                                href={ev.linkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-600 hover:underline break-all"
                              >
                                관련 링크 열기
                              </a>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {isGuide && (
                    <form onSubmit={handleCreateEvent} className="space-y-2 pt-2 border-t border-sky-100">
                      <h3 className="text-sm font-semibold text-gray-800">
                        새 일정 추가
                      </h3>
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="예: 09:00 제주 공항 픽업"
                        className="w-full border border-sky-100 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                        required
                      />
                      <textarea
                        value={newMemo}
                        onChange={(e) => setNewMemo(e.target.value)}
                        placeholder="메모 (선택)"
                        className="w-full border border-sky-100 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                        rows={2}
                      />
                      <input
                        type="url"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="관련 링크 URL (선택)"
                        className="w-full border border-sky-100 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2 rounded-md"
                      >
                        일정 저장
                      </button>
                    </form>
                  )}

                  {!isGuide && (
                    <p className="text-xs text-gray-500 pt-2 border-t border-sky-100">
                      이 일정은 조회만 가능합니다. (가이드 계정만 수정/삭제 가능)
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  일정 세부 정보를 보거나 추가하려면 달력에서 날짜를 먼저 선택하세요.
                </p>
              )}
          </div>
        </section>
      </div>
    </div>
  );
}
