'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const slides = [
  { id: 1, image: '/banners/1.png' },
  { id: 2, image: '/banners/2.png' },
  { id: 3, image: '/banners/5.png' },
  { id: 4, image: '/banners/13.png' },
  { id: 5, image: '/banners/10.png' },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % slides.length), []);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section
      data-hero
      className="relative w-full overflow-hidden bg-[#2B2B2B] md:h-[85vh] lg:h-screen"
    >
      {/* Images — crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="w-full md:absolute md:inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          {/* Mobile: full image, no crop, no bars */}
          <Image
            src={slides[current].image}
            alt={`GreekFit Campaign — Slide ${current + 1}`}
            width={2752}
            height={1536}
            sizes="100vw"
            priority={current === 0}
            className="w-full h-auto block md:hidden"
          />
          {/* Desktop: fill viewport, crop edges */}
          <Image
            src={slides[current].image}
            alt={`GreekFit Campaign — Slide ${current + 1}`}
            fill
            sizes="100vw"
            priority={current === 0}
            className="object-cover hidden md:block"
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 pointer-events-none" />

      {/* Bottom: scroll cue + dots */}
      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex items-center justify-between px-6 md:px-8 lg:px-12">
        {/* Slide dots */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Slides do banner">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              aria-selected={i === current}
              role="tab"
              className={`transition-all duration-500 rounded-full ${
                i === current
                  ? 'w-5 h-[3px] bg-[#C2A27C]'
                  : 'w-[3px] h-[3px] bg-[#F5F1E8]/30 hover:bg-[#F5F1E8]/60'
              }`}
            />
          ))}
        </div>

        {/* Scroll cue — hidden on mobile since hero is shorter */}
        <div className="hidden md:flex flex-col items-center gap-2">
          <span className="text-[#F5F1E8]/40 text-[8px] tracking-[0.4em] uppercase">Rolar</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-[#F5F1E8]/30 to-transparent"
          />
        </div>
      </div>

      {/* Progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#F5F1E8]/10">
        <motion.div
          key={current}
          className="h-full bg-[#C2A27C]/60"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 6, ease: 'linear' }}
        />
      </div>
    </section>
  );
}
