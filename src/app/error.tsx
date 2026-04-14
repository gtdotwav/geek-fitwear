'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
      <div className="text-center px-6">
        <p className="text-[#6F6A5F] text-[9px] tracking-[0.45em] uppercase mb-4">Erro</p>
        <h1 className="font-serif font-extralight text-[#1A1A1A] text-4xl mb-4">
          Algo deu errado.
        </h1>
        <p className="text-[#6F6A5F] font-light text-sm mb-8 max-w-sm mx-auto">
          Ocorreu um erro inesperado. Tente novamente ou volte à página inicial.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="bg-[#1A1A1A] text-[#F5F1E8] px-8 py-3.5 text-[9px] tracking-[0.35em] uppercase font-medium hover:bg-[#2B2B2B] transition-colors"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="text-[#A88F6A] text-[9px] tracking-[0.35em] uppercase border-b border-[#A88F6A]/40 hover:border-[#A88F6A] pb-1 transition-colors"
          >
            Página inicial
          </a>
        </div>
      </div>
    </main>
  );
}
