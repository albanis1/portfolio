'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface SkillTooltipProps {
  visible: boolean;
  name: string;
  level: number;
  years: number;
  x: number; // posisi absolute (relative to galaxy container)
  y: number;
}

export default function SkillTooltip({ visible, name, level, years, x, y }: SkillTooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute z-30 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-xl pointer-events-none"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <p className="font-semibold">{name}</p>
          <p>
            Level <span className="text-yellow-300">{level}/5</span> · {years} tahun
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}