'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { products, Product } from '@/data/products';

const FREE_SHIPPING = 299.9;
const PIECE_PROMO = 0.5;   // 50% off on extra piece
const SET_PROMO = 0.8;     // 80% off on second set

function BundleCard({ product, promoPrice, discount, onAdd }: {
  product: Product;
  promoPrice: number;
  discount: number;
  onAdd: (size: string) => void;
}) {
  const [size, setSize] = useState('M');

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 p-3 bg-[#F5F1E8] border border-[#C2A27C]/20 rounded-sm"
    >
      <div className="w-14 h-18 flex-shrink-0 overflow-hidden bg-[#E6DFD2] relative rounded-sm">
        <Image
          src={product.colors[0].image}
          alt={product.name}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[#1A1A1A] text-[11px] font-light tracking-wide leading-tight">{product.name}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-[#6F6A5F] text-[10px] line-through">
            R$ {product.pixPrice.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[#A88F6A] text-[12px] font-medium">
            R$ {promoPrice.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[#C2A27C] text-[8px] tracking-[0.15em] uppercase font-medium">
            -{discount}%
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex gap-1">
            {product.sizes.map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-6 h-6 text-[8px] font-medium border transition-all ${
                  size === s
                    ? 'border-[#A88F6A] text-[#A88F6A] bg-[#A88F6A]/5'
                    : 'border-[#E6DFD2] text-[#6F6A5F]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            onClick={() => onAdd(size)}
            className="ml-auto bg-[#1A1A1A] text-[#F5F1E8] px-3 py-1.5 text-[8px] tracking-[0.2em] uppercase font-medium hover:bg-[#2B2B2B] transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount, addItem } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING - total);
  const progress = Math.min(100, (total / FREE_SHIPPING) * 100);

  // Determine bundle offers based on cart contents
  const bundles = useMemo(() => {
    const cartIds = new Set(items.map(i => i.product.id));
    const hasPiece = items.some(i => ['Top', 'Shorts', 'Legging'].includes(i.product.category));
    const hasSet = items.some(i => i.product.category === 'Set');

    const offers: { product: Product; promoPrice: number; discount: number; type: 'piece' | 'set' }[] = [];

    if (hasPiece) {
      // Suggest other pieces at 50% off
      const pieceSuggestions = products
        .filter(p => ['Top', 'Shorts', 'Legging'].includes(p.category) && !cartIds.has(p.id))
        .slice(0, 3);
      pieceSuggestions.forEach(p => {
        offers.push({
          product: p,
          promoPrice: Math.round(p.pixPrice * (1 - PIECE_PROMO) * 100) / 100,
          discount: Math.round(PIECE_PROMO * 100),
          type: 'piece',
        });
      });
    }

    if (hasSet) {
      // Suggest other sets at 80% off
      const setSuggestions = products
        .filter(p => p.category === 'Set' && !cartIds.has(p.id))
        .slice(0, 2);
      setSuggestions.forEach(p => {
        offers.push({
          product: p,
          promoPrice: Math.round(p.pixPrice * (1 - SET_PROMO) * 100) / 100,
          discount: Math.round(SET_PROMO * 100),
          type: 'set',
        });
      });
    }

    return offers;
  }, [items]);

  const pieceBundles = bundles.filter(b => b.type === 'piece');
  const setBundles = bundles.filter(b => b.type === 'set');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-[#1A1A1A]/20 backdrop-blur-[2px] z-40"
          />

          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 35, stiffness: 280 }}
            className="fixed right-0 top-0 h-full w-full max-w-[420px] bg-[#F5F1E8] border-l border-[#E6DFD2] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#E6DFD2]">
              <div className="flex items-center gap-3">
                <span className="font-serif font-extralight text-[#1A1A1A] text-lg">Sua Sacola</span>
                {itemCount > 0 && (
                  <span className="text-[#A88F6A] text-[10px] tracking-wide">({itemCount})</span>
                )}
              </div>
              <button onClick={closeCart} className="text-[#6F6A5F] hover:text-[#1A1A1A] transition-colors p-1">
                <X className="w-4 h-4" strokeWidth={1.3} />
              </button>
            </div>

            {/* Free shipping */}
            <div className="px-8 py-4 border-b border-[#E6DFD2]">
              {remaining > 0 ? (
                <>
                  <p className="text-[#6F6A5F] text-[9px] tracking-[0.2em] uppercase mb-2.5">
                    Frete grátis a R$ {remaining.toFixed(2).replace('.', ',')} de distância
                  </p>
                  <div className="w-full h-px bg-[#E6DFD2]">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-[#A88F6A]"
                    />
                  </div>
                </>
              ) : (
                <p className="text-[#A88F6A] text-[9px] tracking-[0.25em] uppercase">
                  Frete grátis desbloqueado!
                </p>
              )}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Items */}
              <div className="px-8 py-6 space-y-8">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
                    <ShoppingBag className="w-10 h-10 text-[#E6DFD2]" strokeWidth={1} />
                    <div>
                      <p className="text-[#6F6A5F] text-sm font-light tracking-wide">Sua sacola está vazia</p>
                      <p className="text-[#A88F6A]/60 text-[10px] tracking-[0.2em] uppercase mt-1">Comece a explorar</p>
                    </div>
                  </div>
                ) : (
                  <AnimatePresence>
                    {items.map(item => {
                      const price = item.promoPrice ?? item.product.pixPrice;
                      return (
                        <motion.div
                          key={`${item.product.id}-${item.size}-${item.variant ?? ''}-${item.promoPrice ?? ''}`}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -40 }}
                          className="flex gap-5"
                        >
                          <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-[#E6DFD2] relative">
                            <Image
                              src={item.product.colors[0].image}
                              alt={item.product.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                              style={{ filter: 'saturate(0.85)' }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[#6F6A5F] text-[9px] tracking-[0.2em] uppercase mb-0.5">{item.product.category}</p>
                            <p className="text-[#1A1A1A] font-light text-sm tracking-wide">{item.product.name}</p>
                            <p className="text-[#6F6A5F] text-[10px] mt-0.5">
                              Tamanho {item.size}{item.variant === 'com-logo' ? ' · Com Logo' : item.variant === 'sem-logo' ? ' · Sem Logo' : ''}
                            </p>
                            <div className="flex items-baseline gap-2 mt-2">
                              {item.promoLabel && (
                                <span className="text-[#C2A27C] text-[8px] tracking-[0.1em] uppercase font-medium">{item.promoLabel}</span>
                              )}
                              {item.promoPrice && (
                                <span className="text-[#6F6A5F] text-[10px] line-through">
                                  R$ {item.product.pixPrice.toFixed(2).replace('.', ',')}
                                </span>
                              )}
                              <span className="text-[#1A1A1A] font-light text-sm">
                                R$ {price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-3 border-b border-[#E6DFD2] pb-1">
                                <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1, item.variant)}
                                  className="text-[#6F6A5F] hover:text-[#1A1A1A] transition-colors">
                                  <Minus className="w-3 h-3" strokeWidth={1.3} />
                                </button>
                                <span className="text-[#1A1A1A] text-xs font-light w-3 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1, item.variant)}
                                  className="text-[#6F6A5F] hover:text-[#1A1A1A] transition-colors">
                                  <Plus className="w-3 h-3" strokeWidth={1.3} />
                                </button>
                              </div>
                              <button onClick={() => removeItem(item.product.id, item.size, item.variant)}
                                className="text-[#E6DFD2] hover:text-[#6F6A5F] transition-colors">
                                <Trash2 className="w-3.5 h-3.5" strokeWidth={1.3} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* ─── Bundle Upsell Section ─── */}
              {items.length > 0 && bundles.length > 0 && (
                <div className="px-8 pb-6">
                  <div className="border-t border-[#E6DFD2] pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-[#C2A27C]" strokeWidth={1.5} />
                      <span className="text-[#C2A27C] text-[9px] tracking-[0.3em] uppercase font-medium">
                        Ofertas Exclusivas
                      </span>
                    </div>

                    {/* Piece bundles — 50% off */}
                    {pieceBundles.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[#6F6A5F] text-[10px] font-light mb-3 leading-relaxed">
                          Adicione mais uma peça com <span className="text-[#C2A27C] font-medium">50% OFF</span>
                        </p>
                        <div className="space-y-2.5">
                          {pieceBundles.map(b => (
                            <BundleCard
                              key={b.product.id}
                              product={b.product}
                              promoPrice={b.promoPrice}
                              discount={b.discount}
                              onAdd={(size) => addItem(b.product, size, undefined, b.promoPrice, '-50%')}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Set bundles — 80% off */}
                    {setBundles.length > 0 && (
                      <div>
                        <p className="text-[#6F6A5F] text-[10px] font-light mb-3 leading-relaxed">
                          Leve o segundo conjunto com <span className="text-[#C2A27C] font-medium">80% OFF</span>
                        </p>
                        <div className="space-y-2.5">
                          {setBundles.map(b => (
                            <BundleCard
                              key={b.product.id}
                              product={b.product}
                              promoPrice={b.promoPrice}
                              discount={b.discount}
                              onAdd={(size) => addItem(b.product, size, undefined, b.promoPrice, '-80%')}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-7 border-t border-[#E6DFD2] space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[#6F6A5F] text-[9px] tracking-[0.25em] uppercase">Total · Pix</span>
                  <span className="text-[#1A1A1A] font-light text-xl">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-[#6F6A5F] text-[9px] tracking-wide">
                  ou 12x · Compra segura · Devoluções grátis
                </p>
                <button
                  onClick={() => {
                    const msg = items.map(i => {
                      const price = i.promoPrice ?? i.product.pixPrice;
                      return `• ${i.product.name} — Tam. ${i.size}${i.variant === 'com-logo' ? ' (Com Logo)' : i.variant === 'sem-logo' ? ' (Sem Logo)' : ''}${i.promoLabel ? ` (${i.promoLabel})` : ''} — ${i.quantity}x R$ ${price.toFixed(2).replace('.', ',')}`;
                    }).join('\n');
                    const text = encodeURIComponent(`Olá! Gostaria de finalizar meu pedido:\n\n${msg}\n\nTotal Pix: R$ ${total.toFixed(2).replace('.', ',')}`);
                    window.open(`https://wa.me/5511999999999?text=${text}`, '_blank');
                  }}
                  className="w-full bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8] py-4 text-[9px] tracking-[0.35em] uppercase font-medium transition-colors"
                >
                  Finalizar Pedido
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
