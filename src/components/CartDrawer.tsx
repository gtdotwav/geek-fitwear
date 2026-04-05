'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const FREE_SHIPPING = 299.9;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING - total);
  const progress = Math.min(100, (total / FREE_SHIPPING) * 100);

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
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-[#F5F1E8] border-l border-[#E6DFD2] z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#E6DFD2]">
              <div className="flex items-center gap-3">
                <span className="font-serif font-light text-[#1A1A1A] text-lg italic">Sua Sacola</span>
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

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
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
                  {items.map(item => (
                    <motion.div
                      key={`${item.product.id}-${item.size}-${item.variant ?? ''}`}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      className="flex gap-5"
                    >
                      <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-[#E6DFD2]">
                        <img
                          src={item.product.colors[0].image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          style={{ filter: 'saturate(0.85)' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#6F6A5F] text-[9px] tracking-[0.2em] uppercase mb-0.5">{item.product.category}</p>
                        <p className="text-[#1A1A1A] font-light text-sm tracking-wide">{item.product.name}</p>
                        <p className="text-[#6F6A5F] text-[10px] mt-0.5">
                          Tamanho {item.size}{item.variant === 'com-logo' ? ' · Com Logo' : item.variant === 'sem-logo' ? ' · Sem Logo' : ''}
                        </p>
                        <p className="text-[#1A1A1A] font-light text-sm mt-2">
                          R$ {item.product.pixPrice.toFixed(2).replace('.', ',')}
                        </p>
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
                  ))}
                </AnimatePresence>
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
                  ou {items[0]?.product.installments.count}x · Compra segura · Devoluções grátis
                </p>
                <button
                  onClick={() => console.log('Integração do Gateway aqui')}
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
