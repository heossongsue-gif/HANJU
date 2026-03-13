import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="font-bold text-xl">
          Hanju Tour
        </Link>
        <div>
          <Link href="/dashboard" className="px-3 py-2 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/tours" className="px-3 py-2 rounded hover:bg-gray-700">
            Tours
          </Link>
          <Link href="/customers" className="px-3 py-2 rounded hover:bg-gray-700">
            Customers
          </Link>
        </div>
        <div>
          {/* Placeholder for logout button */}
          <button className="px-3 py-2 rounded bg-red-600 hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
