import Link from 'next/link';
import { MonitorPlay, Zap, LayoutTemplate, Clock, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { MOCK_PLANS } from '@/lib/mock-data';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-blue-200">
      
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">TV SaaS</span>
          </div>
          
          <nav className="hidden md:flex gap-8 items-center text-sm font-medium text-gray-600">
            <a href="#recursos" className="hover:text-blue-600 transition-colors">Recursos</a>
            <a href="#planos" className="hover:text-blue-600 transition-colors">Planos</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="text-sm font-medium text-gray-500 hover:text-gray-900 hidden sm:block"
            >
              Acesso Admin
            </Link>
            <Link 
              href="/login" 
              className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
            >
              Entrar na Clínica
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">

          
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            A TV do seu negócio nunca foi tão <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">inteligente.</span>
          </h1>
          
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Diga adeus aos pendrives. Gerencie imagens, vídeos e promoções de qualquer lugar, em tempo real. Transforme sua sala de espera em uma máquina de vendas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/cadastro" 
              className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-semibold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center group"
            >
              Testar Gratuitamente
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href="#recursos" 
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-full font-semibold text-lg transition-all flex items-center justify-center"
            >
              Ver Demonstração
            </a>
          </div>
        </div>

        {/* MOCKUP PREVIEW */}
        <div className="max-w-5xl mx-auto mt-20 px-6">
          <div className="relative rounded-2xl bg-gray-900 p-2 shadow-2xl overflow-hidden ring-1 ring-gray-900/10">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="rounded-xl overflow-hidden bg-white aspect-video relative flex items-center justify-center">
              {/* Abstract interface mockup */}
              <div className="absolute inset-0 bg-gray-50 flex flex-col">
                <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 flex p-4 gap-4">
                  <div className="w-48 bg-gray-200 rounded-lg hidden sm:block opacity-50"></div>
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="h-32 bg-blue-100 rounded-xl border border-blue-200 animate-pulse"></div>
                    <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex gap-4">
                      <div className="w-1/3 bg-gray-100 rounded-lg"></div>
                      <div className="w-1/3 bg-gray-100 rounded-lg"></div>
                      <div className="w-1/3 bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="recursos" className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo que você precisa em um só lugar</h2>
            <p className="text-gray-500 text-lg">Criamos um ecossistema perfeito para que a gestão da sua mídia out-of-home seja invisível, rápida e eficiente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors border border-gray-100 hover:border-blue-100 group">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tempo Real</h3>
              <p className="text-gray-600 leading-relaxed">Adicionou um slide no painel? Ele aparece instantaneamente na TV da sua clínica. Sem recarregar e sem esperar.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-indigo-50 transition-colors border border-gray-100 hover:border-indigo-100 group">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <LayoutTemplate className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gestão de Múltiplas Telas</h3>
              <p className="text-gray-600 leading-relaxed">Controle 1 ou 100 TVs através do mesmo painel. Perfeito para redes de franquias ou consultórios grandes.</p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 hover:bg-emerald-50 transition-colors border border-gray-100 hover:border-emerald-100 group">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Altamente Estável</h3>
              <p className="text-gray-600 leading-relaxed">Sistema à prova de falhas. Se a internet da clínica cair, a TV continua reproduzindo o último conteúdo em cache.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="planos" className="py-24 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simples e Transparente</h2>
            <p className="text-gray-500 text-lg">Acesso total a todas as funcionalidades do sistema por um valor único.</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative rounded-3xl p-8 bg-white border border-blue-600 shadow-2xl scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-green-500 text-white text-sm font-bold uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                10 Dias Acesso Liberado
              </div>
              
              <div className="text-center mt-4 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Plano Ilimitado</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-extrabold text-gray-900">R$ 19,90</span>
                  <span className="text-gray-500 font-medium">/mês</span>
                </div>
                <p className="text-gray-500 text-sm">Cancele quando quiser.</p>
              </div>
              
              <ul className="space-y-4 mb-8 bg-gray-50 p-6 rounded-2xl">
                <li className="flex items-start text-gray-700 font-medium">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Criação de Slides Ilimitados</span>
                </li>
                <li className="flex items-start text-gray-700 font-medium">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Upload de Imagens e Vídeos</span>
                </li>
                <li className="flex items-start text-gray-700 font-medium">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Atualizações em Tempo Real</span>
                </li>
                <li className="flex items-start text-gray-700 font-medium">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Painel Administrativo Completo</span>
                </li>
              </ul>

              <Link 
                href="/cadastro" 
                className="w-full py-4 px-6 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 text-lg"
              >
                Começar Teste Grátis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-center text-xs text-gray-400 mt-4">Não exigimos cartão de crédito no cadastro.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <MonitorPlay className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">TV SaaS</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2026 TV Player SaaS. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
