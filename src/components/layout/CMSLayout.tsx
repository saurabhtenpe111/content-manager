
import React from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

interface CMSLayoutProps {
  children: React.ReactNode;
}

export const CMSLayout: React.FC<CMSLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-cms-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
