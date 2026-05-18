import React from 'react';
import { Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg">
      {/* Add Topbar / Navbar here */}
      <main className="flex-1">
        <Outlet />
      </main>
      {/* Add Footer here */}
    </div>
  );
};

export default DashboardLayout;
