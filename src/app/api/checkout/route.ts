import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/supabase';
import { calculateShipping } from '@/lib/shipping';

const API_BASE = 'https://pagrecovery.com/checkout/api/v1';
const SECRET_KEY = (process.env.PAGRECOVERY_SECRET_KEY || '').trim();

interface CheckoutItem {
  id: string;
  name: string;
  category: string;
  size: string;
  variant?: string;
  quantity: number;
  price: number;
  promoLabel?: string;
}

interface CheckoutAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface CheckoutBody {
  items: CheckoutItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    document?: string;
  };
  address?: CheckoutAddress;
}

export async function POST(request: Request) {
  try {
    const body: CheckoutBody = await request.json();
    const { items, customer, address } = body;

    if (!items?.length || !customer?.name || !customer?.email || !customer?.phone || !customer?.document) {
      return NextResponse.json(
        { error: 'Dados incompletos. Preencha nome, email, telefone, CPF e itens.' },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = Math.round(
      items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
    ) / 100;

    // Calculate shipping
    const shipping = address
      ? calculateShipping(address.cep, subtotal)
      : { cost: 0, estimatedDays: 0, label: '', free: true };

    const total = Math.round((subtotal + shipping.cost) * 100) / 100;

    const description = items
      .map(i => `${i.quantity}x ${i.name} (${i.size}${i.variant ? ` - ${i.variant}` : ''})`)
      .join(', ');

    // 1. Create PagRecovery checkout session
    const sessionRes = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SECRET_KEY,
      },
      body: JSON.stringify({
        amount: total,
        description: `GreekFit — ${description}`,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone.replace(/\D/g, ''),
        customerDocument: customer.document,
        allowedMethods: ['pix'],
        pixDiscountPercent: 0,
        expiresInMinutes: 30,
        countdownMinutes: 15,
        scarcityMessage: 'Estoque limitado — garanta suas peças!',
        webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://greekfw.com'}/api/webhook/pagrecovery`,
        ...(address && {
          shippingAddress: {
            zipCode: address.cep.replace(/\D/g, ''),
            street: address.street,
            number: address.number,
            complement: address.complement,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            country: 'BR',
          },
        }),
        metadata: {
          items: items.map(i => ({
            id: i.id,
            name: i.name,
            size: i.size,
            variant: i.variant,
            quantity: i.quantity,
            price: i.price,
          })),
          ...(address && { address }),
        },
      }),
    });

    if (!sessionRes.ok) {
      const err = await sessionRes.json().catch(() => ({}));
      console.error('[checkout] session create error:', JSON.stringify(err));
      return NextResponse.json(
        { error: 'Erro ao criar sessão de pagamento.' },
        { status: sessionRes.status }
      );
    }

    const session = await sessionRes.json();
    const sid = session.shortId || session.sessionId;

    // 2. Fetch PIX code from session
    let pixCode = '';
    let pixQrCode = '';

    try {
      const detailsRes = await fetch(`${API_BASE}/sessions/${sid}`, {
        headers: { 'X-API-Key': SECRET_KEY },
      });

      if (detailsRes.ok) {
        const raw = await detailsRes.json();
        const s = raw.session || raw;

        pixCode = s.pixCode || '';
        pixQrCode = s.pixQrCode || '';

        if (!pixCode) {
          const providers = s.providers || [];
          const pixProvider = providers.find(
            (p: { methodType?: string; type?: string; enabled?: boolean }) =>
              (p.methodType === 'pix' || p.type === 'pix') && p.enabled !== false
          );

          if (pixProvider?.id) {
            const payRes = await fetch(`${API_BASE}/sessions/${sid}/pay`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-API-Key': SECRET_KEY,
              },
              body: JSON.stringify({
                providerId: pixProvider.id,
                methodType: 'pix',
                installments: 1,
              }),
            });

            if (payRes.ok) {
              try {
                const payData = await payRes.json();
                pixCode = payData.pixCode || '';
                pixQrCode = payData.pixQrCode || '';
              } catch { /* ignore */ }
            }
          }
        }
      }
    } catch (e) {
      console.error('[checkout] PIX fetch error:', e);
    }

    // 3. Persist order to Supabase
    let orderId = '';
    try {
      const order = await createOrder({
        session_id: session.sessionId || sid,
        status: 'pending',
        customer_name: customer.name.trim(),
        customer_email: customer.email.trim(),
        customer_phone: customer.phone.replace(/\D/g, ''),
        customer_document: (customer.document || '').replace(/\D/g, ''),
        shipping_address: address || { cep: '', street: '', number: '', neighborhood: '', city: '', state: '' },
        shipping_cost: shipping.cost,
        subtotal,
        total,
        items: items.map(i => ({
          product_id: i.id,
          product_name: i.name,
          category: i.category || '',
          size: i.size,
          variant: i.variant,
          quantity: i.quantity,
          unit_price: i.price,
          promo_label: i.promoLabel,
        })),
        payment_method: 'pix',
        pix_code: pixCode,
      });
      orderId = order.id;
    } catch (e) {
      console.error('[checkout] order save error:', e);
      // Don't block checkout — payment session already exists
    }

    const checkoutUrl = session.checkoutUrl
      ? `${session.checkoutUrl}${session.checkoutUrl.includes('?') ? '&' : '?'}method=pix`
      : '';

    return NextResponse.json({
      sessionId: session.sessionId || sid,
      orderId,
      checkoutUrl,
      pixCode,
      pixQrCode,
      amount: total,
      shippingCost: shipping.cost,
      shippingDays: shipping.estimatedDays,
    });
  } catch (error) {
    console.error('[checkout] error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento.' },
      { status: 500 }
    );
  }
}
