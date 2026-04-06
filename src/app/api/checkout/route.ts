import { NextResponse } from 'next/server';

const API_BASE = 'https://pagrecovery.com/checkout/api/v1';
const SECRET_KEY = (process.env.PAGRECOVERY_SECRET_KEY || '').trim();

interface CheckoutItem {
  name: string;
  size: string;
  variant?: string;
  quantity: number;
  price: number; // in BRL (e.g. 95.00)
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

    // Calculate total in REAIS (API uses reais directly)
    const totalReais = Math.round(
      items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
    ) / 100;

    // Build description
    const description = items
      .map(i => `${i.quantity}x ${i.name} (${i.size}${i.variant ? ` - ${i.variant}` : ''})`)
      .join(', ');

    // 1. Create checkout session (amount in reais)
    const sessionRes = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SECRET_KEY,
      },
      body: JSON.stringify({
        amount: totalReais,
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
      console.error('PagRecovery session error:', JSON.stringify(err));
      return NextResponse.json(
        { error: 'Erro ao criar sessão de pagamento.' },
        { status: sessionRes.status }
      );
    }

    const session = await sessionRes.json();

    // 2. Fetch session details to check for auto-generated PIX
    let pixCode = '';
    let pixQrCode = '';

    try {
      const detailsRes = await fetch(`${API_BASE}/sessions/${session.shortId || session.sessionId}`, {
        headers: { 'X-API-Key': SECRET_KEY },
      });

      if (detailsRes.ok) {
        const details = await detailsRes.json();
        const s = details.session || details;
        pixCode = s.pixCode || '';
        pixQrCode = s.pixQrCode || '';

        // If no PIX yet and providers available, try /pay
        if (!pixCode) {
          const providers = s.providers || [];
          const pixProvider = providers.find(
            (p: { methodType?: string; type?: string; enabled?: boolean }) =>
              (p.methodType === 'pix' || p.type === 'pix') && p.enabled !== false
          );
          if (pixProvider?.id) {
            const payRes = await fetch(`${API_BASE}/sessions/${session.shortId || session.sessionId}/pay`, {
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
              const payData = await payRes.json();
              pixCode = payData.pixCode || '';
              pixQrCode = payData.pixQrCode || '';
            }
          }
        }
      }
    } catch (e) {
      console.error('PIX fetch error:', e);
    }

    // Append ?method=pix to checkoutUrl for direct PIX selection
    const checkoutUrl = session.checkoutUrl
      ? `${session.checkoutUrl}${session.checkoutUrl.includes('?') ? '&' : '?'}method=pix`
      : '';

    return NextResponse.json({
      sessionId: session.sessionId,
      checkoutUrl,
      pixCode,
      pixQrCode,
      amount: totalReais,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento.' },
      { status: 500 }
    );
  }
}
