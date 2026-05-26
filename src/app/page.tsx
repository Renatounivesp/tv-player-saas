'use client';

import Link from 'next/link';
import { MonitorPlay, Zap, LayoutTemplate, ShieldCheck, ArrowRight, Check, MessageSquareText, CloudSun, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-blue-200 overflow-x-hidden">
      
      {/* HEADER / NAVBAR */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg shadow-blue-200">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Clínica<span className="text-blue-600">TV</span></span>
          </div>
          
          <nav className="hidden md:flex gap-8 items-center text-sm font-semibold text-gray-600">
            <a href="#recursos" className="hover:text-blue-600 transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-blue-600 transition-colors">Planos</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-sm font-bold text-gray-600 hover:text-gray-900 hidden sm:block"
            >
              Entrar
            </Link>
            <Link 
              href="/cadastro" 
              className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Testar Grátis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Nova Plataforma de TV Corporativa
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight max-w-4xl mx-auto leading-[1.1] mb-6"
          >
            A sala de espera da sua clínica, agora <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">premium.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Diga adeus aos pendrives antigos. Atualize slides, previsão do tempo e letreiros em tempo real de qualquer lugar. Transforme a espera do seu paciente em encantamento.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/cadastro" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center group"
            >
              Começar 10 Dias Grátis
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* MOCKUP IMAGE */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 w-full max-w-5xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent z-10 h-full w-full pointer-events-none" />
            <img 
              src="/hero-mockup.png" 
              alt="TV Corporativa rodando em uma clínica" 
              className="w-full rounded-2xl shadow-2xl border border-gray-200/50"
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURES SECTION (DARK MODE) */}
      <section id="recursos" className="py-32 bg-gray-900 text-white relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Recursos Exclusivos</h2>
            <p className="text-gray-400 text-xl">Desenvolvemos as ferramentas perfeitas para valorizar a sua marca e engajar seus pacientes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<LayoutTemplate className="w-6 h-6" />}
              title="Editor Drag & Drop"
              description="Organize a ordem dos seus slides apenas arrastando e soltando. Simples, rápido e visual."
            />
            <FeatureCard 
              icon={<MessageSquareText className="w-6 h-6" />}
              title="Letreiro Rotativo"
              description="Dê avisos importantes no rodapé da TV (estilo CNN) sem precisar interromper os seus slides."
            />
            <FeatureCard 
              icon={<CloudSun className="w-6 h-6" />}
              title="Previsão do Tempo"
              description="Exiba a temperatura atual da sua cidade de forma automática e elegante na tela."
            />
            <FeatureCard 
              icon={<Music className="w-6 h-6" />}
              title="Música Ambiente"
              description="Deixe um som de fundo (Lofi ou Jazz) tocando para acalmar os pacientes na recepção."
            />
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="planos" className="py-32 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Preço Simples e Justo</h2>
            <p className="text-gray-500 text-xl">Assinatura única com acesso ilimitado a todas as ferramentas premium.</p>
          </div>

          <motion.div 
            whileHover={{ y: -8 }}
            className="max-w-md mx-auto"
          >
            <div className="relative rounded-[2rem] p-8 md:p-10 bg-white border border-blue-100 shadow-2xl z-10 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
              
              <div className="absolute top-6 right-6 px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Mais Popular
              </div>
              
              <div className="mt-4 mb-8">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Plano Pro</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl md:text-6xl font-black text-gray-900">R$ 19,90</span>
                  <span className="text-gray-500 font-bold text-lg">/mês</span>
                </div>
                <p className="text-gray-500 font-medium">Os primeiros 10 dias são por nossa conta.</p>
              </div>
              
              <ul className="space-y-5 mb-10">
                <PricingFeature text="Acesso total ao Painel Administrativo" />
                <PricingFeature text="Atualização da TV em Tempo Real" />
                <PricingFeature text="Letreiros Rotativos Ilimitados" />
                <PricingFeature text="Música Ambiente (Lofi/Jazz)" />
                <PricingFeature text="Suporte Prioritário por WhatsApp" />
              </ul>

              <Link 
                href="/cadastro" 
                className="w-full py-4 px-6 rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-500/25 flex justify-center items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 text-lg"
              >
                Criar Minha Conta
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-center text-sm font-medium text-gray-400 mt-6">Cancele quando quiser. Sem pegadinhas.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <MonitorPlay className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">ClínicaTV</span>
          </div>
          <div className="text-gray-400 text-sm font-medium">
            © 2026 ClínicaTV SaaS. Feito com amor para clínicas de todo o Brasil.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl bg-gray-800/50 border border-gray-700 hover:bg-gray-800 transition-colors group">
      <div className="w-14 h-14 bg-gray-700 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-medium">{description}</p>
    </div>
  );
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-start text-gray-700 font-bold">
      <div className="mt-1 mr-3 bg-blue-100 text-blue-600 rounded-full p-1 flex-shrink-0">
        <Check className="w-3 h-3" />
      </div>
      <span>{text}</span>
    </li>
  );
}
