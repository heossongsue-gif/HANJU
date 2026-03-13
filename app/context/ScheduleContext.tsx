'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface ScheduleEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  memo?: string;
  imageUrl?: string;
  linkUrl?: string;
}

interface ScheduleContextType {
  events: ScheduleEvent[];
  getEventsByDate: (date: string) => ScheduleEvent[];
  addEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateEvent: (event: ScheduleEvent) => void;
  deleteEvent: (id: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const STORAGE_KEY = 'hanju_schedule_events_v1';

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as ScheduleEvent[];
      setEvents(parsed);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const getEventsByDate = (date: string) =>
    events.filter((e) => e.date === date);

  const addEvent = (input: Omit<ScheduleEvent, 'id'>) => {
    const id = crypto.randomUUID();
    setEvents((prev) => [...prev, { id, ...input }]);
  };

  const updateEvent = (updated: ScheduleEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEvent = (id: string) => {
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

