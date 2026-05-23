import { Palette, Link as LinkIcon, Monitor } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações da Clínica</h1>
          <p className="text-gray-500 mt-1">Personalize a identidade visual da sua TV.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          Salvar Alterações
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <Palette className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Identidade Visual</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cor Principal (Hexadecimal)</label>
            <input 
              type="color" 
              defaultValue="#0ea5e9"
              className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logotipo (URL ou Upload)</label>
            <input 
              type="text" 
              placeholder="https://exemplo.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <Monitor className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Configurações da TV</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transição dos Slides</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Suave (Fade)</option>
              <option>Nenhuma (Seca)</option>
              <option>Deslizar (Slide)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Pública da TV</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly
                value="https://tvplayer.com/tv/clinica-sorriso"
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
              />
              <button className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100">
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Este é o link que você deve abrir no navegador da sua TV.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
