
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNavbar } from '@/components/layout/TopNavbar';

const RootLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-cms-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-6 ml-60">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
