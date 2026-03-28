import React from 'react';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen w-full overflow-hidden relative font-sans">
      {/* Background is handled by body in index.css */}
      
      {/* Main Content Area */}
      <main className="relative z-10 w-full h-full min-h-screen flex flex-col max-w-md mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
