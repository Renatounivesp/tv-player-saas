import { Image as ImageIcon, Video, UploadCloud } from 'lucide-react';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galeria de Mídia</h1>
          <p className="text-gray-500 mt-1">Gerencie suas imagens e vídeos para usar nos slides.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <UploadCloud className="w-4 h-4 mr-2" />
          Fazer Upload
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Central de Mídia</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Nesta tela, você poderá visualizar todas as imagens e vídeos que já enviou para o sistema.
          A integração com armazenamento real (Supabase Storage) será implementada na próxima fase.
        </p>
      </div>
    </div>
  );
}
