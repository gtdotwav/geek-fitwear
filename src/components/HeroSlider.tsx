'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const slides = [
  {
    id: 1,
    image: '/banners/1.png',
    line: 'Not just a fitwear.',
  },
  {
    id: 2,
    image: '/banners/2.png',
    line: '',
  },
  {
    id: 3,
    image: '/banners/5.png',
    line: '',
  },
  {
    id: 4,
    image: '/banners/13.png',
    line: '',
  },
  {
    id: 5,
    image: '/banners/10.png',
    line: '',
  },
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
      className="relative w-full h-[75vh] md:h-[85vh] lg:h-screen overflow-hidden bg-[#2B2B2B]"
    >
      {/* Images — crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <Image
            src={slides[current].image}
            alt={`GreekFit Campaign — Slide ${current + 1}`}
            fill
            sizes="100vw"
            priority={current === 0}
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 pointer-events-none" />

      {/* Bottom: scroll cue + dots */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-8 lg:px-12">
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

        {/* Scroll cue */}
        <div className="flex flex-col items-center gap-2">
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
