'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import type { Experience } from '@/lib/experience';
import Modal from '@/components/ui/Modal';
import Image from 'next/image';

interface TimelineProps {
  experiences: Experience[];
}

export default function Timeline({ experiences }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [canScroll, setCanScroll] = useState(false);

  // Check if content is scrollable
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkOverflow = () => {
      // Use a small delay to allow layout to settle
      setTimeout(() => {
        if (container) {
          setCanScroll(container.scrollWidth > container.clientWidth);
        }
      }, 100);
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [experiences]);

  const updateProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const maxScroll = container.scrollWidth - container.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
    } else {
      setScrollProgress(container.scrollLeft / maxScroll);
    }
  }, []);

  // Attach scroll event
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => updateProgress();
    container.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [updateProgress]);

  // Horizontal scroll via mouse wheel (prevent vertical scroll)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // If the container has vertical scroll, let it handle; otherwise convert to horizontal
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && container) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 0.5; // reduce speed
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  // Keyboard arrows for scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!container) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        container.scrollLeft -= 200;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        container.scrollLeft += 200;
      }
    };
    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full py-12 bg-white dark:bg-gray-950 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Professional Journey
      </h2>

      {/* Scroll buttons (desktop) */}
      {canScroll && (
        <>
          <button
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollRight}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="overflow-x-auto px-8 pb-4 flex items-center space-x-12 md:space-x-20 scroll-smooth focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        tabIndex={0}
      >
        {/* Progress line background */}
        <div className="relative flex items-center min-w-max py-12">
          {/* Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-gray-300 dark:bg-gray-700 rounded-full" />

          {/* Animated progress */}
          <m```tsx
              <motion.div
                className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                style={{ width: `${scrollProgress * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Milestones */}
            {experiences.map((exp, index) => (
              <button
                key={exp.slug}
                onClick={() => setSelectedExp(exp)}
                className="relative flex flex-col items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
                aria-label={`View details for ${exp.company}`}
              >
                {/* Dot */}
                <motion.div
                  className="w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-400 border-4 border-white dark:border-gray-950 shadow-lg z-10 transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125"
                  whileHover={{ scale: 1.3 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                />
                {/* Label */}
                <div className="mt-3 text-center">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors whitespace-nowrap">
                    {exp.company}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {exp.position}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {exp.startDate}{' '}
                    {exp.endDate ? `- ${exp.endDate}` : '– Present'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={!!selectedExp} onClose={() => setSelectedExp(null)}>
        {selectedExp && (
          <div className="space-y-4">
            <h3 id="modal-title" className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {selectedExp.company}
            </h3>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">
              {selectedExp.position}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {selectedExp.startDate}{' '}
              {selectedExp.endDate ? `– ${selectedExp.endDate}` : '– Present'}
            </p>

            {selectedExp.description && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {selectedExp.description}
              </p>
            )}

            {/* Achievements */}
            {selectedExp.achievements.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Key Achievements</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  {selectedExp.achievements.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            {selectedExp.technologies.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedExp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm border border-gray-200 dark:border-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {selectedExp.images.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Gallery</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedExp.images.map((src, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src={src}
                        alt={`${selectedExp.company} image ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}