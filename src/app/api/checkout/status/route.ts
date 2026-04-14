import { NextResponse } from 'next/server';
import { getOrderBySession } from '@/lib/supabase';

const API_BASE = 'https://pagrecovery.com/checkout/api/v1';
const SECRET_KEY = (process.env.PAGRECOVERY_SECRET_KEY || '').trim();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
  }

  try {
    // Check local DB first (faster, post-webhook)
    const order = await getOrderBySession(sessionId);
    if (order && order.status === 'paid') {
      return NextResponse.json({
        status: 'paid',
        orderId: order.id,
      });
    }

    // Fallback: check PagRecovery directly
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
      headers: { 'X-API-Key': SECRET_KEY },
    });

    if (!res.ok) {
      return NextResponse.json({ status: order?.status || 'unknown' });
    }

    const data = await res.json();
    const paymentStatus = data.session?.status || data.status || 'unknown';

    return NextResponse.json({
      status: paymentStatus,
      orderId: order?.id || null,
    });
  } catch {
    return NextResponse.json({ status: 'unknown' });
  }
}
