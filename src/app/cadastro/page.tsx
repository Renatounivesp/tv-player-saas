'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { MonitorPlay, UserPlus, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [managerName, setManagerName] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Criar o Usuário na Autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Falha ao criar usuário.');
      }

      // 2. Criar a Clínica atrelada a este usuário
      const slug = clinicName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const { error: clinicError } = await supabase.from('clinics').insert([
        {
          name: clinicName,
          slug: slug,
          manager_name: managerName,
          email: email,
          status: 'active',
          plan_id: 'p_unico',
          subscription_value: 49,
          user_id: authData.user.id
        }
      ]);

      if (clinicError) throw clinicError;

      // Sucesso!
      setIsSuccess(true);
      
      // Se o Supabase logar automaticamente:
      if (authData.session) {
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 2000);
      }
      
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('clinics_slug_key')) {
        setError('Este nome de clínica já está em uso. Por favor, escolha outro nome.');
      } else {
        setError(err.message === 'User already registered' ? 'Este e-mail já está em uso.' : err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-12 px-4 shadow sm:rounded-2xl text-center border border-green-100">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta Criada!</h2>
          <p className="text-gray-600 mb-6">
            A clínica <strong>{clinicName}</strong> foi cadastrada com sucesso.
          </p>
          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-6 text-left">
            <strong>Atenção:</strong> Se você ativou a confirmação de e-mail no Supabase, por favor verifique sua caixa de entrada para ativar a conta antes de entrar.
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link href="/dashboard" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
              Ir para o Painel
            </Link>
            <Link href="/login" className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Fazer Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg">
            <MonitorPlay className="w-8 h-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Teste Grátis por 10 dias
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Faça login aqui
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Nome da Clínica</label>
              <input
                type="text"
                required
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Ex: Clínica Sorriso"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Seu Nome</label>
              <input
                type="text"
                required
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Ex: Dr. João"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Criando conta...' : (
                  <span className="flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Criar Minha Conta
                  </span>
                )}
              </button>
            </div>
            <p className="text-xs text-center text-gray-400 mt-4">
              Ao criar uma conta, você concorda com nossos Termos de Uso.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
