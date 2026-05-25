'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MonitorPlay, Image as ImageIcon, Settings, LogOut, Menu, X, MessageSquareText } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/utils/supabase/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clinics, isLoading, fetchInitialData } = useAppStore();
  const supabase = createClient();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fecha o menu mobile quando a rota muda
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>;
  }

  if (clinics.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Bem-vindo(a)!</h2>
        <p className="text-gray-600 mb-6 max-w-md">Não encontramos nenhuma clínica vinculada à sua conta. Se você acabou de se cadastrar, aguarde alguns instantes e recarregue a página.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Recarregar
          </button>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    );
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
          <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
            Meus Slides
          </Link>
          <Link href="/dashboard/tickers" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <MessageSquareText className="w-5 h-5 mr-3 text-gray-400" />
            Letreiros
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
          <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-gray-900/80 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white h-full shadow-xl">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            
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
            
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
              <Link href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                <LayoutDashboard className="w-5 h-5 mr-3 text-gray-400" />
                Meus Slides
              </Link>
              <Link href="/dashboard/tickers" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                <MessageSquareText className="w-5 h-5 mr-3 text-gray-400" />
                Letreiros
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
              <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5 mr-3 text-red-500" />
                Sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: clinic.primary_color }}
            >
              {clinic.name.charAt(0)}
            </div>
            <span className="text-xl font-bold text-gray-900 truncate max-w-[200px]">{clinic.name}</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
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
