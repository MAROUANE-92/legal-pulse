
import React from 'react';

interface LawyerLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function LawyerLayout({ title, children }: LawyerLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{title ?? "Tableau de bord avocat"}</h1>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
