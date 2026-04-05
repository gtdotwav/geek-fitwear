import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
      <div className="text-center">
        <p className="text-[#6F6A5F] text-[9px] tracking-[0.45em] uppercase mb-4">404</p>
        <h1 className="font-serif font-extralight text-[#1A1A1A] text-4xl mb-6">
          Página não encontrada
        </h1>
        <Link
          href="/"
          className="text-[#A88F6A] text-[9px] tracking-[0.35em] uppercase border-b border-[#A88F6A]/40 hover:border-[#A88F6A] pb-1 transition-colors"
        >
          Voltar à coleção
        </Link>
      </div>
    </main>
  );
}
