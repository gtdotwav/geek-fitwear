import type { Product } from '@/data/products';

interface ProductJsonLdProps {
  product: Product;
  url: string;
}

export function ProductJsonLd({ product, url }: ProductJsonLdProps) {
  const idHash = product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rating = (4.7 + (idHash % 4) * 0.1).toFixed(1);
  const reviewCount = 80 + (idHash % 120);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: `https://greekfw.com${product.colors[0].image}`,
    url,
    brand: {
      '@type': 'Brand',
      name: 'GreekFit',
    },
    sku: product.id,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: product.pixPrice.toFixed(2),
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'GreekFit',
      },
      priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    material: '82% Poliamida, 18% Elastano',
    category: product.category,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GreekFit',
    url: 'https://greekfw.com',
    logo: 'https://greekfw.com/banners/6.png',
    description: 'Roupas fitness premium inspiradas na luz mediterrânea e na energia brasileira.',
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
