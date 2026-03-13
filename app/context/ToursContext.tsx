'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Tour {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  guide: string;
}

interface ToursContextType {
  tours: Tour[];
  addTour: (tour: Omit<Tour, 'id'>) => Promise<void>;
  deleteTour: (id: number) => Promise<void>;
  updateTour: (updatedTour: Tour) => Promise<void>;
  getTourById: (id: number) => Tour | undefined;
}

const ToursContext = createContext<ToursContextType | undefined>(undefined);

export function ToursProvider({ children }: { children: ReactNode }) {
  const [tours, setTours] = useState<Tour[]>([]);

  useEffect(() => {
    const loadTours = async () => {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Failed to load tours from Supabase', error);
        return;
      }

      const mapped =
        data?.map((row: any) => ({
          id: row.id,
          name: row.name,
          startDate: row.start_date,
          endDate: row.end_date,
          guide: row.guide,
        })) ?? [];

      setTours(mapped);
    };

    loadTours();
  }, []);

  const addTour = async (newTourData: Omit<Tour, 'id'>) => {
    const { data, error } = await supabase
      .from('tours')
      .insert({
        name: newTourData.name,
        start_date: newTourData.startDate,
        end_date: newTourData.endDate,
        guide: newTourData.guide,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add tour', error);
      return;
    }

    const created: Tour = {
      id: data.id,
      name: data.name,
      startDate: data.start_date,
      endDate: data.end_date,
      guide: data.guide,
    };

    setTours((prev) => [...prev, created]);
  };

  const deleteTour = async (id: number) => {
    const { error } = await supabase.from('tours').delete().eq('id', id);

    if (error) {
      console.error('Failed to delete tour', error);
      return;
    }

    setTours((prev) => prev.filter((tour) => tour.id !== id));
  };

  const updateTour = async (updatedTour: Tour) => {
    const { data, error } = await supabase
      .from('tours')
      .update({
        name: updatedTour.name,
        start_date: updatedTour.startDate,
        end_date: updatedTour.endDate,
        guide: updatedTour.guide,
      })
      .eq('id', updatedTour.id)
      .select()
      .single();

    if (error) {
      console.error('Failed to update tour', error);
      return;
    }

    const saved: Tour = {
      id: data.id,
      name: data.name,
      startDate: data.start_date,
      endDate: data.end_date,
      guide: data.guide,
    };

    setTours((prev) =>
      prev.map((tour) => (tour.id === saved.id ? saved : tour)),
    );
  };

  const getTourById = (id: number) => {
    return tours.find((tour) => tour.id === id);
  };

  return (
    <ToursContext.Provider value={{ tours, addTour, deleteTour, updateTour, getTourById }}>
      {children}
    </ToursContext.Provider>
  );
}

export function useTours() {
  const context = useContext(ToursContext);
  if (context === undefined) {
    throw new Error('useTours must be used within a ToursProvider');
  }
  return context;
}
