'use client';

import { useState } from 'react';
import { Plus, GripVertical, Trash2, Edit2, Play } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { Modal } from '@/components/ui/Modal';

export default function TickersPage() {
  const { clinics, tickers, addTickerAsync, updateTickerAsync, updateTickersOrderAsync, deleteTickerAsync, toggleTickerStatusAsync } = useAppStore();
  const clinic = clinics[0]; // Simula clínica logada
  
  const clinicTickers = tickers
    .filter(t => t.clinic_id === clinic.id)
    .sort((a, b) => a.order_index - b.order_index);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTickerContent, setNewTickerContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editingTickerId, setEditingTickerId] = useState<string | null>(null);
  const [draggedTickerId, setDraggedTickerId] = useState<string | null>(null);

  const handleCreateTicker = async () => {
    if (!newTickerContent) {
      alert('Por favor, digite o conteúdo do letreiro.');
      return;
    }

    setIsSaving(true);

    try {
      if (editingTickerId) {
        await updateTickerAsync(editingTickerId, {
          text_content: newTickerContent,
        });
      } else {
        await addTickerAsync({
          clinic_id: clinic.id,
          text_content: newTickerContent,
          order_index: clinicTickers.length,
          is_active: true,
        });
      }

      setIsModalOpen(false);
      setEditingTickerId(null);
      setNewTickerContent('');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar no banco de dados. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTickerId(id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      const el = document.getElementById(`ticker-${id}`);
      if (el) el.classList.add('opacity-30');
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(`ticker-${draggedTickerId}`);
    if (el) el.classList.remove('opacity-30');
    
    if (!draggedTickerId || draggedTickerId === targetId) return;

    const newTickers = [...clinicTickers];
    const draggedIndex = newTickers.findIndex(s => s.id === draggedTickerId);
    const targetIndex = newTickers.findIndex(s => s.id === targetId);
    
    const [draggedItem] = newTickers.splice(draggedIndex, 1);
    newTickers.splice(targetIndex, 0, draggedItem);
    
    const updatedTickers = newTickers.map((s, idx) => ({ ...s, order_index: idx }));
    
    setDraggedTickerId(null);
    await updateTickersOrderAsync(updatedTickers);
  };

  const handleEditClick = (ticker: any) => {
    setEditingTickerId(ticker.id);
    setNewTickerContent(ticker.text_content);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Letreiros (Notícias)</h1>
          <p className="text-gray-500 mt-1">Gerencie os avisos que ficam rolando no rodapé da TV.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href={`/tv/${clinic.slug}`}
            target="_blank"
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Play className="w-4 h-4 mr-2" />
            Visualizar TV
          </Link>
          <button 
            onClick={() => {
              setEditingTickerId(null);
              setNewTickerContent('');
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Letreiro
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Ordem de Exibição</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {clinicTickers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum letreiro cadastrado. Clique em "Novo Letreiro" para começar.
            </div>
          )}

          {clinicTickers.map((ticker, index) => (
            <div 
              id={`ticker-${ticker.id}`}
              key={ticker.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, ticker.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, ticker.id)}
              onDragEnd={() => {
                const el = document.getElementById(`ticker-${ticker.id}`);
                if (el) el.classList.remove('opacity-30');
                setDraggedTickerId(null);
              }}
              className={`p-4 flex items-center bg-white hover:bg-gray-50 transition-all border-l-4 ${!ticker.is_active ? 'opacity-60 border-transparent' : 'border-blue-500'}`}
            >
              <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-blue-500 mr-4 p-2 rounded hover:bg-blue-50 transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">Mensagem {index + 1}</span>
                  {!ticker.is_active && (
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-semibold uppercase">
                      Inativo
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {ticker.text_content}
                </p>
              </div>
              
              <div className="flex items-center gap-6 ml-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditClick(ticker)}
                    className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition-colors"
                    title="Editar letreiro"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleTickerStatusAsync(ticker.id)}
                    className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${ticker.is_active ? 'text-gray-600 bg-gray-100 hover:bg-gray-200' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
                  >
                    {ticker.is_active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm('Tem certeza que deseja excluir este letreiro?')) {
                        try { await deleteTickerAsync(ticker.id); } 
                        catch (e) { alert('Erro ao excluir'); }
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                    title="Excluir letreiro"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTickerId(null);
          setNewTickerContent('');
        }}
        title={editingTickerId ? "Editar Letreiro" : "Adicionar Novo Letreiro"}
        footer={
          <>
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setEditingTickerId(null);
                setNewTickerContent('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreateTicker}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? 'Salvando...' : 'Salvar Letreiro'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mensagem do Letreiro
            </label>
            <textarea 
              value={newTickerContent}
              onChange={(e) => setNewTickerContent(e.target.value)}
              placeholder="Ex: Não se esqueça de beber água..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
