'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { AboutData } from '@/lib/about';

interface HeroProps extends AboutData {}

export default function HeroSection({ name, title, subtitle, heroCta }: HeroProps) {
  const [displayName, setDisplayName] = useState('');
  const [showElements, setShowElements] = useState({
    subtitle: false,
    cta: false,
  });
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const mouseHandler = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height } = currentTarget.getBoundingClientRect();
    // Hitung persentase posisi mouse dari tengah layar
    const x = (clientX / width - 0.5) * 20; // maksimal 10% shift
    const y = (clientY / height - 0.5) * 20;
    setParallaxOffset({ x, y });
  }, []);

  // Typewriter effect
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= name.length) {
        setDisplayName(name.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        // Setelah nama selesai, tampilkan subtitle lalu tombol
        setShowElements((prev) => ({ ...prev, subtitle: true }));
        setTimeout(() => setShowElements((prev) => ({ ...prev, cta: true })), 800);
      }
    }, 100); // kecepatan ketik

    return () => clearInterval(interval);
  }, [name]);

  // Animasi kontrol
  const subtitleControls = useAnimation();
  const ctaControls = useAnimation();

  useEffect(() => {
    if (showElements.subtitle) {
      subtitleControls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
    }
    if (showElements.cta) {
      ctaControls.start({ opacity: 1, scale: 1, transition: { duration: 0.6, staggerChildren: 0.2 } });
    }
  }, [showElements, subtitleControls, ctaControls]);

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900 flex flex-col items-center justify-center text-white"
      onMouseMove={mouseHandler}
    >
      {/* Aurora background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-purple-500/20 via-transparent to-transparent rounded-full"
          animate={{
            rotate: 360,
            x: parallaxOffset.x * 0.8,
            y: parallaxOffset.y * 0.8,
          }}
          transition={{ rotate: { repeat: Infinity, duration: 30, ease: 'linear' }, x: { type: 'spring', stiffness: 50 }, y: { type: 'spring', stiffness: 50 } }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-radial from-cyan-500/20 via-transparent to-transparent rounded-full"
          animate={{
            rotate: -360,
            x: parallaxOffset.x * 0.5,
            y: parallaxOffset.y * 0.5,
          }}
          transition={{ rotate: { repeat: Infinity, duration: 25, ease: 'linear' }, x: { type: 'spring', stiffness: 50 }, y: { type: 'spring', stiffness: 50 } }}
        />
        <motion.div
          className="absolute top-1/4 left-1/4 w-[150%] h-[150%] bg-gradient-radial from-emerald-500/15 via-transparent to-transparent rounded-full"
          animate={{
            rotate: 180,
            x: parallaxOffset.x * 0.3,
            y: parallaxOffset.y * 0.3,
          }}
          transition={{ rotate: { repeat: Infinity, duration: 40, ease: 'linear' }, x: { type: 'spring', stiffness: 50 }, y: { type: 'spring', stiffness: 50 } }}
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
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
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
            {heroCta.map((cta, index) => (
              <motion.button
                key={index}
                className={`px-8 py-3 rounded-full font-semibold text-lg transition shadow-lg backdrop-blur-sm border border-white/20 ${
                  index === 0
                    ? 'bg-white/20 hover:bg-white/30 text-white'
                    : index === 1
                    ? 'bg-transparent hover:bg-white/10 text-white'
                    : 'bg-indigo-500/80 hover:bg-indigo-500 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (index === 1) {
                    // Download resume
                    window.open('/resume.pdf', '_blank');
                  } else if (index === 2) {
                    // Navigasi ke kontak (scroll atau halaman)
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {cta}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
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
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7" />
        </motion.svg>
        <motion.div
          className="mt-1 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Scroll
        </motion.div>
      </motion.div>
    </section>
  );
}