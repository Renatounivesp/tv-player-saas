'use client';

import { useState, useEffect } from 'react';
import { Palette, Link as LinkIcon, Monitor, Save, Music } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { FrameStyle, SlideTransition } from '@/lib/mock-data';

export default function SettingsPage() {
  const { clinics, updateClinicSettingsAsync } = useAppStore();
  const clinic = clinics[0];

  const [primaryColor, setPrimaryColor] = useState('#0ea5e9');
  const [logoUrl, setLogoUrl] = useState('');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('none');
  const [defaultTransition, setDefaultTransition] = useState<SlideTransition>('fade');
  const [showWeather, setShowWeather] = useState(false);
  const [showClock, setShowClock] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [backgroundMusicUrl, setBackgroundMusicUrl] = useState('');
  const [musicVolume, setMusicVolume] = useState(50);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (clinic) {
      setPrimaryColor(clinic.primary_color || '#0ea5e9');
      setLogoUrl(clinic.logo_url || '');
      setFrameStyle(clinic.frame_style || 'none');
      setDefaultTransition(clinic.default_transition || 'fade');
      setShowWeather(clinic.show_weather || false);
      setShowClock(clinic.show_clock !== false); // default to true
      setShowLogo(clinic.show_logo !== false); // default to true
      setBackgroundMusicUrl(clinic.background_music_url || '');
      setMusicVolume(clinic.music_volume || 50);
    }
  }, [clinic]);

  const handleSave = async () => {
    if (!clinic) return;
    setIsSaving(true);
    try {
      await updateClinicSettingsAsync(clinic.id, {
        primary_color: primaryColor,
        logo_url: logoUrl,
        frame_style: frameStyle,
        default_transition: defaultTransition,
        show_weather: showWeather,
        show_clock: showClock,
        show_logo: showLogo,
        background_music_url: backgroundMusicUrl,
        music_volume: musicVolume
      });
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar as configurações.');
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações da Clínica</h1>
          <p className="text-gray-500 mt-1">Personalize a identidade visual da sua TV.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
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
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-10 px-1 py-1 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logotipo (URL ou Upload)</label>
            <input 
              type="text" 
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://exemplo.com/logo.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Settings da TV */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <Monitor className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Configurações da TV</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estilo da Moldura da TV</label>
            <select 
              value={frameStyle}
              onChange={(e) => setFrameStyle(e.target.value as FrameStyle)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">Nenhuma (Tela Cheia)</option>
              <option value="solid">Sólida (Borda Simples)</option>
              <option value="minimal">Arredondada (Estilo Tablet)</option>
              <option value="neon">Neon (Brilho LED)</option>
              <option value="gradient">Gradiente (Degradê Moderno)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transição Padrão dos Slides</label>
            <select 
              value={defaultTransition}
              onChange={(e) => setDefaultTransition(e.target.value as SlideTransition)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="fade">Surgir Suave (Fade)</option>
              <option value="slideLeft">Deslizar para Esquerda</option>
              <option value="slideRight">Deslizar para Direita</option>
              <option value="slideUp">Deslizar para Cima</option>
              <option value="zoom">Aproximar (Zoom)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-6">
            {/* Logo Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-900">Mostrar Logotipo / Nome</label>
                <p className="text-sm text-gray-500 mt-1">Exibe o nome ou a logo da clínica no canto superior da TV.</p>
              </div>
              <button 
                onClick={() => setShowLogo(!showLogo)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showLogo ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showLogo ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Clock Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-900">Mostrar Relógio e Data</label>
                <p className="text-sm text-gray-500 mt-1">Exibe o horário atual e a data na tela da TV.</p>
              </div>
              <button 
                onClick={() => setShowClock(!showClock)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showClock ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showClock ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Weather Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-900">Previsão do Tempo</label>
                <p className="text-sm text-gray-500 mt-1">Mostra a temperatura da sua cidade automaticamente no canto da TV.</p>
              </div>
              <button 
                onClick={() => setShowWeather(!showWeather)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${showWeather ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showWeather ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Pública da TV</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly
                value={typeof window !== 'undefined' && clinic ? `${window.location.origin}/tv/${clinic.slug}` : ''}
                className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
              />
              <button 
                onClick={() => {
                  if (clinic) {
                    navigator.clipboard.writeText(`${window.location.origin}/tv/${clinic.slug}`);
                    alert('Link copiado!');
                  }
                }}
                className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <LinkIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Este é o link que você deve abrir no navegador da sua TV.</p>
          </div>
        </div>

        {/* Som e Música */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-4">
            <Music className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Música Ambiente</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Música / Estilo</label>
              <select 
                value={
                  ['', 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_2ba7ec4eb3.mp3'].includes(backgroundMusicUrl)
                    ? backgroundMusicUrl 
                    : 'custom'
                }
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    setBackgroundMusicUrl(e.target.value);
                  } else {
                    setBackgroundMusicUrl('https://'); // Placeholder to trigger custom input
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              >
                <option value="">🔇 Sem Música (Mudo)</option>
                <option value="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3">🎷 Jazz Suave (Lofi)</option>
                <option value="https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3">🎹 Piano Relaxante</option>
                <option value="https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3">🎸 Brisa Acústica</option>
                <option value="https://cdn.pixabay.com/download/audio/2022/10/25/audio_2ba7ec4eb3.mp3">🏖️ Bossa Nova Chill</option>
                <option value="custom">🔗 Personalizado (Colar Link MP3)</option>
              </select>

              {!['', 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3', 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3', 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3', 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_2ba7ec4eb3.mp3'].includes(backgroundMusicUrl) && (
                <input 
                  type="text" 
                  value={backgroundMusicUrl}
                  onChange={(e) => setBackgroundMusicUrl(e.target.value)}
                  placeholder="Cole o link do MP3 aqui..."
                  className="w-full px-3 py-2 border border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume: {musicVolume}%
              </label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={musicVolume}
                onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
