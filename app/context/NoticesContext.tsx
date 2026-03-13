'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface Notice {
  id: string;
  title: string;
  content: string;
  folder: string; // 예: "전체", "중요", "문의"
  createdAt: string;
}

interface NoticesContextType {
  notices: Notice[];
  addNotice: (input: Omit<Notice, 'id' | 'createdAt'>) => void;
  updateNotice: (notice: Notice) => void;
  deleteNotice: (id: string) => void;
}

const NoticesContext = createContext<NoticesContextType | undefined>(undefined);

const STORAGE_KEY = 'hanju_notices_v1';

export function NoticesProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Notice[];
      setNotices(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
  }, [notices]);

  const addNotice = (input: Omit<Notice, 'id' | 'createdAt'>) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    setNotices((prev) => [...prev, { id, createdAt, ...input }]);
  };

  const updateNotice = (updated: Notice) => {
    setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NoticesContext.Provider value={{ notices, addNotice, updateNotice, deleteNotice }}>
      {children}
    </NoticesContext.Provider>
  );
}

export function useNotices() {
  const ctx = useContext(NoticesContext);
  if (!ctx) {
    throw new Error('useNotices must be used within a NoticesProvider');
  }
  return ctx;
}

