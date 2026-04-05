'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Truck, Shield, Star, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/data/products';

// ─── Piece definitions ────────────────────────────────────────────────────────

type PieceKey = 'top' | 'shorts' | 'pants' | 'fullOutfit';
type VariantKey = 'logobox' | 'clean';

interface PieceConfig {
  label: string;
  subtitle: string;
  images: string[];
  originalPrice: number;
  pixPrice: number;
  installments: { count: number; value: number };
  description: string;
  features: string[];
  details: string;
}

const pieces: Record<PieceKey, PieceConfig> = {
  top: {
    label: 'Top',
    subtitle: 'Sports Bra',
    images: [
      '/products/dynamis/1.png',
      '/products/dynamis/7.png',
      '/products/dynamis/6.png',
    ],
    originalPrice: 189,
    pixPrice: 152,
    installments: { count: 12, value: 15.83 },
    description: 'Top esportivo de suporte médio-alto com banda elástica ΔΥΝΑΜΙΣ. Decote quadrado, alças largas cruzadas nas costas. Silhueta sculpting que acompanha cada movimento.',
    features: [
      'Suporte médio-alto',
      'Banda elástica com branding',
      'Alças cruzadas nas costas',
      'Tecido segunda pele',
      'Bojo removível',
      'Costura flat sem atrito',
    ],
    details: 'Composição: 82% Poliamida, 18% Elastano. Bojo de EVA destacável. Banda inferior com logotipo ΔΥΝΑΜΙΣ em tom-sobre-tom.',
  },
  shorts: {
    label: 'Shorts',
    subtitle: 'Biker Shorts',
    images: [
      '/products/dynamis/3.png',
      '/products/dynamis/2.png',
      '/products/dynamis/5.png',
    ],
    originalPrice: 169,
    pixPrice: 135,
    installments: { count: 12, value: 14.08 },
    description: 'Shorts de cintura alta com comprimento mid-thigh. Cós duplo anatômico com logotipo ΔΥΝΑΜΙΣ. Compressão suave que esculpe sem restringir.',
    features: [
      'Cintura alta dupla',
      'Comprimento mid-thigh',
      'Compressão sculpting',
      'Não fica transparente',
      'Secagem ultrarrápida',
      'Anti-pilling',
    ],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós de 8cm com encaixe anatômico. Logotipo ΔΥΝΑΜΙΣ no cós frontal.',
  },
  pants: {
    label: 'Legging',
    subtitle: 'Full Length',
    images: [
      '/products/dynamis/4.png',
      '/products/dynamis/Untitled.png',
    ],
    originalPrice: 229,
    pixPrice: 184,
    installments: { count: 12, value: 19.17 },
    description: 'Legging full-length de cintura alta com cós ΔΥΝΑΜΙΣ. Tecido compressivo 4-way stretch que acompanha cada extensão sem perder a forma.',
    features: [
      'Cintura alta modeladora',
      'Tecido 4-Way Stretch',
      'Cós com branding ΔΥΝΑΜΙΣ',
      'Comprimento full-length',
      'Não transparece',
      'Costura flat premium',
    ],
    details: 'Composição: 76% Poliamida, 24% Elastano. Cós duplo de 10cm com logotipo ΔΥΝΑΜΙΣ. Costura ultraplana. Comprimento 7/8.',
  },
  fullOutfit: {
    label: 'Conjunto',
    subtitle: 'Top + Shorts',
    images: [
      '/products/dynamis/6.png',
      '/products/dynamis/1.png',
      '/products/dynamis/3.png',
      '/products/dynamis/2.png',
      '/products/dynamis/5.png',
      '/products/dynamis/7.png',
    ],
    originalPrice: 339,
    pixPrice: 271,
    installments: { count: 12, value: 28.25 },
    description: 'O conjunto completo ΔΥΝΑΜΙΣ. Top esportivo + Shorts biker coordenados, no mesmo lote de tingimento para cor exata. Força e harmonia em cada detalhe.',
    features: [
      'Top + Shorts coordenados',
      'Mesmo lote de tingimento',
      'Branding ΔΥΝΑΜΙΣ em ambas as peças',
      'Tecido sculpting 4-way',
      'Suporte médio-alto no top',
      'Cintura alta nos shorts',
    ],
    details: 'Set completo: Top ΔΥΝΑΜΙΣ + Shorts ΔΥΝΑΜΙΣ. Composição: 82% Poliamida, 18% Elastano (top) / 76% Poliamida, 24% Elastano (shorts). Vendidos juntos.',
  },
};

const pieceKeys: PieceKey[] = ['top', 'shorts', 'pants', 'fullOutfit'];
const sizes = ['P', 'M', 'G', 'GG'];

const washing = 'Lavar à mão ou em máquina com água fria no ciclo delicado. Não usar alvejante ou amaciante. Não torcer. Secar à sombra. Não passar ferro.';

