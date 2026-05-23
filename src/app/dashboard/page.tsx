'use client';

import { useState } from 'react';
import { Plus, GripVertical, Image as ImageIcon, Type, Clock, Trash2, Play } from 'lucide-react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { SlideType } from '@/lib/mock-data';
import { Modal } from '@/components/ui/Modal';

export default function DashboardPage() {
  const { clinics, slides, addSlide, deleteSlide, toggleSlideStatus } = useAppStore();
  const clinic = clinics[0]; // Simula clínica logada
  
  const clinicSlides = slides
    .filter(s => s.clinic_id === clinic.id)
    .sort((a, b) => a.order_index - b.order_index);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlideType, setNewSlideType] = useState<SlideType>('image');
  const [newSlideContent, setNewSlideContent] = useState('');
  const [newSlideDuration, setNewSlideDuration] = useState(10);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSlideContent(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateSlide = () => {
    if (!newSlideContent) {
      alert('Por favor, informe o conteúdo do slide (faça o upload da imagem ou digite o texto).');
      return;
    }

    setIsSaving(true);

    // Simulando um pequeno delay de rede para a experiência de UX
    setTimeout(() => {
      try {
        addSlide({
          clinic_id: clinic.id,
          type: newSlideType,
          content_url: newSlideType === 'image' || newSlideType === 'video' ? newSlideContent : undefined,
          text_content: newSlideType === 'text' || newSlideType === 'promo' ? newSlideContent : undefined,
          duration_seconds: newSlideDuration,
          order_index: clinicSlides.length,
          is_active: true,
        });

        setIsModalOpen(false);
        setNewSlideContent('');
        setNewSlideDuration(10);
      } catch (error) {
        console.error(error);
        alert('Erro ao salvar: O arquivo de imagem é muito grande para a memória temporária (LocalStorage). Por favor, escolha uma imagem com tamanho menor que 2MB durante essa fase de testes.');
      } finally {
        setIsSaving(false);
      }
    }, 600);
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
            onClick={() => setIsModalOpen(true)}
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
            <div key={slide.id} className={`p-4 flex items-center hover:bg-gray-50 group transition-opacity ${!slide.is_active ? 'opacity-50' : ''}`}>
              <div className="cursor-move text-gray-400 hover:text-gray-600 mr-4">
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
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1.5" />
                  {slide.duration_seconds}s
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleSlideStatus(slide.id)}
                    className="text-gray-400 hover:text-gray-900 text-sm font-medium px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  >
                    {slide.is_active ? 'Desativar' : 'Ativar'}
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este slide?')) {
                        deleteSlide(slide.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-600 p-1 transition-colors"
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
        onClose={() => setIsModalOpen(false)}
        title="Adicionar Novo Slide"
        footer={
          <>
            <button 
              onClick={() => setIsModalOpen(false)}
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
              onChange={(e) => setNewSlideType(e.target.value as SlideType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="image">Imagem</option>
              <option value="text">Texto Simples</option>
              <option value="promo">Promoção (Destaque)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {newSlideType === 'image' ? 'Upload de Imagem' : 'Conteúdo do Texto'}
            </label>
            {newSlideType === 'image' ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 font-medium">
                        {isUploading ? 'Carregando imagem...' : 'Clique para fazer o upload da imagem'}
                      </p>
                    </div>
                    <input 
                      id="dropzone-file" 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden" 
                    />
                  </label>
                </div>
                {newSlideContent && newSlideContent.startsWith('data:image') && (
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                    <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                      <img src={newSlideContent} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <span>Imagem carregada com sucesso!</span>
                  </div>
                )}
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
            {newSlideType === 'image' && (
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
