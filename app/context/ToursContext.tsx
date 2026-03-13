'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

// Define the type for a single tour
interface Tour {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  guide: string;
}

// Define the type for the context value
interface ToursContextType {
  tours: Tour[];
  addTour: (tour: Omit<Tour, 'id'>) => void;
  deleteTour: (id: number) => void;
  updateTour: (updatedTour: Tour) => void;
  getTourById: (id: number) => Tour | undefined;
}

// Create the context with a default value
const ToursContext = createContext<ToursContextType | undefined>(undefined);

// Define some initial data
const initialTours: Tour[] = [
  { id: 1, name: 'Jeju Island Adventure', startDate: '2026-04-10', endDate: '2026-04-15', guide: 'Kim' },
  { id: 2, name: 'Seoul City Exploration', startDate: '2026-05-01', endDate: '2026-05-05', guide: 'Lee' },
  { id: 3, name: 'Busan Beach Tour', startDate: '2026-06-12', endDate: '2026-06-16', guide: 'Park' },
];

// Create the provider component
export function ToursProvider({ children }: { children: ReactNode }) {
  const [tours, setTours] = useState<Tour[]>(initialTours);

  const addTour = (newTourData: Omit<Tour, 'id'>) => {
    const newTour = {
      ...newTourData,
      id: tours.length > 0 ? Math.max(...tours.map(t => t.id)) + 1 : 1,
    };
    setTours(prevTours => [...prevTours, newTour]);
  };

  const deleteTour = (id: number) => {
    setTours(prevTours => prevTours.filter(tour => tour.id !== id));
  };

  const updateTour = (updatedTour: Tour) => {
    setTours(prevTours => 
      prevTours.map(tour => (tour.id === updatedTour.id ? updatedTour : tour))
    );
  };

  const getTourById = (id: number) => {
    return tours.find(tour => tour.id === id);
  };

  return (
    <ToursContext.Provider value={{ tours, addTour, deleteTour, updateTour, getTourById }}>
      {children}
    </ToursContext.Provider>
  );
}

// Create a custom hook for easy access to the context
export function useTours() {
  const context = useContext(ToursContext);
  if (context === undefined) {
    throw new Error('useTours must be used within a ToursProvider');
  }
  return context;
}
