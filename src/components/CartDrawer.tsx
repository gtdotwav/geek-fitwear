'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, Tag, Loader2, MapPin, ChevronRight, Copy, Check, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useCart, CartItem } from '@/context/CartContext';
import { products, Product } from '@/data/products';

const FREE_SHIPPING = 100;
const PIECE_PROMO = 0.5;   // 50% off on extra piece
const SET_PROMO = 0.8;     // 80% off on second set

function BundleCard({ product, promoPrice, discount, onAdd }: {
  product: Product;
  promoPrice: number;
  discount: number;
  onAdd: (size: string) => void;
}) {
  const [size, setSize] = useState(product.sizes[0] || 'M');

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
                              {item.promoPrice ? (
                                <span className="text-[#6F6A5F] text-[10px] line-through">
                                  R$ {item.product.pixPrice.toFixed(2).replace('.', ',')}
                                </span>
                              ) : item.product.originalPrice > item.product.pixPrice ? (
                                <span className="text-[#6F6A5F] text-[10px] line-through">
                                  R$ {item.product.originalPrice.toFixed(2).replace('.', ',')}
                                </span>
                              ) : null}
                              <span className="text-[#1A1A1A] font-light text-sm">
                                R$ {price.toFixed(2).replace('.', ',')}
                              </span>
                              {!item.promoLabel && item.product.originalPrice > item.product.pixPrice && (
                                <span className="text-[#C2A27C] text-[8px] tracking-[0.1em] uppercase font-medium">PIX</span>
                              )}
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
                      <Tag className="w-3.5 h-3.5 text-[#C2A27C]" strokeWidth={1.5} />
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
              <CartFooter items={items} total={total} />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Cart Footer with Checkout ─── */

interface PixResult {
  pixCode: string;
  pixQrCode: string;
  checkoutUrl: string;
  amount: number;
}

function CartFooter({ items, total }: { items: CartItem[]; total: number }) {
  const [step, setStep] = useState<'cart' | 'form' | 'address' | 'pix'>('cart');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pixResult, setPixResult] = useState<PixResult | null>(null);
  const [pixCopied, setPixCopied] = useState(false);

  // Address
  const [addrCep, setAddrCep] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrNumber, setAddrNumber] = useState('');
  const [addrComplement, setAddrComplement] = useState('');
  const [addrNeighborhood, setAddrNeighborhood] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };

  const formatCpf = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  };

  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  };

  const lookupCep = useCallback(async (cep: string) => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setAddrStreet(data.logradouro || '');
        setAddrNeighborhood(data.bairro || '');
        setAddrCity(data.localidade || '');
        setAddrState(data.uf || '');
      }
    } catch { /* ignore */ }
    setCepLoading(false);
  }, []);

  const buildBody = useCallback(() => ({
    items: items.map(i => ({
      name: i.product.name,
      size: i.size,
      variant: i.variant,
      quantity: i.quantity,
      price: i.promoPrice ?? i.product.pixPrice,
    })),
    customer: {
      name: name.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ''),
      document: document.replace(/\D/g, ''),
    },
    address: {
      cep: addrCep.replace(/\D/g, ''),
      street: addrStreet.trim(),
      number: addrNumber.trim(),
      complement: addrComplement.trim() || undefined,
      neighborhood: addrNeighborhood.trim(),
      city: addrCity.trim(),
      state: addrState.trim(),
    },
  }), [items, name, email, phone, document, addrCep, addrStreet, addrNumber, addrComplement, addrNeighborhood, addrCity, addrState]);

  const handleCheckout = useCallback(async () => {
    if (!addrCep.replace(/\D/g, '') || !addrStreet.trim() || !addrNumber.trim() || !addrNeighborhood.trim() || !addrCity.trim() || !addrState.trim()) {
      setError('Preencha o endereço completo.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildBody()),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao criar pagamento.');
        return;
      }

      setPixResult({
        pixCode: data.pixCode || '',
        pixQrCode: data.pixQrCode || '',
        checkoutUrl: data.checkoutUrl || '',
        amount: data.amount || total,
      });
      setStep('pix');
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [buildBody, addrCep, addrStreet, addrNumber, addrNeighborhood, addrCity, addrState, total]);

  const handleCopyPix = useCallback(() => {
    if (!pixResult?.pixCode) return;
    navigator.clipboard.writeText(pixResult.pixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  }, [pixResult]);

  const inputCls = "w-full bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] px-0 py-2 text-[#1A1A1A] text-xs font-light placeholder-[#C2A27C]/50 focus:outline-none transition-colors";

  return (
    <div className="px-8 py-7 border-t border-[#E6DFD2] space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[#6F6A5F] text-[9px] tracking-[0.25em] uppercase">Total · Pix</span>
        <span className="text-[#1A1A1A] font-light text-xl">
          R$ {total.toFixed(2).replace('.', ',')}
        </span>
      </div>
      <p className="text-[#6F6A5F] text-[9px] tracking-wide">
        ou 12× R$ {(total / 12).toFixed(2).replace('.', ',')} sem juros · Compra segura · Devoluções grátis
      </p>

      <AnimatePresence mode="wait">
        {step === 'cart' && (
          <motion.button
            key="cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStep('form')}
            className="w-full bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8] py-4 text-[9px] tracking-[0.35em] uppercase font-medium transition-colors"
          >
            Finalizar Pedido
          </motion.button>
        )}

        {step === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <p className="text-[#6F6A5F] text-[9px] tracking-[0.2em] uppercase">1/2 · Seus dados</p>
            <input type="text" placeholder="Nome completo" value={name} onChange={e => setName(e.target.value)} className={inputCls} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
            <input type="text" inputMode="numeric" placeholder="CPF" value={document} onChange={e => setDocument(formatCpf(e.target.value))} className={inputCls} />
            <input type="tel" placeholder="(11) 99999-9999" value={phone} onChange={e => setPhone(formatPhone(e.target.value))} className={inputCls} />

            {error && <p className="text-red-400 text-[10px] font-light">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button onClick={() => { setStep('cart'); setError(''); }}
                className="flex-1 border border-[#E6DFD2] text-[#6F6A5F] py-3.5 text-[9px] tracking-[0.2em] uppercase font-medium hover:border-[#A88F6A] transition-colors">
                Voltar
              </button>
              <button onClick={() => {
                if (!name.trim() || !email.trim() || phone.replace(/\D/g, '').length < 10 || document.replace(/\D/g, '').length !== 11) {
                  setError('Preencha todos os campos corretamente.');
                  return;
                }
                setError('');
                setStep('address');
              }}
                className="flex-1 bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8] py-3.5 text-[9px] tracking-[0.2em] uppercase font-medium transition-colors flex items-center justify-center gap-1">
                Continuar <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'address' && (
          <motion.div
            key="address"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C2A27C]" />
              <p className="text-[#6F6A5F] text-[9px] tracking-[0.2em] uppercase">2/2 · Endereço de entrega</p>
            </div>
            <div className="relative">
              <input type="text" placeholder="CEP" value={addrCep}
                onChange={e => {
                  const formatted = formatCep(e.target.value);
                  setAddrCep(formatted);
                  if (formatted.replace(/\D/g, '').length === 8) lookupCep(formatted);
                }}
                className={inputCls} />
              {cepLoading && <Loader2 className="absolute right-0 top-2 w-3.5 h-3.5 text-[#C2A27C] animate-spin" />}
            </div>
            <input type="text" placeholder="Rua / Avenida" value={addrStreet} onChange={e => setAddrStreet(e.target.value)} className={inputCls} />
            <div className="flex gap-3">
              <input type="text" placeholder="Número" value={addrNumber} onChange={e => setAddrNumber(e.target.value)} className={`w-1/3 ${inputCls.replace('w-full ', '')}`} />
              <input type="text" placeholder="Complemento" value={addrComplement} onChange={e => setAddrComplement(e.target.value)} className={`flex-1 ${inputCls.replace('w-full ', '')}`} />
            </div>
            <input type="text" placeholder="Bairro" value={addrNeighborhood} onChange={e => setAddrNeighborhood(e.target.value)} className={inputCls} />
            <div className="flex gap-3">
              <input type="text" placeholder="Cidade" value={addrCity} onChange={e => setAddrCity(e.target.value)} className={`flex-1 ${inputCls.replace('w-full ', '')}`} />
              <input type="text" placeholder="UF" value={addrState} maxLength={2} onChange={e => setAddrState(e.target.value.toUpperCase())} className={`w-14 text-center ${inputCls.replace('w-full ', '')}`} />
            </div>

            {error && <p className="text-red-400 text-[10px] font-light">{error}</p>}

            <div className="flex gap-2 pt-1">
              <button onClick={() => { setStep('form'); setError(''); }}
                className="flex-1 border border-[#E6DFD2] text-[#6F6A5F] py-3.5 text-[9px] tracking-[0.2em] uppercase font-medium hover:border-[#A88F6A] transition-colors">
                Voltar
              </button>
              <button onClick={handleCheckout} disabled={loading}
                className="flex-1 bg-[#1A1A1A] hover:bg-[#2B2B2B] disabled:opacity-50 text-[#F5F1E8] py-3.5 text-[9px] tracking-[0.2em] uppercase font-medium transition-colors flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Aguarde...</> : 'Pagar com PIX'}
              </button>
            </div>
          </motion.div>
        )}

        {step === 'pix' && pixResult && (
          <motion.div
            key="pix"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="text-center">
              <p className="text-[#A88F6A] text-[9px] tracking-[0.3em] uppercase font-medium mb-1">Pagamento PIX</p>
              <p className="text-[#1A1A1A] font-light text-xl">
                R$ {pixResult.amount.toFixed(2).replace('.', ',')}
              </p>
            </div>

            {/* QR Code — always show (API image or fallback) */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-[#6F6A5F] text-[10px] font-light">Escaneie o QR Code para pagar</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  pixResult.pixQrCode ||
                  (pixResult.pixCode
                    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixResult.pixCode)}`
                    : '')
                }
                alt="QR Code PIX"
                className="w-40 h-40 sm:w-44 sm:h-44 mx-auto border border-[#E6DFD2] p-2 bg-white"
              />
              <div className="flex items-center gap-2 pt-1">
                <Loader2 className="w-3 h-3 text-[#C2A27C] animate-spin" />
                <p className="text-[#6F6A5F] text-[9px] tracking-wide">Aguardando pagamento...</p>
              </div>
            </div>

            {/* PIX code + copy */}
            {pixResult.pixCode && (
              <div className="space-y-2">
                <p className="text-[#6F6A5F] text-[8px] tracking-[0.15em] uppercase text-center">Ou copie o código</p>
                <div className="bg-[#E6DFD2]/50 p-3 rounded-sm max-h-16 overflow-y-auto">
                  <p className="text-[#1A1A1A] text-[9px] font-mono break-all leading-relaxed select-all">{pixResult.pixCode}</p>
                </div>
                <button
                  onClick={handleCopyPix}
                  className={`w-full py-3.5 text-[9px] tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 transition-all ${
                    pixCopied
                      ? 'bg-[#A88F6A] text-[#F5F1E8]'
                      : 'bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8]'
                  }`}
                >
                  {pixCopied ? <><Check className="w-3.5 h-3.5" /> Código copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar código PIX</>}
                </button>
              </div>
            )}

            {/* External checkout — secondary */}
            {pixResult.checkoutUrl && (
              <button
                onClick={() => window.open(pixResult.checkoutUrl, '_blank')}
                className="w-full border border-[#E6DFD2] text-[#6F6A5F] py-2.5 text-[8px] tracking-[0.15em] uppercase font-light hover:border-[#A88F6A] transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-2.5 h-2.5" /> Pagar no checkout externo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
