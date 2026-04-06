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

// Cache merchant config (provider ID doesn't change)
let cachedPixProviderId: string | null = null;

async function getPixProviderId(): Promise<string> {
  if (cachedPixProviderId) return cachedPixProviderId;

  try {
    const res = await fetch(`${API_BASE}/merchants/config`, {
      headers: { 'X-API-Key': SECRET_KEY },
    });
    if (res.ok) {
      const config = await res.json();
      // Look for PIX provider in merchant config
      const providers = config.providers || config.paymentProviders || [];
      const pixProvider = providers.find(
        (p: { methodType?: string; type?: string; enabled?: boolean }) =>
          (p.methodType === 'pix' || p.type === 'pix') && p.enabled !== false
      );
      if (pixProvider?.id) {
        cachedPixProviderId = pixProvider.id;
        return pixProvider.id;
      }
      // If config has a flat structure, try other patterns
      if (config.pixProviderId) {
        cachedPixProviderId = config.pixProviderId;
        return config.pixProviderId;
      }
    }
    console.error('Merchant config response:', await res.text().catch(() => 'N/A'));
  } catch (e) {
    console.error('Failed to fetch merchant config:', e);
  }
  return '';
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

    // 1. Create checkout session (amount in centavos)
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
    const sessionId = session.shortId || session.sessionId;

    // 2. Get PIX provider ID from merchant config
    let pixCode = '';
    let pixQrCode = '';

    try {
      const providerId = await getPixProviderId();

      if (!providerId) {
        console.error('No PIX provider found in merchant config. Falling back to hosted checkout.');
      } else {
        // 3. Process PIX payment
        const payRes = await fetch(`${API_BASE}/sessions/${sessionId}/pay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': SECRET_KEY,
          },
          body: JSON.stringify({
            providerId,
            methodType: 'pix',
            installments: 1,
          }),
        });

        if (payRes.ok) {
          const payData = await payRes.json();
          pixCode = payData.pixCode || '';
          pixQrCode = payData.pixQrCode || '';
          console.log('PIX generated successfully for session:', sessionId);
        } else {
          const payErr = await payRes.json().catch(() => ({}));
          console.error('PagRecovery pay error:', JSON.stringify(payErr));
        }
      }
    } catch (payError) {
      console.error('PIX generation error:', payError);
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
