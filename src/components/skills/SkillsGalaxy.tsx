'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Skill } from '@/lib/skills';
import Planet from './Planet';
import Modal from '@/components/ui/Modal';

interface SkillsGalaxyProps {
  skills: Skill[];
}

type OrbitalPlanet = Skill & {
  orbitIndex: number;
  angleOffset: number;
  speedMultiplier: number;
  radiusPercent: number;
};

/**
 * Komponen interaktif Skills Galaxy.
 * Menggambar planet pada orbit multi-layer dengan animasi rotasi kontinu.
 */
export default function SkillsGalaxy({ skills }: SkillsGalaxyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const angleRef = useRef<number[]>([]); // satu angle per orbit
  const planets: OrbitalPlanet[] = React.useMemo(() => {
    if (!skills || skills.length === 0) return [];

    // Kelompokkan berdasarkan level, lalu urutkan
    const sorted = [...skills].sort((a, b) => b.level - a.level);

    // Orbit: 3 orbit, radius 15%, 30%, 45% dari kontainer
    const orbits = [
      { radius: 15, speed: 0.6 },
      { radius: 30, speed: 0.4 },
      { radius: 45, speed: 0.2 },
    ];

    // Bagikan planet ke orbit secara merata
    const perOrbit = Math.ceil(sorted.length / orbits.length);
    const orbitalPlanets: OrbitalPlanet[] = [];

    sorted.forEach((skill, idx) => {
      const orbitIndex = Math.min(
        Math.floor(idx / perOrbit),
        orbits.length - 1
      );
      const orbit = orbits[orbitIndex];
      // Hitung sudut awal secara merata untuk menghindari tumpukan
      const totalInThisOrbit = sorted.filter(
        (_, i) => Math.min(Math.floor(i / perOrbit), orbits.length - 1) === orbitIndex
      ).length;
      const positionInOrbit = orbitalPlanets.filter(p => p.orbitIndex === orbitIndex).length;
      const angleOffset = (2 * Math.PI / totalInThisOrbit) * positionInOrbit;

      orbitalPlanets.push({
        ...skill,
        orbitIndex,
        angleOffset,
        speedMultiplier: orbit.speed,
        radiusPercent: orbit.radius,
      });
    });

    return orbitalPlanets;
  }, [skills]);

  useEffect(() => {
    // Inisialisasi sudut awal untuk setiap orbit (0 sampai orbits.length-1)
    const orbitsCount = Math.max(...planets.map(p => p.orbitIndex), 0) + 1;
    angleRef.current = new Array(orbitsCount).fill(0);
  }, [planets]);

  const handleHover = useCallback((skill: Skill | null) => {
    setHoveredSkill(skill);
  }, []);

  const handlePlanetClick = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedSkill(null);
  }, []);

  // Intersection Observer untuk pause animasi saat di luar viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRunning(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Loop animasi
  useEffect(() => {
    if (!isRunning || planets.length === 0) return;

    let lastTime = performance.now();
    const step = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Update angle setiap orbit
      for (let i = 0; i < angleRef.current.length; i++) {
        angleRef.current[i] += delta * 0.001 * planets[i]?.speedMultiplier;
      }

      // Update posisi planet dengan mengubah gaya langsung (tanpa re-render)
      // Kita tidak menggunakan state untuk posisi agar performa optimal.
      // Namun karena kita menggunakan komponen Planet yang menerima x,y sebagai props,
      // kita perlu trigger re-render minimal setiap frame. Ini bisa berat.
      // Alternatif: kita hitung langsung di Planet menggunakan ref ke container?
      // Tetapi Planet sudah memoized. Kita bisa menyimpan x,y di ref dan mengupdate gaya
      // langsung. Tapi untuk menjaga kemurnian React, kita bisa menggunakan
      // requestAnimationFrame langsung di Planet? Itu akan banyak loop.
      // Pendekatan yang digunakan: update state posisi via requestAnimationFrame,
      // tapi hanya jika visual perlu berubah. Kita bisa menghitung posisi di sini
      // dan menyimpannya dalam array `planetPositions` yang di-set state.
      // Agar tidak re-render setiap frame, kita bisa menggunakan `useState` untuk
      // array posisi tetapi hanya update saat posisi berubah melebihi threshold?
      // Namun untuk kehalusan animasi, re-render 60 kali/detik mungkin bisa diterima
      // jika Planet di-memo dengan baik. Performa pada React 18 cukup baik dengan memo.

      const centerX = 50; // persen
      const centerY = 50;

      const newPositions: { x: number; y: number }[] = planets.map(planet => {
        const angle = angleRef.current[planet.orbitIndex] + planet.angleOffset;
        const x = centerX + planet.radiusPercent * Math.cos(angle);
        const y = centerY + planet.radiusPercent * Math.sin(angle);
        return { x, y };
      });

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, planets]);

  // Jika tidak ada skills, tampilkan fallback
  if (!skills || skills.length === 0) {
    return (
      <section className="py-20 px-4 text-center text-gray-500 dark:text-gray-400">
        <p>Tidak ada data keterampilan yang tersedia.</p>
      </```
    );
  }

  // Hitung posisi planet berdasarkan angle saat ini (untuk render awal)
  // angleRef akan di-update oleh animation loop
  const centerX = 50;
  const centerY = 50;

  const planetPositions = planets.map((planet) => {
    const angle =
      (angleRef.current[planet.orbitIndex] ?? 0) + planet.angleOffset;
    const x = centerX + planet.radiusPercent * Math.cos(angle);
    const y = centerY + planet.radiusPercent * Math.sin(angle);
    return { x, y };
  });

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
        Skills Galaxy
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        Hover atau klik planet untuk melihat detail keterampilan teknis.
      </p>

      <div
        ref={containerRef}
        className="relative w-full aspect-square max-w-2xl mx-auto rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(100,100,255,0.1) 0%, transparent 70%)' }}
        aria-label="Interactive skills galaxy with orbiting planets"
      >
        {/* Pusat galaksi */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white dark:bg-gray-200 shadow-2xl flex items-center justify-center z-10 border-4 border-purple-500 dark:border-purple-400"
          aria-hidden="true"
        >
          <span className="text-2xl font-bold text-purple-500 dark:text-purple-400">
            ⚡
          </span>
        </div>

        {/* Orbit rings */}
        {[15, 30, 45].map((radius, idx) => (
          <div
            key={idx}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-300 dark:border-gray-600 opacity-30"
            style={{
              width: `${radius * 2}%`,
              height: `${radius * 2}%`,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Planet - di-render menggunakan posisi yang dihitung dari state (animasi loop) */}
        {/* Untuk animasi halus, kita gunakan requestAnimationFrame yang memodifikasi langsung ref DOM */}
        {planets.map((planet, idx) => (
          <Planet
            key={`${planet.name}-${planet.orbitIndex}`}
            skill={planet}
            x={planetPositions[idx]?.x ?? 50}
            y={planetPositions[idx]?.y ?? 50}
            onClick={() => handlePlanetClick(planet)}
            onHover={handleHover}
          />
        ))}
      </div>

      {/* Keterangan skill yang dihover (tambahan di bawah) */}
      {hoveredSkill && (
        <p
          className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400"
          aria-live="polite"
        >
          {hoveredSkill.name} — Level {hoveredSkill.level}/5,{' '}
          {hoveredSkill.years} tahun pengalaman
        </p>
      )}

      {/* Modal Detail */}
      <Modal isOpen={!!selectedSkill} onClose={closeModal}>
        {selectedSkill && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {selectedSkill.name}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
              <p>
                <strong>Level:</strong> {selectedSkill.level}/5
              </p>
              <p>
                <strong>Pengalaman:</strong> {selectedSkill.years} tahun
              </p>
              <p>
                <strong>Proyek:</strong> {selectedSkill.projects}
              </p>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedSkill.description}
            </p>
          </div>
        )}
      </Modal>
    </section>
  );
}