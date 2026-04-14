import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import OrderTracker from './OrderTracker';

export const metadata: Metadata = {
  title: 'Acompanhar Pedido — GreekFit',
  robots: 'noindex',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: Props) {
  const { id } = await params;

  if (!id || id.length < 8) notFound();

  return <OrderTracker orderId={id} />;
}
