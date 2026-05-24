'use client';

import { useState } from 'react';
import { Users, CreditCard, Activity, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';
import { ClinicStatus } from '@/lib/mock-data';

export default function AdminDashboard() {
  const { clinics, plans, addClinicAsync, updateClinicStatusAsync } = useAppStore();
  
  const activeClinics = clinics.filter(c => c.status === 'active').length;
  const overdueClinics = clinics.filter(c => c.status === 'overdue').length;
  const totalRevenue = clinics.reduce((acc, clinic) => {
    if (clinic.status === 'active') return acc + clinic.subscription_value;
    return acc;
  }, 0);

  // New Clinic Modal State
  const [isNewClinicOpen, setIsNewClinicOpen] = useState(false);
  const [newClinic, setNewClinic] = useState({
    name: '',
    slug: '',
    manager_name: '',
    phone: '',
    email: '',
    plan_id: 'p_unico',
    subscription_value: 49
  });

  // Edit Status Modal State
  const [editingClinicId, setEditingClinicId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<ClinicStatus>('active');

  const handleCreateClinic = async () => {
    if (!newClinic.name || !newClinic.slug) return alert('Nome e Slug são obrigatórios.');
    
    try {
      await addClinicAsync({
        ...newClinic,
        primary_color: '#000000',
        status: 'active',
        subscription_due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // +30 days
      });
      
      setIsNewClinicOpen(false);
      setNewClinic({
        name: '', slug: '', manager_name: '', phone: '', email: '', plan_id: 'p_unico', subscription_value: 49
      });
      alert('Clínica adicionada com sucesso!');
    } catch (error: any) {
      console.error(error);
      alert('Erro ao salvar a clínica: ' + (error.message || 'Verifique o console para mais detalhes.'));
    }
  };

  const handleUpdateStatus = async () => {
    if (editingClinicId) {
      await updateClinicStatusAsync(editingClinicId, editStatus);
      setEditingClinicId(null);
    }
  };

  const openEditModal = (clinic: any) => {
    setEditingClinicId(clinic.id);
    setEditStatus(clinic.status);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
          <p className="text-gray-500 mt-1">Acompanhe as métricas do seu SaaS.</p>
        </div>
        <button 
          onClick={() => setIsNewClinicOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Clínica
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Clínicas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{clinics.length}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">MRR (Receita Mensal)</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                R$ {totalRevenue.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Clínicas Ativas</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{activeClinics}</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Inadimplentes</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{overdueClinics}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Clinics List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Clínicas Cadastradas</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 font-medium">Clínica</th>
                <th className="px-6 py-3 font-medium">Plano</th>
                <th className="px-6 py-3 font-medium">Valor</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {clinics.map((clinic) => {
                const plan = plans.find(p => p.id === clinic.plan_id);
                const statusColors = {
                  active: 'bg-green-100 text-green-800',
                  pending: 'bg-yellow-100 text-yellow-800',
                  overdue: 'bg-red-100 text-red-800',
                  blocked: 'bg-gray-100 text-gray-800',
                };
                const statusLabels = {
                  active: 'Ativo',
                  pending: 'Pendente',
                  overdue: 'Vencido',
                  blocked: 'Bloqueado',
                };

                return (
                  <tr key={clinic.id} className="bg-white border-b border-gray-100 hover:bg-gray-50">
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
                      <Link 
                        href={`/tv/${clinic.slug}`} 
                        target="_blank"
                        className="text-blue-600 hover:underline mr-4 font-medium"
                      >
                        Ver TV
                      </Link>
                      <button 
                        onClick={() => openEditModal(clinic)}
                        className="text-gray-600 hover:text-gray-900 font-medium bg-gray-100 px-3 py-1 rounded transition-colors"
                      >
                        Mudar Status
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              {clinics.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma clínica cadastrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Clínica */}
      <Modal
        isOpen={isNewClinicOpen}
        onClose={() => setIsNewClinicOpen(false)}
        title="Cadastrar Nova Clínica"
        footer={
          <>
            <button 
              onClick={() => setIsNewClinicOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreateClinic}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Criar Clínica
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Clínica</label>
              <input 
                type="text" 
                value={newClinic.name}
                onChange={(e) => setNewClinic({...newClinic, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input 
                type="text" 
                value={newClinic.slug}
                onChange={(e) => setNewClinic({...newClinic, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
            <input 
              type="text" 
              value={newClinic.manager_name}
              onChange={(e) => setNewClinic({...newClinic, manager_name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plano</label>
              <select 
                value={newClinic.plan_id}
                onChange={(e) => {
                  const planId = e.target.value;
                  const plan = plans.find(p => p.id === planId);
                  setNewClinic({...newClinic, plan_id: planId, subscription_value: plan?.price || 0});
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {plans.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - R$ {p.price}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor Cobrado</label>
              <input 
                type="number" 
                value={newClinic.subscription_value}
                onChange={(e) => setNewClinic({...newClinic, subscription_value: Number(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal Editar Status */}
      <Modal
        isOpen={!!editingClinicId}
        onClose={() => setEditingClinicId(null)}
        title="Alterar Status da Clínica"
        footer={
          <>
            <button 
              onClick={() => setEditingClinicId(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleUpdateStatus}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Salvar Alteração
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 mb-4">
            Atenção: Ao alterar o status para "Vencido" ou "Bloqueado", a TV da clínica será imediatamente interrompida e exibirá uma tela de aviso.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Novo Status</label>
            <select 
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as ClinicStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Ativo (Rodar TV normalmente)</option>
              <option value="pending">Pendente</option>
              <option value="overdue">Vencido (Bloqueia a TV)</option>
              <option value="blocked">Bloqueado (Bloqueia a TV)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
