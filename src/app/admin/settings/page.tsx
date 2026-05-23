import { Building, Mail, Globe } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações da Plataforma</h1>
          <p className="text-gray-500 mt-1">Gerencie as informações da sua empresa SaaS.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <Building className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Dados da Empresa</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Plataforma</label>
            <input 
              type="text" 
              defaultValue="TV Player SaaS"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domínio Principal</label>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                defaultValue="tvplayer.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <Mail className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Notificações</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de Suporte</label>
            <input 
              type="email" 
              defaultValue="suporte@tvplayer.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center">
            <input type="checkbox" id="notify-overdue" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
            <label htmlFor="notify-overdue" className="ml-2 text-sm text-gray-700">
              Receber aviso quando uma clínica ficar inadimplente
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
