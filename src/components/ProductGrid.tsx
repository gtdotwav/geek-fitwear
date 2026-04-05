'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { products, categories, Category } from '@/data/products';
import ProductCard from './ProductCard';

type SortOption = 'featured' | 'low' | 'high' | 'new';

const sortLabels: Record<SortOption, string> = {
  featured: 'Destaques',
  low: 'Menor preço',
  high: 'Maior preço',
  new: 'Novidades',
};

export default function ProductGrid() {
  const [cat, setCat] = useState<Category>('Todos');
  const [sort, setSort] = useState<SortOption>('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);

  const toggleSize = (s: string) =>
    setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (cat !== 'Todos') list = list.filter(p => p.category === cat);
    if (sizes.length) list = list.filter(p => p.sizes.some(s => sizes.includes(s)));
    if (sort === 'low') list.sort((a, b) => a.pixPrice - b.pixPrice);
    if (sort === 'high') list.sort((a, b) => b.pixPrice - a.pixPrice);
    if (sort === 'new') list.sort((a, b) => (a.tag === 'Novo' ? -1 : b.tag === 'Novo' ? 1 : 0));
    return list;
  }, [cat, sort, sizes]);

  return (
    <section id="collection" className="bg-[#F5F1E8]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-28">

        {/* Header */}
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-[#6F6A5F] text-[9px] tracking-[0.45em] uppercase mb-2">GreekFit</p>
            <h2 className="font-serif font-extralight text-[#1A1A1A] text-4xl md:text-5xl">
              A Coleção
            </h2>
          </div>
          <p className="text-[#6F6A5F] text-[10px] tracking-wide hidden sm:block">
            {filtered.length} peças
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-10 pb-8 border-b border-[#E6DFD2]">

          {/* Categories */}
          <div className="flex items-center gap-1 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 text-[9px] tracking-[0.25em] uppercase font-medium transition-all duration-200 ${
                  cat === c
                    ? 'bg-[#1A1A1A] text-[#F5F1E8]'
                    : 'text-[#6F6A5F] hover:text-[#1A1A1A]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Right: sizes + sort */}
          <div className="flex items-center gap-4">
            {/* Size filter */}
            <div className="flex items-center gap-1">
              {['PP', 'P', 'M', 'G', 'GG'].map(s => (
                <button
                  key={s}
                  onClick={() => toggleSize(s)}
                  className={`w-8 h-8 text-[9px] font-medium border transition-all duration-200 ${
                    sizes.includes(s)
                      ? 'border-[#A88F6A] text-[#A88F6A]'
                      : 'border-[#E6DFD2] text-[#6F6A5F] hover:border-[#A88F6A]/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-[#E6DFD2]" />

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase text-[#6F6A5F] hover:text-[#1A1A1A] transition-colors"
              >
                {sortLabels[sort]}
                <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-[#F5F1E8] border border-[#E6DFD2] z-20 min-w-[140px] shadow-sm"
                  >
                    {(Object.entries(sortLabels) as [SortOption, string][]).map(([v, l]) => (
                      <button
                        key={v}
                        onClick={() => { setSort(v); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-[9px] tracking-[0.2em] uppercase border-b border-[#E6DFD2] last:border-0 transition-colors ${
                          sort === v ? 'text-[#A88F6A]' : 'text-[#6F6A5F] hover:text-[#1A1A1A]'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {(cat !== 'Todos' || sizes.length > 0) && (
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {cat !== 'Todos' && (
              <span className="flex items-center gap-1.5 border border-[#E6DFD2] px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase text-[#6F6A5F]">
                {cat}
                <button onClick={() => setCat('Todos')} className="hover:text-[#1A1A1A] ml-1">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {sizes.map(s => (
              <span key={s} className="flex items-center gap-1.5 border border-[#A88F6A]/30 px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase text-[#A88F6A]">
                {s}
                <button onClick={() => toggleSize(s)} className="hover:text-[#1A1A1A] ml-1">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center">
              <p className="text-[#6F6A5F] text-sm tracking-wide font-light">Nenhuma peça encontrada.</p>
              <button onClick={() => { setCat('Todos'); setSizes([]); }} className="text-[#A88F6A] text-[9px] tracking-[0.25em] uppercase mt-4 hover:text-[#8C7A5B]">
                Limpar filtros
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${cat}-${sort}-${sizes.join()}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-14"
            >
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
