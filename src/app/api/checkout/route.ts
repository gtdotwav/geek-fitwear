import { NextResponse } from 'next/server';

const API_BASE = 'https://pagrecovery.com/checkout/api/v1';
const SECRET_KEY = process.env.PAGRECOVERY_SECRET_KEY!;

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

    // Calculate total (round to 2 decimals)
    const totalReais = Math.round(
      items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
    ) / 100;

    // Build description
    const description = items
      .map(i => `${i.quantity}x ${i.name} (${i.size}${i.variant ? ` - ${i.variant}` : ''})`)
      .join(', ');

    // 1. Create checkout session
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
      console.error('PagRecovery session error:', err);
      return NextResponse.json(
        { error: 'Erro ao criar sessão de pagamento.' },
        { status: sessionRes.status }
      );
    }

    const session = await sessionRes.json();

    // 2. Get session details to find the PIX provider ID
    let pixCode = '';
    let pixQrCode = '';

    try {
      // Fetch session to get available providers
      const detailsRes = await fetch(`${API_BASE}/sessions/${session.shortId || session.sessionId}`, {
        headers: { 'X-API-Key': SECRET_KEY },
      });

      let providerId = '';
      if (detailsRes.ok) {
        const details = await detailsRes.json();
        const pixProvider = (details.providers || []).find(
          (p: { methodType: string; enabled: boolean }) => p.methodType === 'pix' && p.enabled
        );
        providerId = pixProvider?.id || '';
      }

      if (!providerId) {
        console.error('No PIX provider found for this merchant');
      } else {
        // 3. Process PIX payment using shortId and providerId
        const payRes = await fetch(`${API_BASE}/sessions/${session.shortId || session.sessionId}/pay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': SECRET_KEY,
          },
          body: JSON.stringify({
            methodType: 'pix',
            providerId,
          }),
        });

        if (payRes.ok) {
          const payData = await payRes.json();
          pixCode = payData.pixCode || '';
          pixQrCode = payData.pixQrCode || '';
        } else {
          const payErr = await payRes.json().catch(() => ({}));
          console.error('PagRecovery pay error:', payErr);
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
