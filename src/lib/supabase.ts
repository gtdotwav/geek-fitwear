import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role (for API routes only)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ── Types ────────────────────────────────────────────────────────────────

export interface OrderItem {
  product_id: string;
  product_name: string;
  category: string;
  size: string;
  variant?: string;
  quantity: number;
  unit_price: number;
  promo_label?: string;
}

export interface ShippingAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Order {
  id?: string;
  session_id: string;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_document: string;
  shipping_address: ShippingAddress;
  shipping_cost: number;
  subtotal: number;
  total: number;
  items: OrderItem[];
  payment_method: string;
  pix_code?: string;
  created_at?: string;
  paid_at?: string;
}

// ── Order CRUD ───────────────────────────────────────────────────────────

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      session_id: order.session_id,
      status: order.status,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      customer_document: order.customer_document,
      shipping_address: order.shipping_address,
      shipping_cost: order.shipping_cost,
      subtotal: order.subtotal,
      total: order.total,
      items: order.items,
      payment_method: order.payment_method,
      pix_code: order.pix_code,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrderStatus(
  sessionId: string,
  status: Order['status'],
  extra?: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, ...extra })
    .eq('session_id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getOrderBySession(sessionId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// ── Inventory ────────────────────────────────────────────────────────────

export async function decrementStock(productId: string, quantity: number) {
  const { error } = await supabase.rpc('decrement_stock', {
    p_product_id: productId,
    p_quantity: quantity,
  });
  if (error) console.error('[inventory] decrement error:', error);
}
