import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-cream-dark/30">
      <AdminSidebar />
      <div className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}
