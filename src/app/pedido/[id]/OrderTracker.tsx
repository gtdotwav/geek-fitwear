'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CreditCard, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface OrderData {
  id: string;
  status: string;
  customer_name: string;
  items: { product_name: string; size: string; variant?: string; quantity: number; unit_price: number }[];
  subtotal: number;
  shipping_cost: number;
  total: number;
  shipping_address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  tracking_code?: string;
  created_at: string;
  paid_at?: string;
}

const steps = [
  { key: 'pending', label: 'Pagamento pendente', icon: CreditCard },
  { key: 'paid', label: 'Pagamento confirmado', icon: CheckCircle2 },
  { key: 'shipped', label: 'Enviado', icon: Truck },
  { key: 'delivered', label: 'Entregue', icon: Package },
];

function getStepIndex(status: string) {
  const map: Record<string, number> = { pending: 0, paid: 1, shipped: 2, delivered: 3 };
  return map[status] ?? 0;
}

export default function OrderTracker({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/pedido/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setOrder(data);
        }
      })
      .catch(() => setError('Erro ao carregar pedido.'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#C2A27C] animate-spin" />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#F5F1E8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#6F6A5F] text-[9px] tracking-[0.45em] uppercase mb-4">Pedido</p>
          <h1 className="font-serif font-extralight text-[#1A1A1A] text-3xl mb-4">
            Pedido não encontrado
          </h1>
          <p className="text-[#6F6A5F] font-light text-sm mb-8">
            Verifique o link ou entre em contato conosco.
          </p>
          <Link
            href="/"
            className="text-[#A88F6A] text-[9px] tracking-[0.35em] uppercase border-b border-[#A88F6A]/40 hover:border-[#A88F6A] pb-1 transition-colors"
          >
            Voltar à loja
          </Link>
        </div>
      </main>
    );
  }

  const currentStep = getStepIndex(order.status);
  const addr = order.shipping_address;

  return (
    <main className="min-h-screen bg-[#F5F1E8] pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C2A27C] text-[9px] tracking-[0.5em] uppercase mb-4">Acompanhar Pedido</p>
          <h1 className="font-serif font-extralight text-[#1A1A1A] text-4xl mb-2">
            #{orderId.substring(0, 8).toUpperCase()}
          </h1>
          <p className="text-[#6F6A5F] font-light text-sm">
            {order.customer_name} · {new Date(order.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>

        {/* Progress */}
        <div className="mb-16">
          <div className="flex items-center justify-between relative">
            {/* Line */}
            <div className="absolute top-5 left-0 right-0 h-px bg-[#E6DFD2]" />
            <div
              className="absolute top-5 left-0 h-px bg-[#A88F6A] transition-all duration-700"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, i) => {
              const active = i <= currentStep;
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center relative z-10"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      active
                        ? 'bg-[#1A1A1A] text-[#F5F1E8]'
                        : 'bg-[#E6DFD2] text-[#6F6A5F]'
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <span
                    className={`mt-3 text-[8px] tracking-[0.2em] uppercase text-center max-w-[80px] ${
                      active ? 'text-[#1A1A1A] font-medium' : 'text-[#6F6A5F] font-light'
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tracking code */}
        {order.tracking_code && (
          <div className="bg-[#E6DFD2] p-5 mb-8 text-center">
            <p className="text-[#6F6A5F] text-[9px] tracking-[0.3em] uppercase mb-1">Código de rastreio</p>
            <p className="text-[#1A1A1A] font-light text-lg tracking-wide select-all">{order.tracking_code}</p>
          </div>
        )}

        {/* Items */}
        <div className="border-t border-[#E6DFD2] pt-8 mb-8">
          <p className="text-[#6F6A5F] text-[9px] tracking-[0.3em] uppercase mb-6">Itens do Pedido</p>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="text-[#1A1A1A] font-light text-sm">{item.product_name}</p>
                  <p className="text-[#6F6A5F] text-[10px]">
                    Tamanho {item.size}
                    {item.variant === 'com-logo' ? ' · Com Logo' : item.variant === 'sem-logo' ? ' · Sem Logo' : ''}
                    {' '}· Qtd: {item.quantity}
                  </p>
                </div>
                <p className="text-[#1A1A1A] font-light text-sm">
                  R$ {(item.unit_price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-[#E6DFD2] pt-6 mb-8 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#6F6A5F] font-light">Subtotal</span>
            <span className="text-[#1A1A1A] font-light">R$ {order.subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-[#6F6A5F] font-light">Frete</span>
            <span className={`font-light ${order.shipping_cost === 0 ? 'text-[#A88F6A]' : 'text-[#1A1A1A]'}`}>
              {order.shipping_cost === 0 ? 'Grátis' : `R$ ${order.shipping_cost.toFixed(2).replace('.', ',')}`}
            </span>
          </div>
          <div className="flex justify-between text-lg pt-2 border-t border-[#1A1A1A]">
            <span className="text-[#1A1A1A]">Total</span>
            <span className="text-[#1A1A1A]">R$ {order.total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-[#E6DFD2] p-5 mb-12">
          <p className="text-[#6F6A5F] text-[9px] tracking-[0.3em] uppercase mb-2">Entrega</p>
          <p className="text-[#1A1A1A] font-light text-sm leading-relaxed">
            {addr.street}, {addr.number}{addr.complement ? ` - ${addr.complement}` : ''}<br />
            {addr.neighborhood} · {addr.city}/{addr.state}<br />
            CEP {addr.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}
          </p>
        </div>

        {/* Back */}
        <div className="text-center">
          <Link
            href="/"
            className="text-[#A88F6A] text-[9px] tracking-[0.35em] uppercase border-b border-[#A88F6A]/40 hover:border-[#A88F6A] pb-1 transition-colors"
          >
            Continuar comprando
          </Link>
        </div>
      </div>
    </main>
  );
}
