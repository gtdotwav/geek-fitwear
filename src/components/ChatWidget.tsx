'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minus, Plus, Trash2, ShoppingBag, Loader2, ExternalLink, Check, Copy, Tag, MapPin, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { products, Product } from '@/data/products';

/* ─── Types ─── */
interface ChatCartItem {
  product: Product;
  size: string;
  quantity: number;
  promoPrice?: number;
  promoLabel?: string;
}

interface ProductSuggestion {
  id: string;
  name: string;
  price: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  products?: ProductSuggestion[];
}

interface PixData {
  pixCode: string;
  pixQrCode: string;
  sessionId: string;
  checkoutUrl: string;
}

/* ─── Markdown renderer ─── */
function ChatText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ─── Constants ─── */
const GREETING = 'Oi! Sou a Sofia, sua personal stylist GreekFit.\nPosso te ajudar a escolher a peça perfeita — e você compra tudo aqui, sem sair do chat.\n\nO que procura hoje?';


/* ─── Component ─── */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Cart state (local to chat)
  const [cartItems, setCartItems] = useState<ChatCartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Checkout state
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'form' | 'address' | 'loading' | 'pix' | 'success'>('idle');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerDocument, setCustomerDocument] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixCopied, setPixCopied] = useState(false);

  // Address state
  const [addrCep, setAddrCep] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrNumber, setAddrNumber] = useState('');
  const [addrComplement, setAddrComplement] = useState('');
  const [addrNeighborhood, setAddrNeighborhood] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  // Size selector per product card
  const [sizeSelecting, setSizeSelecting] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Bundle size selectors
  const [bundleSizeSelecting, setBundleSizeSelecting] = useState<string | null>(null);

  // Computed
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.promoPrice ?? i.product.pixPrice) * i.quantity, 0);
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Bundle upsell logic
  const bundles = useMemo(() => {
    const cartIds = new Set(cartItems.map(i => i.product.id));
    const hasPiece = cartItems.some(i => ['Top', 'Shorts', 'Legging'].includes(i.product.category));
    const hasSet = cartItems.some(i => i.product.category === 'Set');

    const offers: { product: Product; promoPrice: number; discount: number; label: string }[] = [];

    if (hasPiece) {
      products
        .filter(p => ['Top', 'Shorts', 'Legging'].includes(p.category) && !cartIds.has(p.id))
        .slice(0, 3)
        .forEach(p => offers.push({
          product: p,
          promoPrice: Math.round(p.pixPrice * 0.5 * 100) / 100,
          discount: 50,
          label: '-50%',
        }));
    }

    if (hasSet) {
      products
        .filter(p => p.category === 'Set' && !cartIds.has(p.id))
        .slice(0, 2)
        .forEach(p => offers.push({
          product: p,
          promoPrice: Math.round(p.pixPrice * 0.2 * 100) / 100,
          discount: 80,
          label: '-80%',
        }));
    }

    return offers;
  }, [cartItems]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showCart, checkoutStep, sizeSelecting, addrCep]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Unread bubble
  useEffect(() => {
    const t = setTimeout(() => { if (!isOpen) setHasUnread(true); }, 8000);
    return () => clearTimeout(t);
  }, [isOpen]);

  /* ─── Chat ─── */
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user' as const, content: text }],
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        products: data.products || undefined,
      }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ops, tive um probleminha. Pode tentar de novo?' }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  /* ─── Cart actions ─── */
  const addToCart = (product: Product, size: string) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size);
      if (existing) {
        return prev.map(i => i.product.id === product.id && i.size === size ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, size, quantity: 1 }];
    });
    setSizeSelecting(null);
    setShowCart(true);
    // Add a confirmation message
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Adicionei o ${product.name} (tam. ${size}) na sua sacola. Quer adicionar mais alguma peça ou finalizar?`,
    }]);
  };

  const addBundleToCart = (product: Product, size: string, promoPrice: number, label: string) => {
    setCartItems(prev => [...prev, { product, size, quantity: 1, promoPrice, promoLabel: label }]);
    setBundleSizeSelecting(null);
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Ótima escolha! Adicionei o ${product.name} (tam. ${size}) com desconto especial. Quer mais alguma coisa?`,
    }]);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCartItems(prev => prev.filter(i => !(i.product.id === productId && i.size === size)));
  };

  const updateQty = (productId: string, size: string, delta: number) => {
    setCartItems(prev => prev.map(i => {
      if (i.product.id === productId && i.size === size) {
        const newQty = i.quantity + delta;
        return newQty <= 0 ? i : { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  /* ─── Checkout ─── */
  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length <= 2) return d;
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
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

  const validateForm = () => {
    if (!customerName.trim() || !customerEmail.trim() || customerPhone.replace(/\D/g, '').length < 10 || customerDocument.replace(/\D/g, '').length !== 11) {
      setCheckoutError('Preencha todos os campos corretamente (incluindo CPF).');
      return false;
    }
    return true;
  };

  const validateAddress = () => {
    if (!addrCep.replace(/\D/g, '') || !addrStreet.trim() || !addrNumber.trim() || !addrNeighborhood.trim() || !addrCity.trim() || !addrState.trim()) {
      setCheckoutError('Preencha o endereço completo.');
      return false;
    }
    return true;
  };

  const handleCheckout = useCallback(async () => {
    if (!validateAddress()) return;
    setCheckoutError('');
    setCheckoutStep('loading');

    try {
      // 1. Create session
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(i => ({
            name: i.product.name,
            size: i.size,
            quantity: i.quantity,
            price: i.promoPrice ?? i.product.pixPrice,
          })),
          customer: {
            name: customerName.trim(),
            email: customerEmail.trim(),
            phone: customerPhone.replace(/\D/g, ''),
            document: customerDocument.replace(/\D/g, ''),
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
        }),
      });
      const session = await res.json();

      if (!res.ok || !session.sessionId) {
        setCheckoutError(session.error || 'Erro ao criar pagamento.');
        setCheckoutStep('address');
        return;
      }

      // PIX is generated server-side now
      setPixData({
        pixCode: session.pixCode || '',
        pixQrCode: session.pixQrCode || '',
        sessionId: session.sessionId,
        checkoutUrl: session.checkoutUrl,
      });
      setCheckoutStep('pix');
      setShowCart(false);

      if (session.pixCode) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Seu PIX de R$ ${cartTotal.toFixed(2).replace('.', ',')} foi gerado! Copie o código ou escaneie o QR Code abaixo para pagar.`,
        }]);
        pollPayment(session.sessionId);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Seu pedido de R$ ${cartTotal.toFixed(2).replace('.', ',')} foi criado! Finalize o pagamento no link abaixo.`,
        }]);
      }
    } catch {
      setCheckoutError('Erro de conexão. Tente novamente.');
      setCheckoutStep('form');
    }
  }, [cartItems, customerName, customerEmail, customerPhone, addrCep, addrStreet, addrNumber, addrComplement, addrNeighborhood, addrCity, addrState]);

  const pollPayment = (sessionId: string) => {
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > 120) { clearInterval(interval); return; }
      try {
        const res = await fetch(`/api/checkout/status?id=${sessionId}`);
        const data = await res.json();
        if (data.status === 'paid') {
          clearInterval(interval);
          setCheckoutStep('success');
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Pagamento confirmado! Seu pedido foi aprovado. Você vai receber tudo certinho no email. Obrigada por escolher a GreekFit.',
          }]);
        }
      } catch { /* ignore */ }
    }, 5000);
  };

  const copyPix = () => {
    if (!pixData?.pixCode) return;
    navigator.clipboard.writeText(pixData.pixCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2500);
  };

  return (
    <>
      {/* ─── Chat Button ─── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 2, duration: 0.4 }}
            onClick={() => { setIsOpen(true); setHasUnread(false); }}
            className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8] rounded-full flex items-center justify-center shadow-lg transition-colors"
            aria-label="Chat com a GreekFit"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
            {(hasUnread || cartCount > 0) && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C2A27C] rounded-full flex items-center justify-center">
                <span className="text-[8px] text-white font-medium">{cartCount || 1}</span>
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Chat Window ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-5 sm:right-5 z-50 sm:w-[400px] sm:h-[600px] sm:max-h-[calc(100vh-80px)] bg-[#F5F1E8] sm:border sm:border-[#E6DFD2] sm:rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-[#1A1A1A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#C2A27C] rounded-full flex items-center justify-center">
                  <span className="text-[#1A1A1A] text-[10px] font-medium">GF</span>
                </div>
                <div>
                  <p className="text-[#F5F1E8] text-xs font-medium tracking-wide">Sofia · GreekFit</p>
                  <p className="text-[#C2A27C] text-[8px] tracking-[0.2em] uppercase">Personal Stylist</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {cartCount > 0 && (
                  <button
                    onClick={() => setShowCart(!showCart)}
                    className="relative text-[#F5F1E8]/60 hover:text-[#F5F1E8] transition-colors p-1"
                  >
                    <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#C2A27C] rounded-full flex items-center justify-center">
                      <span className="text-[7px] text-white font-bold">{cartCount}</span>
                    </span>
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="text-[#F5F1E8]/60 hover:text-[#F5F1E8] transition-colors p-1">
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Messages + Cart scroll area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-3 sm:py-4 space-y-3 sm:space-y-4">

              {/* Messages */}
              {messages.map((msg, i) => (
                <div key={i}>
                  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-[1.6] whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#1A1A1A] text-[#F5F1E8] rounded-2xl rounded-br-sm'
                        : 'bg-[#E6DFD2] text-[#1A1A1A] rounded-2xl rounded-bl-sm'
                    }`}>
                      <ChatText text={msg.content} />
                    </div>
                  </div>

                  {/* Product Cards with size selector */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.products.map(p => {
                        const full = products.find(pr => pr.id === p.id);
                        if (!full) return null;
                        const isSelecting = sizeSelecting === p.id;

                        return (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/60 border border-[#E6DFD2] rounded-sm overflow-hidden"
                          >
                            <div className="flex items-center gap-3 p-3">
                              <div className="w-12 h-14 flex-shrink-0 overflow-hidden bg-[#E6DFD2] relative rounded-sm">
                                <Image src={full.colors[0].image} alt={p.name} fill sizes="48px" className="object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[#1A1A1A] text-[11px] font-medium tracking-wide truncate">{p.name}</p>
                                <p className="text-[#A88F6A] text-[12px] font-medium mt-0.5">
                                  R$ {p.price.toFixed(2).replace('.', ',')}
                                </p>
                              </div>
                              <button
                                onClick={() => setSizeSelecting(isSelecting ? null : p.id)}
                                className="flex-shrink-0 bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8] px-3 py-1.5 text-[8px] tracking-[0.15em] uppercase font-medium transition-colors"
                              >
                                {isSelecting ? 'Fechar' : 'Comprar'}
                              </button>
                            </div>

                            {/* Size selector */}
                            <AnimatePresence>
                              {isSelecting && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-3 pb-3 pt-1">
                                    <p className="text-[#6F6A5F] text-[8px] tracking-[0.2em] uppercase mb-2">Tamanho</p>
                                    <div className="flex gap-1.5">
                                      {full.sizes.map(s => (
                                        <button
                                          key={s}
                                          onClick={() => addToCart(full, s)}
                                          className="w-8 h-8 text-[9px] font-medium border border-[#E6DFD2] text-[#6F6A5F] hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#F5F1E8] transition-all"
                                        >
                                          {s}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#E6DFD2] px-4 py-3 rounded-t-lg rounded-br-lg flex items-center gap-1.5">
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 bg-[#6F6A5F] rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#6F6A5F] rounded-full" />
                    <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#6F6A5F] rounded-full" />
                  </div>
                </div>
              )}

              {/* ─── Inline Cart Summary ─── */}
              {showCart && cartItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 border border-[#C2A27C]/30 rounded-sm overflow-hidden"
                >
                  <div className="px-4 py-3 bg-[#1A1A1A] flex items-center justify-between">
                    <span className="text-[#F5F1E8] text-[10px] tracking-[0.2em] uppercase font-medium">Sua Sacola ({cartCount})</span>
                    <button onClick={() => setShowCart(false)} className="text-[#F5F1E8]/50 hover:text-[#F5F1E8]">
                      <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="divide-y divide-[#E6DFD2]">
                    {cartItems.map(item => (
                      <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3 px-4 py-3">
                        <div className="w-10 h-12 flex-shrink-0 overflow-hidden bg-[#E6DFD2] relative rounded-sm">
                          <Image src={item.product.colors[0].image} alt={item.product.name} fill sizes="40px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1A1A1A] text-[10px] font-medium truncate">{item.product.name}</p>
                          <p className="text-[#6F6A5F] text-[9px]">Tam. {item.size}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQty(item.product.id, item.size, -1)} className="text-[#6F6A5F] hover:text-[#1A1A1A]">
                            <Minus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                          <span className="text-[#1A1A1A] text-[11px] w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQty(item.product.id, item.size, 1)} className="text-[#6F6A5F] hover:text-[#1A1A1A]">
                            <Plus className="w-3 h-3" strokeWidth={1.5} />
                          </button>
                        </div>
                        <div className="text-right w-20">
                          {item.promoLabel && (
                            <span className="text-[#C2A27C] text-[7px] tracking-wider uppercase font-medium block">{item.promoLabel}</span>
                          )}
                          {item.promoPrice && (
                            <span className="text-[#6F6A5F] text-[8px] line-through block">
                              R$ {(item.product.pixPrice * item.quantity).toFixed(2).replace('.', ',')}
                            </span>
                          )}
                          <span className="text-[#1A1A1A] text-[11px] font-medium">
                            R$ {((item.promoPrice ?? item.product.pixPrice) * item.quantity).toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                        <button onClick={() => removeFromCart(item.product.id, item.size)} className="text-[#E6DFD2] hover:text-[#6F6A5F]">
                          <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ─── Bundle Upsell ─── */}
                  {bundles.length > 0 && checkoutStep === 'idle' && (
                    <div className="px-4 py-3 border-t border-[#E6DFD2]">
                      <div className="flex items-center gap-1.5 mb-3">
                        <Tag className="w-3 h-3 text-[#C2A27C]" strokeWidth={1.5} />
                        <span className="text-[#C2A27C] text-[8px] tracking-[0.25em] uppercase font-medium">
                          Ofertas exclusivas pra você
                        </span>
                      </div>

                      {bundles.some(b => b.discount === 50) && (
                        <p className="text-[#6F6A5F] text-[9px] font-light mb-2">
                          Adicione mais uma peça com <span className="text-[#C2A27C] font-medium">50% OFF</span>
                        </p>
                      )}
                      {bundles.some(b => b.discount === 80) && !bundles.some(b => b.discount === 50) && (
                        <p className="text-[#6F6A5F] text-[9px] font-light mb-2">
                          Leve o segundo conjunto com <span className="text-[#C2A27C] font-medium">80% OFF</span>
                        </p>
                      )}

                      <div className="space-y-2">
                        {bundles.map(b => {
                          const isSelecting = bundleSizeSelecting === b.product.id;
                          return (
                            <div key={b.product.id} className="bg-[#F5F1E8] border border-[#C2A27C]/20 rounded-sm overflow-hidden">
                              <div className="flex items-center gap-2.5 p-2.5">
                                <div className="w-10 h-12 flex-shrink-0 overflow-hidden bg-[#E6DFD2] relative rounded-sm">
                                  <Image src={b.product.colors[0].image} alt={b.product.name} fill sizes="40px" className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[#1A1A1A] text-[10px] font-medium truncate">{b.product.name}</p>
                                  <div className="flex items-baseline gap-1.5 mt-0.5">
                                    <span className="text-[#6F6A5F] text-[9px] line-through">
                                      R$ {b.product.pixPrice.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-[#C2A27C] text-[11px] font-medium">
                                      R$ {b.promoPrice.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-[#C2A27C] text-[7px] tracking-wider uppercase font-medium">
                                      {b.label}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setBundleSizeSelecting(isSelecting ? null : b.product.id)}
                                  className="flex-shrink-0 bg-[#C2A27C] hover:bg-[#A88F6A] text-[#1A1A1A] px-2.5 py-1.5 text-[7px] tracking-[0.15em] uppercase font-medium transition-colors"
                                >
                                  {isSelecting ? '✕' : 'Adicionar'}
                                </button>
                              </div>

                              <AnimatePresence>
                                {isSelecting && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-2.5 pb-2.5 pt-0.5">
                                      <p className="text-[#6F6A5F] text-[7px] tracking-[0.2em] uppercase mb-1.5">Tamanho</p>
                                      <div className="flex gap-1">
                                        {b.product.sizes.map(s => (
                                          <button
                                            key={s}
                                            onClick={() => addBundleToCart(b.product, s, b.promoPrice, b.label)}
                                            className="w-7 h-7 text-[8px] font-medium border border-[#E6DFD2] text-[#6F6A5F] hover:border-[#C2A27C] hover:bg-[#C2A27C] hover:text-[#1A1A1A] transition-all"
                                          >
                                            {s}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>

                      {bundles.some(b => b.discount === 50) && bundles.some(b => b.discount === 80) && (
                        <p className="text-[#6F6A5F] text-[9px] font-light mt-2">
                          Ou leve o segundo conjunto com <span className="text-[#C2A27C] font-medium">80% OFF</span>
                        </p>
                      )}
                    </div>
                  )}

                  {/* Total + Checkout CTA */}
                  <div className="px-4 py-3 bg-[#F5F1E8] border-t border-[#E6DFD2] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6F6A5F] text-[9px] tracking-[0.2em] uppercase">Total Pix</span>
                      <span className="text-[#1A1A1A] font-medium text-sm">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <p className="text-[#6F6A5F] text-[8px]">ou 12× R$ {(cartTotal / 12).toFixed(2).replace('.', ',')} sem juros</p>

                    {checkoutStep === 'idle' && (
                      <button
                        onClick={() => setCheckoutStep('form')}
                        className="w-full bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8] py-3 text-[9px] tracking-[0.3em] uppercase font-medium transition-colors"
                      >
                        Pagar Agora
                      </button>
                    )}

                    {/* ─── Step 1: Customer Data ─── */}
                    {checkoutStep === 'form' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
                        <p className="text-[#6F6A5F] text-[8px] tracking-[0.15em] uppercase">1/2 · Seus dados</p>
                        <input
                          type="text" placeholder="Nome completo" value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          className="w-full bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                        />
                        <input
                          type="email" placeholder="Email" value={customerEmail}
                          onChange={e => setCustomerEmail(e.target.value)}
                          className="w-full bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                        />
                        <input
                          type="tel" placeholder="(11) 99999-9999" value={customerPhone}
                          onChange={e => setCustomerPhone(formatPhone(e.target.value))}
                          className="w-full bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                        />
                        <input
                          type="tel" placeholder="CPF: 000.000.000-00" value={customerDocument}
                          onChange={e => setCustomerDocument(formatCpf(e.target.value))}
                          className="w-full bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                        />
                        {checkoutError && <p className="text-red-400 text-[9px]">{checkoutError}</p>}
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => { setCheckoutStep('idle'); setCheckoutError(''); }}
                            className="flex-1 border border-[#E6DFD2] text-[#6F6A5F] py-2.5 text-[8px] tracking-[0.15em] uppercase font-medium hover:border-[#A88F6A] transition-colors">
                            Voltar
                          </button>
                          <button onClick={() => {
                            if (validateForm()) { setCheckoutError(''); setCheckoutStep('address'); }
                          }}
                            className="flex-1 bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8] py-2.5 text-[8px] tracking-[0.15em] uppercase font-medium transition-colors flex items-center justify-center gap-1">
                            Continuar <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── Step 2: Delivery Address ─── */}
                    {checkoutStep === 'address' && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#C2A27C]" />
                          <p className="text-[#6F6A5F] text-[8px] tracking-[0.15em] uppercase">2/2 · Endereço de entrega</p>
                        </div>
                        <div className="relative">
                          <input
                            type="text" placeholder="CEP" value={addrCep}
                            onChange={e => {
                              const formatted = formatCep(e.target.value);
                              setAddrCep(formatted);
                              if (formatted.replace(/\D/g, '').length === 8) lookupCep(formatted);
                            }}
                            className="w-full bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                          />
                          {cepLoading && <Loader2 className="absolute right-0 top-1.5 w-3 h-3 text-[#C2A27C] animate-spin" />}
                        </div>
                        <input
                          type="text" placeholder="Rua / Avenida" value={addrStreet}
                          onChange={e => setAddrStreet(e.target.value)}
                          className="w-full bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text" placeholder="Número" value={addrNumber}
                            onChange={e => setAddrNumber(e.target.value)}
                            className="w-1/3 bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                          />
                          <input
                            type="text" placeholder="Complemento" value={addrComplement}
                            onChange={e => setAddrComplement(e.target.value)}
                            className="flex-1 bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                          />
                        </div>
                        <input
                          type="text" placeholder="Bairro" value={addrNeighborhood}
                          onChange={e => setAddrNeighborhood(e.target.value)}
                          className="w-full bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text" placeholder="Cidade" value={addrCity}
                            onChange={e => setAddrCity(e.target.value)}
                            className="flex-1 bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors"
                          />
                          <input
                            type="text" placeholder="UF" value={addrState} maxLength={2}
                            onChange={e => setAddrState(e.target.value.toUpperCase())}
                            className="w-14 bg-transparent border-b border-[#E6DFD2] focus:border-[#A88F6A] py-2 sm:py-1.5 text-[#1A1A1A] text-base sm:text-[11px] font-light placeholder-[#C2A27C]/40 focus:outline-none transition-colors text-center"
                          />
                        </div>
                        {checkoutError && <p className="text-red-400 text-[9px]">{checkoutError}</p>}
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => { setCheckoutStep('form'); setCheckoutError(''); }}
                            className="flex-1 border border-[#E6DFD2] text-[#6F6A5F] py-2.5 text-[8px] tracking-[0.15em] uppercase font-medium hover:border-[#A88F6A] transition-colors">
                            Voltar
                          </button>
                          <button onClick={handleCheckout}
                            className="flex-1 bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8] py-2.5 text-[8px] tracking-[0.15em] uppercase font-medium transition-colors">
                            Gerar PIX
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* ─── Loading ─── */}
                    {checkoutStep === 'loading' && (
                      <div className="flex flex-col items-center py-4 gap-2">
                        <Loader2 className="w-5 h-5 text-[#C2A27C] animate-spin" />
                        <p className="text-[#6F6A5F] text-[9px] tracking-wide">Gerando seu PIX...</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ─── PIX Inline Display ─── */}
              {checkoutStep === 'pix' && pixData && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 border border-[#C2A27C]/30 rounded-sm overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    {/* QR Code — always show (API image or fallback) */}
                    <div className="text-center">
                      <p className="text-[#1A1A1A] text-[11px] font-medium tracking-wide mb-3">Escaneie o QR Code para pagar</p>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          pixData.pixQrCode ||
                          (pixData.pixCode
                            ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData.pixCode)}`
                            : '')
                        }
                        alt="QR Code PIX"
                        className="w-36 h-36 sm:w-40 sm:h-40 mx-auto border border-[#E6DFD2] p-2 bg-white"
                      />
                    </div>

                    {/* Copy button */}
                    {pixData.pixCode && (
                      <>
                        <button
                          onClick={copyPix}
                          className={`w-full flex items-center justify-center gap-2 py-3 text-[9px] tracking-[0.2em] uppercase font-medium transition-colors ${
                            pixCopied
                              ? 'bg-[#A88F6A] text-[#F5F1E8]'
                              : 'bg-[#1A1A1A] hover:bg-[#2B2B2B] text-[#F5F1E8]'
                          }`}
                        >
                          {pixCopied ? <><Check className="w-3.5 h-3.5" /> Código copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar código PIX</>}
                        </button>
                        <div className="bg-[#E6DFD2]/40 px-3 py-2 text-[8px] text-[#6F6A5F] font-mono break-all rounded-sm leading-relaxed max-h-14 overflow-y-auto">
                          {pixData.pixCode}
                        </div>
                      </>
                    )}

                    {/* Waiting indicator */}
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Loader2 className="w-3 h-3 text-[#C2A27C] animate-spin" />
                      <p className="text-[#6F6A5F] text-[9px] tracking-wide">Aguardando pagamento...</p>
                    </div>

                    {/* External checkout — secondary */}
                    {pixData.checkoutUrl && (
                      <a
                        href={pixData.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full text-[#6F6A5F]/50 py-1 text-[7px] tracking-[0.1em] uppercase hover:text-[#6F6A5F] transition-colors"
                      >
                        <ExternalLink className="w-2.5 h-2.5" /> checkout externo
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ─── Success ─── */}
              {checkoutStep === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/80 border border-[#C2A27C]/30 rounded-sm p-5 text-center space-y-2"
                >
                  <div className="w-12 h-12 bg-[#A88F6A] rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 text-[#F5F1E8]" strokeWidth={2} />
                  </div>
                  <p className="text-[#1A1A1A] text-sm font-medium">Pagamento Confirmado!</p>
                  <p className="text-[#6F6A5F] text-[10px]">Confira seu email para detalhes do pedido.</p>
                </motion.div>
              )}
            </div>

            {/* Quick Suggestions */}
            {messages.length === 1 && (
              <div className="shrink-0 px-4 sm:px-5 pb-2 sm:pb-3 flex flex-wrap gap-1.5 sm:gap-2">
                {['Quero um conjunto', 'Qual a mais vendida?', 'Me ajuda a escolher'].map(q => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-[10px] tracking-wide text-[#6F6A5F] border border-[#E6DFD2] px-3 py-1.5 hover:border-[#C2A27C] hover:text-[#C2A27C] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Cart mini-bar (when cart is closed but has items) */}
            {!showCart && cartCount > 0 && checkoutStep !== 'pix' && checkoutStep !== 'success' && (
              <div className="shrink-0 px-4 py-2 bg-[#1A1A1A] flex items-center justify-between">
                <span className="text-[#F5F1E8]/70 text-[9px]">{cartCount} {cartCount === 1 ? 'item' : 'itens'} · R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                <button
                  onClick={() => setShowCart(true)}
                  className="text-[#C2A27C] text-[9px] tracking-[0.15em] uppercase font-medium hover:text-[#F5F1E8] transition-colors"
                >
                  Ver sacola
                </button>
              </div>
            )}

            {/* Input */}
            <div className="shrink-0 px-4 py-2.5 sm:py-3 border-t border-[#E6DFD2] bg-white/40">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Digite sua mensagem..."
                  enterKeyHint="send"
                  autoComplete="off"
                  className="flex-1 bg-transparent text-[#1A1A1A] text-base sm:text-[13px] font-light placeholder-[#6F6A5F]/50 focus:outline-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 sm:w-8 sm:h-8 bg-[#1A1A1A] hover:bg-[#2B2B2B] disabled:opacity-30 text-[#F5F1E8] rounded-full flex items-center justify-center transition-all"
                >
                  <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
