import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Skill } from '@/lib/skills';

interface PlanetProps {
  skill: Skill;
  x: number;
  y: number;
  isCenter?: boolean;
  onClick: () => void;
  onHover: (skill: Skill | null) => void;
}

/**
 * Planet individual yang dirender di posisi (x, y).
 * Di-memo untuk mencegah re-render saat orbit berubah (posisi dihitung di parent).
 */
const Planet: React.FC<PlanetProps> = React.memo(
  ({ skill, x, y, isCenter = false, onClick, onHover }) => {
    const [isHovered, setIsHovered] = useState(false);
    const planetRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
      onHover(skill);
    }, [skill, onHover]);

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      onHover(null);
    }, [onHover]);

    const handleFocus = useCallback(() => {
      setIsHovered(true);
      onHover(skill);
    }, [skill, onHover]);

    const handleBlur = useCallback(() => {
      setIsHovered(false);
      onHover(null);
    }, [onHover]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };

    // Ukuran planet berdasarkan level (1-5) -> 40px - 80px
    const size = isCenter ? 80 : 40 + skill.level * 8; // 40 + (level*8) => antara 48-80
    const baseScale = isHovered ? 1.2 : 1;

    // Level mewakili warna (lebih tinggi lebih terang/intens)
    const colorMap = [
      'bg-blue-500 dark:bg-blue-400',
      'bg-green-500 dark:bg-green-400',
      'bg-yellow-500 dark:bg-yellow-400',
      'bg-purple-500 dark:bg-purple-400',
      'bg-pink-500 dark:bg-pink-400',
    ];
    const color = isCenter ? 'bg-white dark:bg-gray-200' : colorMap[skill.level - 1];

    return (
      <div
        className="absolute"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%)`,
          willChange: 'transform',
        }}
      >
        <motion.div
          ref={planetRef}
          role="button"
          tabIndex={0}
          aria-label={`${skill.name}: level ${skill.level}, ${skill.years} years`}
          className={`
            rounded-full cursor-pointer flex items-center justify-center
            shadow-lg hover:shadow-xl transition-shadow duration-300
            focus:outline-none focus:ring-4 focus:ring-purple-300
            ${color}
          `}
          style={{
            width: size,
            height: size,
          }}
          animate={{ scale: baseScale }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={onClick}
          onKeyDown={handleKeyDown}
        >
          <span className="text-white dark:text-gray-900 font-bold text-xs md:text-sm leading-tight text-center px-1">
            {skill.name}
          </span>
        </motion.div>

        {/* Tooltip muncul saat hover/focus */}
        {isHovered && (
          <div
            className="absolute z-20 left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg text-center pointer-events-none"
            role="tooltip"
          >
            <strong>{skill.name}</strong>
            <br />
            Level: {skill.level}/5 · {skill.years} thn
          </div>
        )}
      </div>
    );
  }
);

Planet.displayName = 'Planet';
export default Planet;