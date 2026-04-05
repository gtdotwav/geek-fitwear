'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import ProductGrid from '@/components/ProductGrid';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <main className="bg-[#F5F1E8]">

      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <HeroSlider />

      {/* ─── Manifesto strip ────────────────────────────────────────── */}
      <section className="bg-[#F5F1E8] py-20 border-b border-[#E6DFD2]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <p className="font-serif font-light italic text-[#1A1A1A] text-2xl md:text-3xl lg:text-4xl leading-relaxed tracking-wide">
              "Feito onde o sol encontra a pedra —<br />
              para corpos que se movem com intenção."
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-12 bg-[#C2A27C]" />
              <span className="text-[#6F6A5F] text-[9px] tracking-[0.4em] uppercase">GreekFit · Coleção 2025</span>
              <div className="h-px w-12 bg-[#C2A27C]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Category editorial grid ────────────────────────────────── */}
      <section className="bg-[#F5F1E8] py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <p className="text-[#6F6A5F] text-[9px] tracking-[0.45em] uppercase text-center mb-14">
              A Linha
            </p>
          </Reveal>

          {/* Asymmetric editorial layout */}
          <div className="grid grid-cols-12 gap-4 md:gap-6">

            {/* Large left */}
            <Reveal className="col-span-12 md:col-span-7" delay={0}>
              <Link href="#collection" className="group block relative overflow-hidden aspect-[4/5] md:aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=85"
                  alt="Legging"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                  style={{ filter: 'saturate(0.85) brightness(0.95) sepia(0.05)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-7 left-7">
                  <p className="text-[#F5F1E8] text-[9px] tracking-[0.35em] uppercase mb-1 opacity-80">Legging</p>
                  <p className="text-[#F5F1E8] font-serif font-light italic text-2xl">Linha Aegean</p>
                </div>
              </Link>
            </Reveal>

            {/* Right stack */}
            <div className="col-span-12 md:col-span-5 flex flex-col gap-4 md:gap-6">
              <Reveal delay={0.1}>
                <Link href="#collection" className="group block relative overflow-hidden aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=700&q=85"
                    alt="Top"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                    style={{ filter: 'saturate(0.85) brightness(0.95) sepia(0.05)' }}
                  />
                  <div className="absolute bottom-5 left-5">
                    <p className="text-[#F5F1E8] text-[9px] tracking-[0.35em] uppercase mb-0.5 opacity-80">Top</p>
                    <p className="text-[#F5F1E8] font-serif font-light italic text-xl">Série Island</p>
                  </div>
                </Link>
              </Reveal>

              <Reveal delay={0.18}>
                <Link href="#collection" className="group block relative overflow-hidden aspect-[4/3]">
                  <img
                    src="https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=700&q=85"
                    alt="Set"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                    style={{ filter: 'saturate(0.85) brightness(0.95) sepia(0.05)' }}
                  />
                  <div className="absolute bottom-5 left-5">
                    <p className="text-[#F5F1E8] text-[9px] tracking-[0.35em] uppercase mb-0.5 opacity-80">Conjunto</p>
                    <p className="text-[#F5F1E8] font-serif font-light italic text-xl">Santorini</p>
                  </div>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ΔΥΝΑΜΙΣ Collection Feature ──────────────────────────────── */}
      <section className="bg-[#F5F1E8] py-20 border-t border-[#E6DFD2]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <Reveal>
            <Link href="/produto/dynamis" className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden bg-[#1A1A1A]">
                {/* Image */}
                <div className="aspect-[3/4] lg:aspect-auto lg:min-h-[600px] overflow-hidden relative">
                  <img
                    src="/products/dynamis/1.png"
                    alt="ΔΥΝΑΜΙΣ Collection"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000"
                  />
                </div>
                {/* Text */}
                <div className="flex items-center justify-center px-10 py-16 lg:py-0 lg:px-16">
                  <div className="text-center">
                    <p className="text-[#C2A27C] text-[9px] tracking-[0.5em] uppercase mb-6">Nova Coleção</p>
                    <h2 className="font-serif font-light text-[#F5F1E8] text-6xl md:text-7xl tracking-wide mb-3">
                      ΔΥΝΑΜΙΣ
                    </h2>
                    <p className="font-serif font-light italic text-[#A88F6A] text-xl tracking-wide mb-8">
                      Força
                    </p>
                    <p className="text-[#8C7A5B] font-light text-sm leading-loose max-w-xs mx-auto mb-10">
                      Top, Shorts, Legging ou Conjunto Completo.
                      Escolha sua peça. Escolha seu estilo — Logobox ou Clean.
                    </p>
                    <span className="text-[#C2A27C] text-[9px] tracking-[0.35em] uppercase border-b border-[#C2A27C]/40 group-hover:border-[#C2A27C] pb-1 transition-colors">
                      Explorar a coleção
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─── Product grid ───────────────────────────────────────────── */}
      <div className="border-t border-[#E6DFD2]">
        <ProductGrid />
      </div>

      {/* ─── Campaign / Lifestyle section ───────────────────────────── */}
      <section id="campaign" className="bg-[#E6DFD2]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image */}
            <Reveal className="aspect-[4/5] lg:aspect-auto lg:min-h-[640px]">
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&q=85"
                  alt="Campaign"
                  className="w-full h-full object-cover"
                  style={{ filter: 'saturate(0.8) brightness(0.92) sepia(0.08)' }}
                />
              </div>
            </Reveal>

            {/* Text */}
            <Reveal delay={0.15} className="flex items-center px-10 py-20 lg:px-20">
              <div>
                <p className="text-[#6F6A5F] text-[9px] tracking-[0.45em] uppercase mb-10">
                  Campanha 2025
                </p>
                <h2 className="font-serif font-light italic text-[#1A1A1A] text-4xl md:text-5xl leading-tight mb-8">
                  Onde a pedra<br />encontra o mar.
                </h2>
                <p className="text-[#6F6A5F] font-light text-sm leading-loose max-w-sm mb-10">
                  Inspirada na arquitetura crua da costa Egeia.
                  Cada peça carrega o silêncio do calcário, o calor
                  da terracota e a liberdade das águas abertas.
                </p>
                <Link
                  href="#collection"
                  className="text-[#A88F6A] text-[9px] tracking-[0.35em] uppercase border-b border-[#A88F6A]/40 hover:border-[#A88F6A] pb-1 transition-colors"
                >
                  Explorar a coleção
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Philosophy ─────────────────────────────────────────────── */}
      <section id="philosophy" className="bg-[#2B2B2B] py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Reveal>
            <p className="text-[#C2A27C] text-[9px] tracking-[0.5em] uppercase mb-12">Nossa Filosofia</p>
            <h2 className="font-serif font-light italic text-[#F5F1E8] text-4xl md:text-5xl lg:text-6xl leading-tight mb-10">
              O corpo não é uma máquina.<br />É uma paisagem.
            </h2>
            <p className="text-[#8C7A5B] font-light text-sm leading-loose max-w-xl mx-auto">
              A GreekFit nasceu da crença de que o movimento é sagrado.
              Que o que você veste durante sua prática deve honrar a
              inteligência do seu corpo — não limitá-la. Criamos com
              precisão, desenhamos com contenção e produzimos com cuidado.
            </p>
            <div className="flex items-center justify-center gap-4 mt-14">
              <div className="h-px w-10 bg-[#C2A27C]/40" />
              <span className="text-[#8C7A5B] text-[8px] tracking-[0.5em] uppercase">
                Athens · São Paulo · 2025
              </span>
              <div className="h-px w-10 bg-[#C2A27C]/40" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-[#F5F1E8] border-t border-[#E6DFD2] py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <p className="font-serif font-light italic text-[#1A1A1A] text-xl mb-4">GreekFit</p>
              <p className="text-[#6F6A5F] text-[10px] leading-relaxed font-light max-w-[180px]">
                Roupas fitness premium. Luz mediterrânea. Energia brasileira.
              </p>
            </div>

            {[
              { title: 'Loja', links: ['Coleção', 'Novidades', 'Outlet', 'Gift Cards'] },
              { title: 'Ajuda', links: ['Guia de Tamanhos', 'Entrega', 'Devoluções', 'Contato'] },
              { title: 'Empresa', links: ['Filosofia', 'Sustentabilidade', 'Imprensa', 'Carreiras'] },
            ].map(col => (
              <div key={col.title}>
                <p className="text-[#1A1A1A] text-[9px] tracking-[0.3em] uppercase mb-5 font-medium">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-[#6F6A5F] text-[10px] font-light tracking-wide hover:text-[#1A1A1A] transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div className="border-t border-[#E6DFD2] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#6F6A5F] text-[9px] tracking-[0.2em] font-light">
              © 2025 GreekFit. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6">
              {['Instagram', 'TikTok', 'Pinterest'].map(s => (
                <a key={s} href="#" className="text-[#6F6A5F] text-[9px] tracking-[0.2em] uppercase hover:text-[#1A1A1A] transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
