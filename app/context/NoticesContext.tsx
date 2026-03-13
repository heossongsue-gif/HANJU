'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupabaseClient } from '../../lib/supabaseClient';

export interface Notice {
  id: string;
  title: string;
  content: string;
  folder: string; // 예: "전체", "중요", "문의"
  createdAt: string;
}

interface NoticesContextType {
  notices: Notice[];
  addNotice: (input: Omit<Notice, 'id' | 'createdAt'>) => Promise<void>;
  updateNotice: (notice: Notice) => Promise<void>;
  deleteNotice: (id: string) => Promise<void>;
}

const NoticesContext = createContext<NoticesContextType | undefined>(undefined);

export function NoticesProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('notices')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to load notices from Supabase', error);
          return;
        }

        const mapped: Notice[] =
          data?.map((row: any) => ({
            id: row.id,
            title: row.title,
            content: row.content ?? '',
            folder: row.folder ?? '전체',
            createdAt: row.created_at,
          })) ?? [];

        setNotices(mapped);
      } catch (err) {
        console.error('Unexpected error while loading notices', err);
      }
    };

    void loadNotices();
  }, []);

  const addNotice = async (input: Omit<Notice, 'id' | 'createdAt'>) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('notices')
      .insert({
        title: input.title,
        content: input.content ?? '',
        folder: input.folder ?? '전체',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add notice', error);
      return;
    }

    const created: Notice = {
      id: data.id,
      title: data.title,
      content: data.content ?? '',
      folder: data.folder ?? '전체',
      createdAt: data.created_at,
    };

    setNotices((prev) => [created, ...prev]);
  };

  const updateNotice = async (updated: Notice) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('notices')
      .update({
        title: updated.title,
        content: updated.content ?? '',
        folder: updated.folder ?? '전체',
      })
      .eq('id', updated.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update notice', error);
      return;
    }

    const saved: Notice = {
      id: data.id,
      title: data.title,
      content: data.content ?? '',
      folder: data.folder ?? '전체',
      createdAt: data.created_at,
    };

    setNotices((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
  };

  const deleteNotice = async (id: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('notices').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete notice', error);
      return;
    }

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

