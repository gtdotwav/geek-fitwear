'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

const tagStyle: Record<string, string> = {
  'Novo': 'text-[#A88F6A]',
  'Mais Vendido': 'text-[#1A1A1A]',
  'Limitado': 'text-[#8C7A5B]',
  'Outlet': 'text-[#6F6A5F]',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [activeColor, setActiveColor] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [added, setAdded] = useState(false);

  const color = product.colors[activeColor];
  const img = hovered && color.backImage ? color.backImage : color.image;

  const discount = Math.round(
    ((product.originalPrice - product.pixPrice) / product.originalPrice) * 100
  );

  const handleQuickAdd = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, size);
    setAdded(true);
    setShowSizes(false);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleSizes = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowSizes(!showSizes);
  };

  return (
    <div
      className="group bg-[#F5F1E8]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSizes(false); }}
    >
      {/* Image */}
      <Link href={`/produto/${product.id}`} className="block relative overflow-hidden aspect-[3/4]">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={img}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            style={{ filter: 'saturate(0.88) brightness(0.97)' }}
          />
        </motion.div>

        {/* Tag */}
        {product.tag && (
          <span className={`absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase font-medium z-10 ${tagStyle[product.tag] || 'text-[#6F6A5F]'}`}>
            {product.tag}
          </span>
        )}

        {/* Low stock */}
        {product.stock <= 3 && (
          <span className="absolute top-3 right-3 text-[9px] tracking-[0.15em] uppercase text-[#A88F6A] z-10">
            Últimas {product.stock}
          </span>
        )}

        {/* Bottom bar — sizes or CTA */}
        <AnimatePresence mode="wait">
          {showSizes ? (
            <motion.div
              key="sizes"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-0 left-0 right-0 z-10 bg-[#F5F1E8]/95 backdrop-blur-sm px-3 py-3"
              onClick={e => e.preventDefault()}
            >
              <p className="text-[#6F6A5F] text-[8px] tracking-[0.25em] uppercase text-center mb-2">Selecione o tamanho</p>
              <div className="flex justify-center gap-1.5">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={e => handleQuickAdd(e, size)}
                    className="w-9 h-9 text-[9px] font-medium border border-[#E6DFD2] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F1E8] hover:border-[#1A1A1A] transition-all duration-200"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : hovered ? (
            <motion.div
              key="hover-bar"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-0 left-0 right-0 z-10 flex"
            >
              <Link
                href={`/produto/${product.id}`}
                className="flex-1 bg-[#F5F1E8]/90 text-[#1A1A1A] py-3 text-[9px] tracking-[0.3em] uppercase font-medium text-center backdrop-blur-sm hover:bg-[#F5F1E8] transition-colors"
              >
                Ver Detalhes
              </Link>
              <button
                onClick={toggleSizes}
                className={`px-4 py-3 backdrop-blur-sm transition-colors ${
                  added
                    ? 'bg-[#A88F6A] text-[#F5F1E8]'
                    : 'bg-[#1A1A1A]/90 text-[#F5F1E8] hover:bg-[#1A1A1A]'
                }`}
              >
                {added
                  ? <Check className="w-4 h-4" strokeWidth={1.5} />
                  : <ShoppingBag className="w-4 h-4" strokeWidth={1.3} />
                }
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Link>

      {/* Info */}
      <div className="pt-4 pb-6 px-1">
        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-2 mb-3">
            {product.colors.map((c, i) => (
              <button
                key={i}
                title={c.name}
                aria-label={`Cor: ${c.name}`}
                onClick={() => setActiveColor(i)}
                className={`w-3 h-3 rounded-full border transition-all duration-200 ${
                  activeColor === i
                    ? 'ring-1 ring-[#A88F6A] ring-offset-2 ring-offset-[#F5F1E8]'
                    : 'opacity-50 hover:opacity-80'
                }`}
                style={{
                  backgroundColor: c.hex,
                  borderColor: c.hex === '#2B2B2B' ? '#4a4a4a' : c.hex,
                }}
              />
            ))}
          </div>
        )}

        <Link href={`/produto/${product.id}`}>
          <p className="text-[#6F6A5F] text-[9px] tracking-[0.3em] uppercase mb-1">{product.category}</p>
          <h3 className="text-[#1A1A1A] font-light text-[15px] tracking-wide mb-3 group-hover:text-[#2B2B2B] transition-colors">
            {product.name}
          </h3>

          <div className="space-y-0.5">
            {discount > 0 && (
              <p className="text-[#6F6A5F] text-xs line-through">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-[#1A1A1A] font-light text-[15px]">
                R$ {product.pixPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-[#A88F6A] text-[9px] tracking-[0.15em] uppercase">Pix</span>
            </div>
            <p className="text-[#6F6A5F] text-[10px]">
              {product.installments.count}x R$ {product.installments.value.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
