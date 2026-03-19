import React, { useState } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children, activeTab, setActiveTab }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
