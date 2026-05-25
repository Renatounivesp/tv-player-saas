'use client';

import { useAppStore } from '@/lib/store';
import { Search, Plus } from 'lucide-react';
import Link from 'next/link';

export default function AdminClinicsPage() {
  const { clinics, plans } = useAppStore();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todas as Clínicas</h1>
          <p className="text-gray-500 mt-1">Gerencie todos os seus clientes em um só lugar.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Clínica
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar clínica por nome ou slug..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <table className="w-full text-left text-sm text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">Clínica</th>
              <th className="px-6 py-3 font-medium">Plano</th>
              <th className="px-6 py-3 font-medium">Valor</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clinics.map((clinic) => {
              const plan = plans.find(p => p.id === clinic.plan_id);
              const statusColors = {
                active: 'bg-green-100 text-green-800',
                pending: 'bg-yellow-100 text-yellow-800',
                overdue: 'bg-red-100 text-red-800',
                blocked: 'bg-gray-100 text-gray-800',
                lifetime: 'bg-purple-100 text-purple-800',
              };
              const statusLabels = {
                active: 'Ativo',
                pending: 'Pendente',
                overdue: 'Vencido',
                blocked: 'Bloqueado',
                lifetime: 'Vitalício',
              };

              return (
                <tr key={clinic.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{clinic.name}</div>
                    <div className="text-xs text-gray-500">/{clinic.slug}</div>
                  </td>
                  <td className="px-6 py-4">{plan?.name}</td>
                  <td className="px-6 py-4">R$ {clinic.subscription_value.toFixed(2).replace('.', ',')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[clinic.status]}`}>
                      {statusLabels[clinic.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/tv/${clinic.slug}`} target="_blank" className="text-blue-600 hover:underline mr-3">TV</Link>
                    <button className="text-gray-600 hover:underline">Editar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
