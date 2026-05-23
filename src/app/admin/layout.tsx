import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">TV Player</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Admin</span>
        </div>
        
        <nav className="flex-1 py-4 px-3 space-y-1">
          <Link href="/admin" className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link href="/admin/clinics" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <Users className="w-5 h-5 mr-3" />
            Clínicas
          </Link>
          <Link href="/admin/plans" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <CreditCard className="w-5 h-5 mr-3" />
            Planos
          </Link>
          <Link href="/admin/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <Settings className="w-5 h-5 mr-3" />
            Configurações
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center px-4">
          <span className="text-xl font-bold text-gray-900">TV Player Admin</span>
        </header>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
