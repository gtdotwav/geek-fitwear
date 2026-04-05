'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { label: 'Coleção', href: '/#collection' },
  { label: 'Campanha', href: '/#campaign' },
  { label: 'Filosofia', href: '/#philosophy' },
];

function Logo({ dark = false }: { dark?: boolean }) {
  const textColor = dark ? 'text-[#F5F1E8]' : 'text-[#1A1A1A]';
  const lineColor = dark ? 'bg-[#C2A27C]' : 'bg-[#A88F6A]';
  return (
    <Link href="/" className="flex flex-col items-start gap-[3px] group">
      <div className={`w-full h-px ${lineColor} transition-opacity group-hover:opacity-60`} />
      <span className={`${textColor} font-serif font-light text-lg tracking-[0.3em] uppercase leading-none select-none`}>
        GreekFit
      </span>
      <div className={`w-full h-px ${lineColor} transition-opacity group-hover:opacity-60`} />
    </Link>
  );
}

export default function Header() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOverHero = !scrolled;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-700 ${
          isOverHero
            ? 'bg-transparent'
            : 'bg-[#F5F1E8]/95 backdrop-blur-sm border-b border-[#E6DFD2]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-18 py-5">

            {/* Logo */}
            <Logo dark={isOverHero} />

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[10px] tracking-[0.25em] uppercase font-medium transition-colors duration-300 relative group/link ${
                    isOverHero
                      ? 'text-[#F5F1E8]/70 hover:text-[#F5F1E8]'
                      : 'text-[#6F6A5F] hover:text-[#1A1A1A]'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-px group-hover/link:w-full transition-all duration-400 ${isOverHero ? 'bg-[#C2A27C]' : 'bg-[#A88F6A]'}`} />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={openCart}
                className={`relative p-2 transition-colors ${
                  isOverHero ? 'text-[#F5F1E8]/70 hover:text-[#F5F1E8]' : 'text-[#6F6A5F] hover:text-[#1A1A1A]'
                }`}
                aria-label="Sacola"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.3} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key="badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#A88F6A] text-[#F5F1E8] text-[9px] font-semibold rounded-full flex items-center justify-center"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                className={`md:hidden p-2 transition-colors ${
                  isOverHero ? 'text-[#F5F1E8]/70' : 'text-[#6F6A5F]'
                }`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen
                  ? <X className="w-[18px] h-[18px]" strokeWidth={1.3} />
                  : <Menu className="w-[18px] h-[18px]" strokeWidth={1.3} />
                }
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[68px] left-0 right-0 z-20 bg-[#F5F1E8]/98 backdrop-blur-sm border-b border-[#E6DFD2]"
          >
            <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
              {navLinks.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-[#6F6A5F] hover:text-[#1A1A1A] text-[10px] tracking-[0.3em] uppercase font-medium transition-colors py-2 border-b border-[#E6DFD2] last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
