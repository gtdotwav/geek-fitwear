import { NextResponse } from 'next/server';
import { calculateShipping } from '@/lib/shipping';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cep = searchParams.get('cep') || '';
  const subtotal = parseFloat(searchParams.get('subtotal') || '0');

  if (!cep || cep.replace(/\D/g, '').length !== 8) {
    return NextResponse.json({ error: 'CEP inválido' }, { status: 400 });
  }

  const quote = calculateShipping(cep, subtotal);
  return NextResponse.json(quote);
}
