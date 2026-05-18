import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/broker/Sidebar';
import { TopNav } from '../components/broker/TopNav';

const BrokerLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-bg font-sans text-neutral-primary">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <TopNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BrokerLayout;
