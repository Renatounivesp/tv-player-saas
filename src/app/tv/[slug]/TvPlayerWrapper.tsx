'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import PlayerClient from './PlayerClient';

export default function TvPlayerWrapper({ slug }: { slug: string }) {
  const { clinics, slides } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Escuta mudanças de memória no disco (LocalStorage) vindas de outras abas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tv-player-storage' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.state) {
            useAppStore.setState(parsed.state);
          }
        } catch (err) {
          console.error("Erro ao sincronizar abas:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!mounted) return null; // Evita erros de hidratação do Next.js

  
  const clinic = clinics.find(c => c.slug === slug);

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

  return <PlayerClient clinic={clinic} slides={clinicSlides} />;
}
