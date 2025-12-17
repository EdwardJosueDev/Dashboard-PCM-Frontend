import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import GobContentHeader from '../components/GobContentHeader';
import GobContentFooter from '../components/GobContentFooter';

export default function GobLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <Header isCollapsed={isCollapsed} />

      <main
        className={`pt-20 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-[280px]'
        }`}
      >
        <section className="bg-[#f5f5f5] min-h-screen flex flex-col">

          {/* CONTENIDO DINÁMICO */}
          <div className="flex-1 px-4 md:px-10 py-6">
            <div className="bg-white rounded-lg shadow-sm border border-[hsl(var(--border))] overflow-hidden h-full">
              <Outlet />
            </div>
          </div>

          <GobContentFooter />
        </section>
      </main>
    </div>
  );
}
