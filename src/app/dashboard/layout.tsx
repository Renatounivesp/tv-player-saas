'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, MonitorPlay, Image as ImageIcon, Settings, LogOut } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clinics, isLoading, fetchInitialData } = useAppStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (isLoading || clinics.length === 0) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>;
  }

  const clinic = clinics[0];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: clinic.primary_color }}
            >
              {clinic.name.charAt(0)}
            </div>
            <span className="text-sm font-bold text-gray-900 truncate">{clinic.name}</span>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-900">
            <LayoutDashboard className="w-5 h-5 mr-3 text-gray-500" />
            Meus Slides
          </Link>
          <Link href="/dashboard/media" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <ImageIcon className="w-5 h-5 mr-3 text-gray-400" />
            Galeria de Mídia
          </Link>
          <Link href={`/tv/${clinic.slug}`} target="_blank" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <MonitorPlay className="w-5 h-5 mr-3 text-gray-400" />
            Visualizar TV
          </Link>
          <Link href="/dashboard/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3 text-gray-400" />
            Configurações
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 px-3">
            <p className="text-xs text-gray-500 mb-1">Status da Assinatura</p>
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm font-medium text-gray-900">Ativa</span>
            </div>
          </div>
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
          <span className="text-xl font-bold text-gray-900">{clinic.name}</span>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