// ─── Component ────────────────────────────────────────────────────────────────

export default function DynamisPage() {
  const { addItem } = useCart();
  const [activePiece, setActivePiece] = useState<PieceKey>('fullOutfit');
  const [variant, setVariant] = useState<VariantKey>('logobox');
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [added, setAdded] = useState(false);
  const [accordion, setAccordion] = useState<string | null>(null);

  const piece = pieces[activePiece];
  const images = piece.images;
  const discount = Math.round(((piece.originalPrice - piece.pixPrice) / piece.originalPrice) * 100);

  const handlePieceChange = (key: PieceKey) => {
    setActivePiece(key);
    setActiveImage(0);
    setSelectedSize(null);
    setAdded(false);
  };

  const handleAdd = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }

    const productForCart: Product = {
      id: `dynamis-${activePiece}-${variant}`,
      name: `${piece.label} ΔΥΝΑΜΙΣ · ${variant === 'logobox' ? 'Logobox' : 'Clean'}`,
      category: activePiece === 'fullOutfit' ? 'Set' : 'Top',
      tag: 'Novo',
      originalPrice: piece.originalPrice,
      pixPrice: piece.pixPrice,
      installments: piece.installments,
      sizes,
      colors: [{ name: 'Sand', hex: '#E8DDD0', image: images[0] }],
      description: piece.description,
      stock: 15,
      features: piece.features,
      details: piece.details,
      washing,
    };

    addItem(productForCart, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const accordionItems = [
    {
      id: 'details',
      label: 'Detalhes do Produto',
      content: <p className="text-[#6F6A5F] text-xs font-light leading-relaxed">{piece.details}</p>,
    },
    {
      id: 'sizing',
      label: 'Guia de Tamanhos',
      content: (
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#E6DFD2]">
              {['Tam.', 'Busto (cm)', 'Cintura (cm)', 'Quadril (cm)'].map(h => (
                <th key={h} className="text-left pb-3 text-[#6F6A5F] font-light">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6DFD2]">
            {[['P', '80–86', '62–68', '88–94'], ['M', '86–92', '68–74', '94–100'], ['G', '92–98', '74–80', '100–106'], ['GG', '98–106', '80–88', '106–114']].map(([sz, ...r]) => (
              <tr key={sz}>
                <td className="py-3 text-[#1A1A1A] font-medium">{sz}</td>
                {r.map((v, i) => <td key={i} className="py-3 text-[#6F6A5F] font-light">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    {
      id: 'care',
      label: 'Cuidados com a Peça',
      content: <p className="text-[#6F6A5F] text-xs font-light leading-relaxed">{washing}</p>,
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
          <span className="text-[#6F6A5F]">Coleção</span>
          <span className="text-[#E6DFD2]">/</span>
          <span className="text-[#A88F6A]">ΔΥΝΑΜΙΣ</span>
        </nav>

        {/* ─── Collection Header ─── */}
        <div className="text-center mb-16">
          <p className="text-[#6F6A5F] text-[9px] tracking-[0.5em] uppercase mb-4">Coleção Exclusiva</p>
          <h1 className="font-serif font-light text-[#1A1A1A] text-6xl md:text-8xl tracking-wide mb-3">
            ΔΥΝΑΜΙΣ
          </h1>
          <p className="font-serif font-light italic text-[#A88F6A] text-xl md:text-2xl tracking-wide mb-6">
            Força
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#C2A27C]/50" />
            <span className="text-[#6F6A5F] text-[8px] tracking-[0.5em] uppercase">White · Premium · Seamless</span>
            <div className="h-px w-16 bg-[#C2A27C]/50" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-24">

          {/* ── Images ── */}
          <div className="space-y-3">
            <div className="aspect-[3/4] overflow-hidden bg-[#E6DFD2]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${activePiece}-${activeImage}`}
                  src={images[activeImage]}
                  alt={`ΔΥΝΑΜΙΣ ${piece.label}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={`${activePiece}-thumb-${i}`}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-20 flex-shrink-0 overflow-hidden transition-all ${
                      activeImage === i
                        ? 'ring-1 ring-[#A88F6A] ring-offset-2 ring-offset-[#F5F1E8]'
                        : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="lg:pt-4 space-y-8">

            {/* Title */}
            <div>
              <p className="text-[#6F6A5F] text-[9px] tracking-[0.35em] uppercase mb-2">
                ΔΥΝΑΜΙΣ · {piece.subtitle}
              </p>
              <h2 className="font-serif font-light text-[#1A1A1A] text-4xl md:text-5xl italic tracking-tight leading-tight">
                {piece.label} ΔΥΝΑΜΙΣ
              </h2>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-3 pb-6 border-b border-[#E6DFD2]">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-[#A88F6A] fill-[#A88F6A]" />)}
              </div>
              <span className="text-[#6F6A5F] text-[10px] font-light">5.0 · Nova Coleção</span>
            </div>

            {/* ── Piece Selector ── */}
            <div>
              <p className="text-[#6F6A5F] text-[9px] tracking-[0.3em] uppercase mb-4 font-medium">
                Escolha a Peça
              </p>
              <div className="grid grid-cols-2 gap-2">
                {pieceKeys.map(key => {
                  const p = pieces[key];
                  const isActive = activePiece === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handlePieceChange(key)}
                      className={`relative py-4 px-4 text-left border transition-all duration-300 ${
                        isActive
                          ? 'border-[#1A1A1A] bg-[#1A1A1A]'
                          : 'border-[#E6DFD2] hover:border-[#A88F6A]/50 bg-transparent'
                      }`}
                    >
                      <span className={`block text-[9px] tracking-[0.25em] uppercase mb-0.5 ${
                        isActive ? 'text-[#A88F6A]' : 'text-[#6F6A5F]'
                      }`}>
                        {p.subtitle}
                      </span>
                      <span className={`block text-sm font-light tracking-wide ${
                        isActive ? 'text-[#F5F1E8]' : 'text-[#1A1A1A]'
                      }`}>
                        {p.label}
                      </span>
                      <span className={`block text-[10px] mt-1 font-light ${
                        isActive ? 'text-[#A88F6A]' : 'text-[#A88F6A]'
                      }`}>
                        R$ {p.pixPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Variant Selector ── */}
            <div>
              <p className="text-[#6F6A5F] text-[9px] tracking-[0.3em] uppercase mb-4 font-medium">
                Estilo
              </p>
              <div className="flex gap-2">
                {(['logobox', 'clean'] as VariantKey[]).map(v => {
                  const isActive = variant === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setVariant(v)}
                      className={`flex-1 py-3.5 text-center border transition-all duration-300 ${
                        isActive
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F1E8]'
                          : 'border-[#E6DFD2] text-[#6F6A5F] hover:border-[#A88F6A]/50 hover:text-[#1A1A1A]'
                      }`}
                    >
                      <span className="block text-[9px] tracking-[0.3em] uppercase font-medium">
                        {v === 'logobox' ? 'Logobox' : 'Clean'}
                      </span>
                      <span className={`block text-[8px] mt-0.5 font-light tracking-wider ${
                        isActive ? 'text-[#A88F6A]' : 'text-[#6F6A5F]'
                      }`}>
                        {v === 'logobox' ? 'Com branding ΔΥΝΑΜΙΣ' : 'Sem branding aparente'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <p className="text-[#6F6A5F] text-sm font-light line-through">
                R$ {piece.originalPrice.toFixed(2).replace('.', ',')}
              </p>
              <div className="flex items-baseline gap-3">
                <span className="text-[#1A1A1A] font-light text-3xl">
                  R$ {piece.pixPrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[#A88F6A] text-[9px] tracking-[0.25em] uppercase">Pix · -{discount}%</span>
              </div>
              <p className="text-[#6F6A5F] font-light text-sm">
                ou {piece.installments.count}x R$ {piece.installments.value.toFixed(2).replace('.', ',')} sem juros
              </p>
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
                {sizes.map(size => (
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
              {piece.description}
            </p>

            {/* Trust */}
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

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {piece.features.map(f => (
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
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
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

        {/* ─── Full Gallery Grid ─── */}
        <div className="mt-28 border-t border-[#E6DFD2] pt-16">
          <div className="text-center mb-12">
            <p className="text-[#6F6A5F] text-[9px] tracking-[0.4em] uppercase mb-2">Galeria</p>
            <h2 className="font-serif font-light italic text-[#1A1A1A] text-3xl">ΔΥΝΑΜΙΣ em Detalhe</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              '/products/dynamis/1.png',
              '/products/dynamis/3.png',
              '/products/dynamis/4.png',
              '/products/dynamis/Untitled.png',
              '/products/dynamis/6.png',
              '/products/dynamis/2.png',
              '/products/dynamis/5.png',
              '/products/dynamis/7.png',
            ].map((src, i) => (
              <motion.div
                key={i}
                className={`overflow-hidden cursor-pointer ${
                  i === 0 || i === 4 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                whileHover={{ scale: 0.98 }}
                transition={{ duration: 0.4 }}
                onClick={() => {
                  const pieceMatch = Object.entries(pieces).find(([, p]) => p.images.includes(src));
                  if (pieceMatch) {
                    const [key, p] = pieceMatch;
                    handlePieceChange(key as PieceKey);
                    setActiveImage(p.images.indexOf(src));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <img
                  src={src}
                  alt={`ΔΥΝΑΜΙΣ detalhe ${i + 1}`}
                  className="w-full h-full object-cover aspect-[3/4]"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
