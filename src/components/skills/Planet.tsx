'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';

interface PlanetProps {
  name: string;
  level: number;
  years: number;
  radius: number;
  angleMotion: any; // Framer MotionValue<number>
  size?: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

const LEVEL_COLORS: Record<number, string> = {
  1: '#f87171',
  2: '#fbbf24',
  3: '#34d399',
  4: '#60a5fa',
  5: '#c084fc',
};

const Planet = memo(function Planet({
  name,
  level,
  years,
  radius,
  angleMotion,
  size = 40,
  onHoverStart,
  onHoverEnd,
  onClick,
}: PlanetProps) {
  // Hitung koordinat dari sudut
  const x = `calc(50% + ${radius}px * cos(${angleMotion}rad))`;
  const y = `calc(50% + ${radius}px * sin(${angleMotion}rad))`;

  return (
    <motion.button
      className="absolute flex flex-col items-center justify-center focus:outline-none"
      style={{
        width: size,
        height: size,
        // Posisi dihitung manual dengan transform
        left: `calc(50% - ${size / 2}px)`,
        top: `calc(50% - ${size / 2}px)`,
        transform: `translate(${radius * Math.cos(angleMotion.get())}px, ${radius * Math.sin(angleMotion.get())}px)`,
      }}
      whileHover={{ scale: 1.3 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
      aria-label={`${name} - Level ${level}, ${years} tahun pengalaman`}
    >
      {/* Bola planet */}
      <div
        className="rounded-full shadow-lg"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 30% 30%, ${LEVEL_COLORS[level] || '#aaa'}66, ${LEVEL_COLORS[level] || '#aaa'})`,
          boxShadow: `0 0 20px ${LEVEL_COLORS[level] || '#aaa'}80`,
        }}
      />
      {/* Nama skill di bawah planet */}
      <span className="text-xs mt-1 text-gray-200 dark:text-gray-300 text-center leading-tight">
        {name}
      </span>
    </motion.button>
  );
});

export default Planet;