'use client';

import Link from 'next/link';
import { useTours } from '../../context/ToursContext';

export default function ToursPage() {
  const { tours, deleteTour } = useTours();

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      deleteTour(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Tour Management</h1>
        <Link href="/tours/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          + Add New Tour
        </Link>
      </div>
      <div className="bg-white shadow-md rounded">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Tour Name</th>
              <th className="px-4 py-2">Start Date</th>
              <th className="px-4 py-2">End Date</th>
              <th className="px-4 py-2">Guide</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="border-b">
                <td className="px-4 py-2">{tour.name}</td>
                <td className="px-4 py-2">{tour.startDate}</td>
                <td className="px-4 py-2">{tour.endDate}</td>
                <td className="px-4 py-2">{tour.guide}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/tours/${tour.id}/edit`}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(tour.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
