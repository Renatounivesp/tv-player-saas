import { Metadata } from 'next';
import TvPlayerWrapper from './TvPlayerWrapper';
import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: clinic } = await supabase
    .from('clinics')
    .select('name, logo_url')
    .eq('slug', resolvedParams.slug)
    .single();

  const title = clinic ? `TV da ${clinic.name}` : 'TV Player';
  
  return {
    title: title,
    description: 'Acompanhe as novidades e informações na TV da nossa clínica.',
    openGraph: {
      title: title,
      description: 'Acompanhe as novidades e informações na TV da nossa clínica.',
      images: clinic?.logo_url ? [{ url: clinic.logo_url }] : undefined,
    }
  };
}

export default async function TvPlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Como estamos usando Zustand (Client-side memory) no MVP, passamos apenas o slug 
  // para o wrapper que vai buscar no estado global. No futuro com Supabase,
  // faremos a busca real no banco de dados aqui mesmo (Server Side).
  return <TvPlayerWrapper slug={resolvedParams.slug} />;
}
