'use client';

import { useState } from 'react';
import { Plus, GripVertical, Image as ImageIcon, Type, Clock, Trash2, Play, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { SlideType, SlideTransition } from '@/lib/mock-data';
import { Modal } from '@/components/ui/Modal';

export default function DashboardPage() {
  const { clinics, slides, addSlideAsync, updateSlideAsync, updateSlidesOrderAsync, deleteSlideAsync, toggleSlideStatusAsync } = useAppStore();
  const clinic = clinics[0]; // Simula clínica logada
  
  const clinicSlides = slides
    .filter(s => s.clinic_id === clinic.id)
    .sort((a, b) => a.order_index - b.order_index);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlideType, setNewSlideType] = useState<SlideType>('image');
  const [newSlideContent, setNewSlideContent] = useState('');
  const [newSlideImages, setNewSlideImages] = useState<string[]>([]);
  const [newSlideDuration, setNewSlideDuration] = useState(10);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [draggedSlideId, setDraggedSlideId] = useState<string | null>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const max_size = 1920;
          if (width > height && width > max_size) {
            height *= max_size / width;
            width = max_size;
          } else if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.onerror = () => resolve(event.target?.result as string); // fallback
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      const newImages: string[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (file.type.startsWith('image/')) {
            const compressedBase64 = await compressImage(file);
            newImages.push(compressedBase64);
          }
        }
        setNewSlideImages(prev => [...prev, ...newImages]);
      } catch (err) {
        console.error('Erro ao processar imagem:', err);
        alert('Erro ao processar a imagem. Tente um formato diferente.');
      } finally {
        setIsUploading(false);
      }
    }
    // Limpar o input
    e.target.value = '';
  };

  const handleCreateSlide = async () => {
    if (newSlideType === 'image' && newSlideImages.length === 0) {
      alert('Por favor, faça o upload de pelo menos uma imagem.');
      return;
    }
    if (newSlideType !== 'image' && !newSlideContent) {
      alert('Por favor, digite o conteúdo do texto.');
      return;
    }

    setIsSaving(true);

    try {
      if (editingSlideId) {
        await updateSlideAsync(editingSlideId, {
          text_content: newSlideContent,
          duration_seconds: newSlideDuration
        });
      } else {
        if (newSlideType === 'image') {
          // Enviar multiplas imagens
          const promises = newSlideImages.map((imgBase64, index) => 
            addSlideAsync({
              clinic_id: clinic.id,
              type: 'image',
              content_url: imgBase64,
              duration_seconds: newSlideDuration,
              order_index: clinicSlides.length + index,
              is_active: true,
            })
          );
          await Promise.all(promises);
        } else {
          // Texto ou promo
          await addSlideAsync({
            clinic_id: clinic.id,
            type: newSlideType,
            text_content: newSlideContent,
            duration_seconds: newSlideDuration,
            order_index: clinicSlides.length,
            is_active: true,
          });
        }
      }

      setIsModalOpen(false);
      setEditingSlideId(null);
      setNewSlideContent('');
      setNewSlideImages([]);
      setNewSlideDuration(10);
    } catch (error: any) {
      console.error(error);
      if (error?.message?.includes('payload too large') || error?.code === '413') {
        alert('Erro ao salvar: O arquivo de imagem é muito grande. Escolha uma imagem menor.');
      } else {
        alert('Erro ao salvar no banco de dados. Tente novamente.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSlideId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Pequeno delay para o visual não sumir na mão
    setTimeout(() => {
      const el = document.getElementById(`slide-${id}`);
      if (el) el.classList.add('opacity-30');
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const el = document.getElementById(`slide-${draggedSlideId}`);
    if (el) el.classList.remove('opacity-30');
    
    if (!draggedSlideId || draggedSlideId === targetId) return;

    const newSlides = [...clinicSlides];
    const draggedIndex = newSlides.findIndex(s => s.id === draggedSlideId);
    const targetIndex = newSlides.findIndex(s => s.id === targetId);
    
    const [draggedItem] = newSlides.splice(draggedIndex, 1);
    newSlides.splice(targetIndex, 0, draggedItem);
    
    // Atualizar order_index local
    const updatedSlides = newSlides.map((s, idx) => ({ ...s, order_index: idx }));
    
    setDraggedSlideId(null);
    await updateSlidesOrderAsync(updatedSlides);
  };

  const handleEditClick = (slide: any) => {
    setEditingSlideId(slide.id);
    setNewSlideType(slide.type);
    setNewSlideContent(slide.text_content || '');
    setNewSlideDuration(slide.duration_seconds);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Slides</h1>
          <p className="text-gray-500 mt-1">Gerencie o conteúdo exibido na TV da clínica.</p>
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
              setEditingSlideId(null);
              setNewSlideType('image');
              setNewSlideContent('');
              setNewSlideImages([]);
              setNewSlideDuration(10);
              setIsModalOpen(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Slide
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Ordem de Exibição</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {clinicSlides.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              Nenhum slide cadastrado. Clique em "Novo Slide" para começar.
            </div>
          )}

          {clinicSlides.map((slide, index) => (
            <div 
              id={`slide-${slide.id}`}
              key={slide.id} 
              draggable
              onDragStart={(e) => handleDragStart(e, slide.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, slide.id)}
              onDragEnd={() => {
                const el = document.getElementById(`slide-${slide.id}`);
                if (el) el.classList.remove('opacity-30');
                setDraggedSlideId(null);
              }}
              className={`p-4 flex items-center bg-white hover:bg-gray-50 transition-all border-l-4 ${!slide.is_active ? 'opacity-60 border-transparent' : 'border-blue-500'}`}
            >
              <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-blue-500 mr-4 p-2 rounded hover:bg-blue-50 transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mr-4">
                {slide.type === 'image' && slide.content_url ? (
                  <img src={slide.content_url} alt="Slide preview" className="w-full h-full object-cover" />
                ) : slide.type === 'promo' ? (
                  <div className="bg-red-500 w-full h-full flex items-center justify-center text-white font-bold text-xs">
                    %
                  </div>
                ) : (
                  <Type className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">Slide {index + 1}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    slide.type === 'image' ? 'bg-blue-100 text-blue-700' :
                    slide.type === 'promo' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {slide.type}
                  </span>
                  {!slide.is_active && (
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-semibold uppercase">
                      Inativo
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {slide.type === 'image' ? slide.content_url : slide.text_content}
                </p>
              </div>
              
              <div className="flex items-center gap-6 ml-4">
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <input 
                    type="number"
                    min="3"
                    max="60"
                    className="w-12 bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-center font-medium"
                    value={slide.duration_seconds}
                    onChange={(e) => {
                      const newDuration = Number(e.target.value);
                      if (newDuration >= 3) {
                        updateSlideAsync(slide.id, { duration_seconds: newDuration });
                      }
                    }}
                  />
                  <span>s</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditClick(slide)}
                    className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-blue-50 transition-colors"
                    title="Editar slide"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleSlideStatusAsync(slide.id)}
                    className={`text-sm font-medium px-3 py-1.5 rounded transition-colors ${slide.is_active ? 'text-gray-600 bg-gray-100 hover:bg-gray-200' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
                  >
                    {slide.is_active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm('Tem certeza que deseja excluir este slide?')) {
                        try { await deleteSlideAsync(slide.id); } 
                        catch (e) { alert('Erro ao excluir'); }
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors"
                    title="Excluir slide"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Novo Slide */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingSlideId(null);
          setNewSlideImages([]);
          setNewSlideContent('');
        }}
        title={editingSlideId ? "Editar Slide" : "Adicionar Novo Slide"}
        footer={
          <>
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setEditingSlideId(null);
                setNewSlideImages([]);
                setNewSlideContent('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreateSlide}
              disabled={isSaving || isUploading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                'Salvar Slide'
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Slide</label>
            <select 
              value={newSlideType} 
              disabled={!!editingSlideId}
              onChange={(e) => setNewSlideType(e.target.value as SlideType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="image">Imagem</option>
              <option value="text">Texto Simples</option>
              <option value="promo">Promoção (Destaque)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {newSlideType === 'image' && !editingSlideId ? 'Upload de Imagem' : 'Conteúdo do Texto'}
            </label>
            {newSlideType === 'image' && !editingSlideId ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 font-medium">
                        {isUploading ? 'Carregando imagens...' : 'Clique para selecionar várias imagens'}
                      </p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                {newSlideImages.length > 0 && (
                  <div className="flex flex-col gap-2 mt-3">
                    <p className="text-sm font-medium text-gray-700">{newSlideImages.length} imagem(ns) selecionada(s):</p>
                    <div className="flex gap-2 flex-wrap">
                      {newSlideImages.map((img, idx) => (
                        <div key={idx} className="relative group w-16 h-16 rounded bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setNewSlideImages(prev => prev.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {newSlideType === 'image' && editingSlideId ? (
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
                    A imagem não pode ser trocada na edição. Se desejar usar outra foto, exclua este slide e crie um novo. Você ainda pode editar o tempo de exibição abaixo.
                  </div>
                ) : (
                  <textarea 
                    value={newSlideContent}
                    onChange={(e) => setNewSlideContent(e.target.value)}
                    placeholder="Digite a mensagem que aparecerá na TV..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            )}
            {newSlideType === 'image' && !editingSlideId && (
              <p className="text-xs text-gray-500 mt-2">Formatos aceitos: JPG, PNG, WEBP.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tempo de Exibição (segundos)</label>
            <input 
              type="number" 
              min="3"
              max="60"
              value={newSlideDuration}
              onChange={(e) => setNewSlideDuration(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
