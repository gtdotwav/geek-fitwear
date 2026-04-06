import { NextResponse } from 'next/server';

const API_BASE = 'https://pagrecovery.com/checkout/api/v1';
const SECRET_KEY = process.env.PAGRECOVERY_SECRET_KEY!;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
      headers: { 'X-API-Key': SECRET_KEY },
    });

    if (!res.ok) {
      return NextResponse.json({ status: 'unknown' });
    }

    const data = await res.json();
    return NextResponse.json({
      status: data.session?.status || 'unknown',
    });
  } catch {
    return NextResponse.json({ status: 'unknown' });
  }
}
