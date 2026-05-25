'use client';

import { useEffect } from 'react';
import PlayerClient from './PlayerClient';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/utils/supabase/client';

export default function TvPlayerWrapper({ slug }: { slug: string }) {
  const { clinics, slides, isLoading, fetchTvData } = useAppStore();

  const clinic = clinics.find(c => c.slug === slug);
  const clinicId = clinic?.id;

  useEffect(() => {
    // 1. Busca os dados iniciais assim que a TV liga
    fetchTvData(slug);

    if (!clinicId) return;

    const supabase = createClient();
    // 2. Conecta no Supabase via WebSockets para ouvir mudanças em Tempo Real
    const channel = supabase
      .channel('tv-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'slides', filter: `clinic_id=eq.${clinicId}` },
        (payload) => {
          console.log('Mudança detectada no banco de dados! Atualizando TV...', payload);
          // Recarrega os dados para pegar o novo slide ou status
          fetchTvData(slug);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clinicId, fetchTvData, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">Sincronizando com a Nuvem...</div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <h1 className="text-white text-3xl font-bold">Clínica não encontrada.</h1>
      </div>
    );
  }

  // Se a clínica estiver bloqueada ou vencida
  if (clinic.status === 'blocked' || clinic.status === 'overdue') {
    return (
      <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-white text-5xl font-bold mb-6">Assinatura temporariamente suspensa</h1>
        <p className="text-white/90 text-2xl">
          Por favor, entre em contato com o administrador para regularizar o acesso.
        </p>
      </div>
    );
  }

  const clinicSlides = slides.filter(s => s.clinic_id === clinic.id && s.is_active);
  const clinicTickers = useAppStore.getState().tickers.filter(t => t.clinic_id === clinic.id && t.is_active);

  if (clinicSlides.length === 0) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-8 text-center"
        style={{ backgroundColor: clinic.primary_color }}
      >
        <h1 className="text-white text-4xl font-bold">Nenhum conteúdo configurado para exibição.</h1>
      </div>
    );
  }

  return <PlayerClient clinic={clinic} slides={clinicSlides} tickers={clinicTickers} />;
}
