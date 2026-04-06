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

    // Calculate total in CENTAVOS (API requires centavos)
    const totalCentavos = Math.round(
      items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
    );
    const totalReais = totalCentavos / 100;

    // Build description
    const description = items
      .map(i => `${i.quantity}x ${i.name} (${i.size}${i.variant ? ` - ${i.variant}` : ''})`)
      .join(', ');

    // 1. Create checkout session (amount in centavos, PIX only → auto-generates PIX)
    const sessionRes = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': SECRET_KEY,
      },
      body: JSON.stringify({
        amount: totalCentavos,
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
    console.log('Session created:', JSON.stringify({ sessionId: session.sessionId, shortId: session.shortId, keys: Object.keys(session) }));

    // 2. Fetch session details — PIX-only sessions auto-generate pixCode/pixQrCode
    let pixCode = '';
    let pixQrCode = '';

    try {
      const detailsRes = await fetch(`${API_BASE}/sessions/${session.shortId || session.sessionId}`, {
        headers: { 'X-API-Key': SECRET_KEY },
      });

      if (detailsRes.ok) {
        const details = await detailsRes.json();
        // Response wraps in { session: { ... } }
        const s = details.session || details;
        pixCode = s.pixCode || '';
        pixQrCode = s.pixQrCode || '';
        console.log('Session details fetched. Has pixCode:', !!pixCode, 'Has pixQrCode:', !!pixQrCode, 'Status:', s.status, 'Keys:', Object.keys(s).join(','));

        // If PIX not yet in details, try /pay endpoint with any available provider
        if (!pixCode && s.providers?.length) {
          const pixProvider = s.providers.find(
            (p: { methodType?: string; type?: string; enabled?: boolean }) =>
              (p.methodType === 'pix' || p.type === 'pix') && p.enabled !== false
          );
          if (pixProvider?.id) {
            console.log('Trying /pay with providerId:', pixProvider.id);
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
              console.log('PIX generated via /pay. Has pixCode:', !!pixCode);
            } else {
              console.error('Pay error:', await payRes.text().catch(() => 'N/A'));
            }
          }
        }
      } else {
        console.error('Session details error:', detailsRes.status, await detailsRes.text().catch(() => 'N/A'));
      }
    } catch (e) {
      console.error('PIX fetch error:', e);
    }

    return NextResponse.json({
      sessionId: session.sessionId,
      checkoutUrl: session.checkoutUrl,
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
