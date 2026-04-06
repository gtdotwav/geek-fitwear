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

    // Calculate total in REAIS
    const totalReais = Math.round(
      items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100
    ) / 100;

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
      console.error('[checkout] session create error:', JSON.stringify(err));
      return NextResponse.json(
        { error: 'Erro ao criar sessão de pagamento.' },
        { status: sessionRes.status }
      );
    }

    const session = await sessionRes.json();
    const sid = session.shortId || session.sessionId;
    console.error('[checkout] session created:', JSON.stringify({ sessionId: session.sessionId, shortId: session.shortId, keys: Object.keys(session) }));

    // 2. Fetch session details
    let pixCode = '';
    let pixQrCode = '';

    try {
      const detailsRes = await fetch(`${API_BASE}/sessions/${sid}`, {
        headers: { 'X-API-Key': SECRET_KEY },
      });

      if (detailsRes.ok) {
        const raw = await detailsRes.json();
        const s = raw.session || raw;
        console.error('[checkout] session details keys:', Object.keys(s).join(', '), '| status:', s.status, '| hasPixCode:', !!s.pixCode, '| hasProviders:', !!(s.providers?.length));

        pixCode = s.pixCode || '';
        pixQrCode = s.pixQrCode || '';

        // 3. If no PIX yet, try /pay with any available provider
        if (!pixCode) {
          const providers = s.providers || [];
          console.error('[checkout] providers found:', providers.length, providers.map((p: { id: string; methodType: string }) => `${p.id}:${p.methodType}`).join(', '));

          const pixProvider = providers.find(
            (p: { methodType?: string; type?: string; enabled?: boolean }) =>
              (p.methodType === 'pix' || p.type === 'pix') && p.enabled !== false
          );

          if (pixProvider?.id) {
            console.error('[checkout] calling /pay with provider:', pixProvider.id);
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

            const payText = await payRes.text();
            console.error('[checkout] /pay response:', payRes.status, payText.substring(0, 500));

            if (payRes.ok) {
              try {
                const payData = JSON.parse(payText);
                pixCode = payData.pixCode || '';
                pixQrCode = payData.pixQrCode || '';
              } catch { /* ignore */ }
            }
          } else {
            console.error('[checkout] no PIX provider found in session details');
          }
        }
      } else {
        console.error('[checkout] session details error:', detailsRes.status, await detailsRes.text().catch(() => 'N/A'));
      }
    } catch (e) {
      console.error('[checkout] PIX fetch error:', e);
    }

    console.error('[checkout] final result: hasPixCode:', !!pixCode, 'hasQrCode:', !!pixQrCode);

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
    console.error('[checkout] error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar pagamento.' },
      { status: 500 }
    );
  }
}
