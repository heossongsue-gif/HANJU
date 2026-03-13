import Navbar from '../components/Navbar';
import { ToursProvider } from '../context/ToursContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToursProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </div>
    </ToursProvider>
  );
}
