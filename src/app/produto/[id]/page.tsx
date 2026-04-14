import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { products } from '@/data/products';
import ProductPageClient from './ProductPageClient';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find(p => p.id === id);

  if (!product) {
    return { title: 'Produto não encontrado — GreekFit' };
  }

  const discount = Math.round(((product.originalPrice - product.pixPrice) / product.originalPrice) * 100);

  return {
    title: `${product.name} — GreekFit`,
    description: product.description,
    keywords: `${product.name}, ${product.category}, fitness, GreekFit, roupa fitness premium`,
    openGraph: {
      title: `${product.name} — GreekFit`,
      description: `R$ ${product.pixPrice.toFixed(2).replace('.', ',')} no PIX${discount > 0 ? ` (-${discount}%)` : ''}. ${product.description.substring(0, 120)}`,
      type: 'website',
      images: [
        {
          url: `https://greekfw.com${product.colors[0].image}`,
          width: 1024,
          height: 1024,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — GreekFit`,
      description: `R$ ${product.pixPrice.toFixed(2).replace('.', ',')} no PIX. ${product.description.substring(0, 100)}`,
      images: [`https://greekfw.com${product.colors[0].image}`],
    },
    alternates: {
      canonical: `https://greekfw.com/produto/${id}`,
    },
  };
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = products.find(p => p.id === id);

  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
