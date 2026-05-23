'use client';

import { useAppStore } from '@/lib/store';
import { Check, X } from 'lucide-react';

export default function AdminPlansPage() {
  const { plans } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Planos de Assinatura</h1>
        <p className="text-gray-500 mt-1">Gerencie os planos oferecidos para as clínicas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h2>
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-gray-900">R$ {plan.price}</span>
              <span className="text-gray-500 font-medium">/mês</span>
            </div>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                {plan.max_slides === -1 ? 'Slides ilimitados' : `Até ${plan.max_slides} slides`}
              </li>
              <li className="flex items-center text-sm text-gray-600">
                {plan.allows_video ? (
                  <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                )}
                Upload de Vídeos
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                Suporte Básico
              </li>
            </ul>

            <button className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
              Editar Plano
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
