import TvPlayerWrapper from './TvPlayerWrapper';

export default async function TvPlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Como estamos usando Zustand (Client-side memory) no MVP, passamos apenas o slug 
  // para o wrapper que vai buscar no estado global. No futuro com Supabase,
  // faremos a busca real no banco de dados aqui mesmo (Server Side).
  return <TvPlayerWrapper slug={resolvedParams.slug} />;
}
