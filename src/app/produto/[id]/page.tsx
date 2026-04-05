'use client';

import { use, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Truck, Shield, Star, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

interface Props { params: Promise<{ id: string }> }

export default function ProductPage({ params }: Props) {
  const { id } = use(params);
  const product = products.find(p => p.id === id);
  if (!product) notFound();

  const { addItem } = useCart();
  const [activeColor, setActiveColor] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [cep, setCep] = useState('');
  const [accordion, setAccordion] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [logoVariant, setLogoVariant] = useState<'com-logo' | 'sem-logo'>('com-logo');

  const isLegging = product.category === 'Legging' || (product.category === 'Set' && product.name.includes('Completo'));

  const color = product.colors[activeColor];
  const images = [color.image, ...(color.backImage ? [color.backImage] : [])];
  const discount = Math.round(((product.originalPrice - product.pixPrice) / product.originalPrice) * 100);
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const handleColorChange = (i: number) => { setActiveColor(i); setActiveImage(0); };

  const handleAdd = () => {
    if (!selectedSize) { setSizeError(true); setTimeout(() => setSizeError(false), 2000); return; }
    const variant = isLegging ? logoVariant : undefined;
    addItem(product, selectedSize, variant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const accordionItems = [
    {
      id: 'details', label: 'Detalhes do Produto',
      content: <p className="text-[#6F6A5F] text-xs font-light leading-relaxed">{product.details}</p>,
    },
    {
      id: 'sizing', label: 'Guia de Tamanhos',
      content: (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#E6DFD2]">
              {['Tam.', 'Cintura (cm)', 'Quadril (cm)', 'Comprimento (cm)'].map(h => (
                <th key={h} className="text-left pb-3 text-[#6F6A5F] font-light">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6DFD2]">
            {[['P','62–68','88–94','68'],['M','68–74','94–100','70'],['G','74–80','100–106','72'],['GG','80–88','106–114','74']].map(([sz,...r]) => (
              <tr key={sz}>
                <td className="py-3 text-[#1A1A1A] font-medium">{sz}</td>
                {r.map((v,i) => <td key={i} className="py-3 text-[#6F6A5F] font-light">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      id: 'care', label: 'Cuidados com a Peça',
      content: <p className="text-[#6F6A5F] text-xs font-light leading-relaxed">{product.washing}</p>,
    },
  ];

  return (
    <main className="bg-[#F5F1E8] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[9px] tracking-[0.2em] uppercase mb-14">
          <Link href="/" className="text-[#6F6A5F] hover:text-[#1A1A1A] transition-colors flex items-center gap-1.5 group">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.3} />
            Voltar
          </Link>
          <span className="text-[#E6DFD2]">/</span>
          <span className="text-[#6F6A5F]">{product.category}</span>
          <span className="text-[#E6DFD2]">/</span>
          <span className="text-[#A88F6A] truncate max-w-[180px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-24">

          {/* ── Images ── */}
          <div className="space-y-3">
            <div className="aspect-[3/4] overflow-hidden bg-[#E6DFD2]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${activeColor}-${activeImage}`}
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ filter: 'saturate(0.85) brightness(0.97) sepia(0.04)' }}
                />
              </AnimatePresence>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 overflow-hidden transition-all ${
                      activeImage === i ? 'ring-1 ring-[#A88F6A] ring-offset-2 ring-offset-[#F5F1E8]' : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" style={{ filter: 'saturate(0.85)' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="lg:pt-4 space-y-8">

            <div>
              <p className="text-[#6F6A5F] text-[9px] tracking-[0.35em] uppercase mb-2">{product.category}</p>
              <h1 className="font-serif font-light text-[#1A1A1A] text-4xl md:text-5xl italic tracking-tight leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-3 pb-8 border-b border-[#E6DFD2]">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-[#A88F6A] fill-[#A88F6A]" />)}
              </div>
              <span className="text-[#6F6A5F] text-[10px] font-light">4.9 · 127 avaliações</span>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              {discount > 0 && (
                <p className="text-[#6F6A5F] text-sm font-light line-through">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </p>
              )}
              <div className="flex items-baseline gap-3">
                <span className="text-[#1A1A1A] font-light text-3xl">
                  R$ {product.pixPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[#A88F6A] text-[9px] tracking-[0.25em] uppercase">Pix {discount > 0 ? `· -${discount}%` : ''}</span>
              </div>
              <p className="text-[#6F6A5F] font-light text-sm">
                ou {product.installments.count}× R$ {product.installments.value.toFixed(2).replace('.', ',')} sem juros
              </p>
            </div>

            {/* Color */}
            <div>
              <p className="text-[#6F6A5F] text-[9px] tracking-[0.3em] uppercase mb-4">
                Cor — <span className="text-[#1A1A1A]">{color.name}</span>
              </p>
              <div className="flex items-center gap-3">
                {product.colors.map((c, i) => (
                  <button
                    key={i}
                    title={c.name}
                    onClick={() => handleColorChange(i)}
                    className={`w-7 h-7 transition-all duration-200 ${
                      activeColor === i
                        ? 'ring-1 ring-[#A88F6A] ring-offset-2 ring-offset-[#F5F1E8]'
                        : 'opacity-45 hover:opacity-80'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className={`text-[9px] tracking-[0.3em] uppercase font-medium ${sizeError ? 'text-red-400' : 'text-[#6F6A5F]'}`}>
                  {sizeError ? 'Selecione um tamanho' : 'Tamanho'}
                </p>
                <button
                  onClick={() => setAccordion(accordion === 'sizing' ? null : 'sizing')}
                  className="text-[#A88F6A] text-[9px] tracking-[0.2em] uppercase border-b border-[#A88F6A]/30 hover:border-[#A88F6A] transition-colors pb-0.5"
                >
                  Guia de tamanhos
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`w-12 h-12 text-xs font-light border transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F1E8]'
                        : sizeError
                        ? 'border-red-300 text-[#6F6A5F]'
                        : 'border-[#E6DFD2] text-[#6F6A5F] hover:border-[#A88F6A]/50 hover:text-[#1A1A1A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo variant — leggings only */}
            {isLegging && (
              <div>
                <p className="text-[#6F6A5F] text-[9px] tracking-[0.3em] uppercase mb-4 font-medium">
                  Detalhe
                </p>
                <div className="flex gap-2">
                  {([
                    { key: 'com-logo' as const, label: 'Com Logo', sub: 'Logo em relevo no cós' },
                    { key: 'sem-logo' as const, label: 'Sem Logo', sub: 'Versão clean' },
                  ]).map(v => (
                    <button
                      key={v.key}
                      onClick={() => setLogoVariant(v.key)}
                      className={`flex-1 py-3.5 text-center border transition-all duration-300 ${
                        logoVariant === v.key
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F1E8]'
                          : 'border-[#E6DFD2] text-[#6F6A5F] hover:border-[#A88F6A]/50 hover:text-[#1A1A1A]'
                      }`}
                    >
                      <span className="block text-[9px] tracking-[0.3em] uppercase font-medium">
                        {v.label}
                      </span>
                      <span className={`block text-[8px] mt-0.5 font-light tracking-wider ${
                        logoVariant === v.key ? 'text-[#A88F6A]' : 'text-[#6F6A5F]'
                      }`}>
                        {v.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleAdd}
              className={`w-full py-4 text-[9px] font-medium tracking-[0.35em] uppercase flex items-center justify-center gap-3 transition-all duration-400 ${
                added
                  ? 'bg-[#A88F6A] text-[#F5F1E8]'
                  : selectedSize
                  ? 'bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8]'
                  : 'bg-[#E6DFD2] text-[#6F6A5F] cursor-not-allowed'
              }`}
            >
              {added ? <><Check className="w-4 h-4" strokeWidth={1.5} /> Adicionado!</> : 'Adicionar à Sacola'}
            </button>

            {/* Description */}
            <p className="text-[#6F6A5F] font-light text-sm leading-relaxed italic border-l-2 border-[#E6DFD2] pl-5">
              {product.description}
            </p>

            {/* Trust + Shipping */}
            <div className="flex items-center gap-6 text-[9px] text-[#6F6A5F] tracking-[0.15em] uppercase font-light">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3 h-3" strokeWidth={1.3} />
                Compra Segura
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3 h-3" strokeWidth={1.3} />
                Frete grátis acima de R$ 299
              </div>
            </div>

            {/* Freight */}
            <div className="border-t border-[#E6DFD2] pt-6">
              <p className="text-[#6F6A5F] text-[9px] tracking-[0.3em] uppercase mb-4">Calcular Frete</p>
              <div className="flex gap-2">
                <input
                  type="text" placeholder="CEP 00000-000" maxLength={9} value={cep}
                  onChange={e => setCep(e.target.value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2'))}
                  className="flex-1 bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] px-0 py-2 text-[#1A1A1A] text-xs font-light placeholder-[#E6DFD2] focus:outline-none transition-colors"
                />
                <button className="text-[#A88F6A] text-[9px] tracking-[0.25em] uppercase border-b border-[#A88F6A]/30 hover:border-[#A88F6A] pb-2 transition-colors">
                  Calcular
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {product.features.map(f => (
                <div key={f} className="flex items-center gap-2 text-[#6F6A5F] text-[10px] font-light tracking-wide">
                  <div className="w-1 h-1 rounded-full bg-[#C2A27C] flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {/* Accordion */}
            <div className="border-t border-[#E6DFD2]">
              {accordionItems.map(item => (
                <div key={item.id} className="border-b border-[#E6DFD2]">
                  <button
                    onClick={() => setAccordion(accordion === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between py-5 group"
                  >
                    <span className="text-[#1A1A1A] text-[9px] tracking-[0.3em] uppercase font-medium group-hover:text-[#A88F6A] transition-colors">
                      {item.label}
                    </span>
                    <motion.div animate={{ rotate: accordion === item.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-3.5 h-3.5 text-[#6F6A5F]" strokeWidth={1.3} />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {accordion === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6">{item.content}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-28 border-t border-[#E6DFD2] pt-16">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[#6F6A5F] text-[9px] tracking-[0.4em] uppercase mb-2">Você também pode gostar</p>
                <h2 className="font-serif font-light italic text-[#1A1A1A] text-3xl">Mais {product.category}</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
