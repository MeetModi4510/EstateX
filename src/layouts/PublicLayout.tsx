import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg font-sans text-neutral-primary">
      <Navbar />
      <main className="flex-1 w-full overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
