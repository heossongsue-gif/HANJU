'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTours } from '../../../../context/ToursContext';

export default function EditTourPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { getTourById, updateTour } = useTours();

  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guide, setGuide] = useState('');

  useEffect(() => {
    if (!params?.id) return;
    const tourId = Number(params.id);
    const tour = getTourById(tourId);
    if (!tour) {
      // 존재하지 않는 투어일 경우 목록으로 되돌리기
      router.replace('/tours');
      return;
    }

    setName(tour.name);
    setStartDate(tour.startDate);
    setEndDate(tour.endDate);
    setGuide(tour.guide);
  }, [params, getTourById, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!params?.id) return;

    const tourId = Number(params.id);
    updateTour({
      id: tourId,
      name,
      startDate,
      endDate,
      guide,
    });

    router.push('/tours');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit Tour</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Tour Name
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
            Start Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
            End Date
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="guide">
            Guide
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            id="guide"
            type="text"
            value={guide}
            onChange={(e) => setGuide(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Update Tour
          </button>
        </div>
      </form>
    </div>
  );
}

