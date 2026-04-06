import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import ChatWidget from '@/components/ChatWidget';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-outfit',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GreekFit — Vista o Sol.',
  description:
    'Roupas fitness premium inspiradas na luz mediterrânea e na energia brasileira. Feitas para quem se move com intenção.',
  keywords: 'roupas fitness premium, legging, top, conjunto fitness, moda fitness',
  openGraph: {
    title: 'GreekFit — Vista o Sol.',
    description: 'Luz mediterrânea. Energia brasileira. Precisão máxima.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} ${inter.variable}`}>
      <body className="font-sans bg-[#F5F1E8] text-[#1A1A1A] antialiased">
        <CartProvider>
          <Header />
          <CartDrawer />
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
