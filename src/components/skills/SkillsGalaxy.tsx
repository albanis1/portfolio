'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import { useAnimationFrame, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import Planet from './Planet';
import SkillTooltip from './SkillTooltip';
import SkillModal from './SkillModal';
import type { Skill } from '@/lib/skills';

interface SkillsGalaxyProps {
  skills: Skill[];
}

// Orbit dengan radius dan kecepatan berbeda
const ORBIT_CONFIG = [
  { radius: 130, speed: 0.4 },
  { radius: 200, speed: 0.25 },
  { radius: 270, speed: 0.15 },
];

export default function SkillsGalaxy({ skills }: SkillsGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Distribusi skill ke orbit berdasarkan index
  const orbitSkills = useMemo(() => {
    const orbits: { config: (typeof ORBIT_CONFIG)[number]; skill: Skill }[] = [];
    skills.forEach((skill, idx) => {
      const config = ORBIT_CONFIG[idx % ORBIT_CONFIG.length];
      orbits.push({ config, skill });
    });
    return orbits;
  }, [skills]);

  // Motion value untuk sudut global (satu sumbu waktu)
  const angle = useMotionValue(0);
  useAnimationFrame((_, delta) => {
    angle.set(angle.get() + 0.0005 * delta);
  });

  // Handler hover untuk tooltip
  const handleHover = useCallback((skill: Skill, event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: event.clientX - rect.left + 10,
        y: event.clientY - rect.top - 40,
      });
    }
    setHoveredSkill(skill);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredSkill(null);
  }, []);

  if (skills.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 dark:text-gray-500">
        Belum ada data skill yang tersedia.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-3xl mx-auto select-none"
      aria-label="Skills galaxy – orbit interaktif"
    >
      {/* Inti / pusat */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 shadow-[0_0_60px_#a855f7] z-10 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
        Skills
      </div>

      {/* Orbit rings (dekorasi) */}
      {ORBIT_CONFIG.map((orbit) => (
        <div
          key={orbit.radius}
          className="absolute left-1/2 top-1/2 border border-white/10 dark:border-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ width: orbit.radius * 2, height: orbit.radius * 2 }}
        />
      ))}

      {/* Planet yang mengorbit */}
      {orbitSkills.map(({ config, skill }) => (
        <OrbitingPlanet
          key={skill.name}
          skill={skill}
          orbitRadius={config.radius}
          orbitSpeed={config.speed}
          angle={angle}
          onHoverStart={(e) => handleHover(skill, e)}
          onHoverEnd={handleHoverEnd}
          onClick={() => setSelectedSkill(skill)}
        />
      ))}

      {/* Tooltip */}
      <SkillTooltip
        visible={hoveredSkill !== null}
        name={hoveredSkill?.name ?? ''}
        level={hoveredSkill?.level ?? 0}
        years={hoveredSkill?.years ?? 0}
        x={tooltipPos.x}
        y={tooltipPos.y}
      />

      {/* Modal detail */}
      <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </div>
  );
}

/**
 * Komponen pembungkus untuk satu planet.
 * Menghitung posisi x dan y secara reaktif dari angle menggunakan useTransform.
 */
function OrbitingPlanet({
  skill,
  orbitRadius,
  orbitSpeed,
  angle,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  skill: Skill;
  orbitRadius: number;
  orbitSpeed: number;
  angle: MotionValue<number>;
  onHoverStart: (e: React.MouseEvent) => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  // Offset sudut awal acak agar planet tersebar
  const initialOffset = useRef(Math.random() * Math.PI * 2).current;

  // Sudut lokal = sudut global * kecepatan orbit + offset
  const localAngle = useTransform(angle, (a) => a * orbitSpeed + initialOffset);

  // Posisi x dan y reaktif
  const x = useTransform(localAngle, (a) => orbitRadius * Math.cos(a));
  const y = useTransform(localAngle, (a) => orbitRadius * Math.sin(a));

  return (
    <Planet
      name={skill.name}
      level={skill.level}
      years={skill.years}
      size={skill.level * 6 + 28}
      x={x}
      y={y}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={onClick}
    />
  );
}