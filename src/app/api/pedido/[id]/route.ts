import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/supabase';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID do pedido não informado' }, { status: 400 });
  }

  try {
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    // Don't expose sensitive data
    return NextResponse.json({
      id: order.id,
      status: order.status,
      customer_name: order.customer_name,
      items: order.items,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      total: order.total,
      shipping_address: order.shipping_address,
      tracking_code: order.tracking_code || null,
      created_at: order.created_at,
      paid_at: order.paid_at,
    });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
