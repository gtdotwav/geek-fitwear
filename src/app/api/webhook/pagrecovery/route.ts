import { NextResponse } from 'next/server';
import { updateOrderStatus, getOrderBySession, decrementStock } from '@/lib/supabase';
import { sendOrderConfirmation } from '@/lib/email';

const WEBHOOK_SECRET = process.env.PAGRECOVERY_WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  try {
    // Verify webhook signature if configured
    if (WEBHOOK_SECRET) {
      const signature = request.headers.get('x-webhook-signature') || '';
      if (signature !== WEBHOOK_SECRET) {
        console.error('[webhook] invalid signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const body = await request.json();
    const { sessionId, status, event } = body;

    console.log('[webhook] received:', { event, sessionId, status });

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    // Handle payment confirmation
    if (event === 'payment.confirmed' || event === 'session.paid' || status === 'paid') {
      const order = await getOrderBySession(sessionId);

      if (!order) {
        console.error('[webhook] order not found for session:', sessionId);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      if (order.status === 'paid') {
        // Already processed — idempotent
        return NextResponse.json({ ok: true, message: 'Already processed' });
      }

      // Update order status
      const updatedOrder = await updateOrderStatus(sessionId, 'paid', {
        paid_at: new Date().toISOString(),
      });

      // Decrement inventory for each item
      for (const item of order.items) {
        await decrementStock(item.product_id, item.quantity);
      }

      // Send confirmation email
      await sendOrderConfirmation(updatedOrder);

      console.log('[webhook] order confirmed:', order.id);
      return NextResponse.json({ ok: true, orderId: order.id });
    }

    // Handle cancellation
    if (event === 'payment.cancelled' || event === 'session.expired' || status === 'cancelled' || status === 'expired') {
      await updateOrderStatus(sessionId, 'cancelled').catch(() => {});
      return NextResponse.json({ ok: true });
    }

    // Unknown event — acknowledge anyway
    return NextResponse.json({ ok: true, message: 'Event not handled' });
  } catch (error) {
    console.error('[webhook] error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
