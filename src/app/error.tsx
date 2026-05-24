'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Next.js Runtime Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ops! Algo deu errado.</h2>
        <p className="text-gray-600 mb-6">
          Ocorreu um erro inesperado na aplicação. Isso geralmente acontece por falta de variáveis de ambiente no servidor ou um erro de conexão.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left overflow-auto border border-gray-200">
          <p className="text-sm font-mono text-red-600 break-words">
            {error.message || 'Erro desconhecido'}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
          <Link
            href="/"
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors inline-block"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}
