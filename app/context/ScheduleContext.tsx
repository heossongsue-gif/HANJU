'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSupabaseClient } from '../../lib/supabaseClient';

export interface ScheduleEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  memo?: string | null;
  linkUrl?: string | null;
}

interface ScheduleContextType {
  events: ScheduleEvent[];
  getEventsByDate: (date: string) => ScheduleEvent[];
  addEvent: (event: Omit<ScheduleEvent, 'id'>) => Promise<void>;
  updateEvent: (event: ScheduleEvent) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from('schedule_events')
          .select('*')
          .order('date', { ascending: true });

        if (error) {
          console.error('Failed to load schedule events from Supabase', error);
          return;
        }

        const mapped: ScheduleEvent[] =
          data?.map((row: any) => ({
            id: row.id,
            date: row.date,
            title: row.title,
            memo: row.memo ?? null,
            linkUrl: row.link_url ?? null,
          })) ?? [];

        setEvents(mapped);
      } catch (err) {
        console.error('Unexpected error while loading schedule events', err);
      }
    };

    void loadEvents();
  }, []);

  const getEventsByDate = (date: string) =>
    events.filter((e) => e.date === date);

  const addEvent = async (input: Omit<ScheduleEvent, 'id'>) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('schedule_events')
      .insert({
        date: input.date,
        title: input.title,
        memo: input.memo ?? null,
        link_url: input.linkUrl ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add schedule event', error);
      return;
    }

    const created: ScheduleEvent = {
      id: data.id,
      date: data.date,
      title: data.title,
      memo: data.memo ?? null,
      linkUrl: data.link_url ?? null,
    };

    setEvents((prev) => [...prev, created]);
  };

  const updateEvent = async (updated: ScheduleEvent) => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('schedule_events')
      .update({
        date: updated.date,
        title: updated.title,
        memo: updated.memo ?? null,
        link_url: updated.linkUrl ?? null,
      })
      .eq('id', updated.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update schedule event', error);
      return;
    }

    const saved: ScheduleEvent = {
      id: data.id,
      date: data.date,
      title: data.title,
      memo: data.memo ?? null,
      linkUrl: data.link_url ?? null,
    };

    setEvents((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
  };

  const deleteEvent = async (id: string) => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('schedule_events').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete schedule event', error);
      return;
    }

    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <ScheduleContext.Provider
      value={{ events, getEventsByDate, addEvent, updateEvent, deleteEvent }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  const ctx = useContext(ScheduleContext);
  if (!ctx) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return ctx;
}

