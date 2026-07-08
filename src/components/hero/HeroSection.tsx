'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import type { HeroCtaItem } from '@/lib/about';

interface HeroProps {
  name: string;
  title: string;
  subtitle: string;
  heroCta: HeroCtaItem[];
}

export default function HeroSection({ name, title, subtitle, heroCta }: HeroProps) {
  const [displayName, setDisplayName] = useState('');
  const [showElements, setShowElements] = useState({
    subtitle: false,
    cta: false,
  });

  // Motion values untuk parallax — tidak memicu re-render React
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const { clientX, clientY, currentTarget } = e;
      const { width, height } = currentTarget.getBoundingClientRect();
      // Hitung offset dalam piksel dari tengah (maks ±20px)
      const offsetX = (clientX / width - 0.5) * 20;
      const offsetY = (clientY / height - 0.5) * 20;
      mouseX.set(offsetX);
      mouseY.set(offsetY);
    },
    [mouseX, mouseY],
  );

  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= name.length) {
        setDisplayName(name.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setShowElements((prev) => ({ ...prev, subtitle: true }));
        setTimeout(() => setShowElements((prev) => ({ ...prev, cta: true })), 800);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [name]);

  // Handler tombol CTA berdasarkan action
  const handleCtaClick = (action: HeroCtaItem['action']) => {
    switch (action) {
      case 'scroll-to-about':
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'download-resume':
        window.open('/resume.pdf', '_blank');
        break;
      case 'scroll-to-contact':
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  // Mapping variant ke kelas Tailwind
  const variantClasses: Record<HeroCtaItem['variant'], string> = {
    primary: 'bg-white/20 hover:bg-white/30 text-white',
    secondary: 'bg-transparent hover:bg-white/10 text-white border border-white/30',
    accent: 'bg-indigo-500/80 hover:bg-indigo-500 text-white',
  };

  // Label aksesibel untuk setiap action
  const ariaLabels: Record<HeroCtaItem['action'], string> = {
    'scroll-to-about': 'Scroll to About section',
    'download-resume': 'Download resume in new tab',
    'scroll-to-contact': 'Scroll to contact form',
  };

  return (
    <section
      role="banner"
      className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center justify-center text-white"
      onMouseMove={handleMouseMove}
    >
      {/* Aurora background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Layer 1: Purple aurora */}
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-purple-500/20 via-transparent to-transparent rounded-full"
          style={{ x: mouseX, y: mouseY }}
          animate={{ rotate: 360 }}
          transition={{ rotate: { repeat: Infinity, duration: 30, ease: 'linear' } }}
        />
        {/* Layer 2: Cyan aurora */}
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-radial from-cyan-500/20 via-transparent to-transparent rounded-full"
          style={{ x: mouseX, y: mouseY }}
          animate={{ rotate: -360 }}
          transition={{ rotate: { repeat: Infinity, duration: 25, ease: 'linear' } }}
        />
        {/* Layer 3: Emerald aurora */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[150%] h-[150%] bg-gradient-radial from-emerald-500/15 via-transparent to-transparent rounded-full"
          style={{ x: mouseX, y: mouseY }}
          animate={{ rotate: 180 }}
          transition={{ rotate: { repeat: Infinity, duration: 40, ease: 'linear' } }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4 min-h-[4rem] md:min-h-[6rem]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {displayName}
          <motion.span
            className="inline-block ml-1 w-1 h-10 md:h-16 bg-white align-middle"
            animate={{ opacity: [0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        </motion.h1>
        {showElements.subtitle && (
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
        )}
        {showElements.cta && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            {heroCta.map((cta) => (
              <motion.button
                key={cta.action}
                className={`px-8 py-3 rounded-full font-semibold text-lg transition shadow-lg backdrop-blur-sm ${variantClasses[cta.variant]}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCtaClick(cta.action)}
                aria-label={ariaLabels[cta.action]}
              >
                {cta.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex flex-col items-center"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7" />
          </motion.svg>
          <span className="sr-only">Scroll down</span>
          <motion.span
            className="mt-1 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 2 }}
            aria-hidden="true"
          >
            Scroll
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}