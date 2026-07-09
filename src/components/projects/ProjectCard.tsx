'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

interface ProjectCardProps {
  project: {
    slug: string;
    title: string;
    description: string;
    image: string;
    category: string;
    tags: string[];
    demoUrl?: string;
    repoUrl?: string;
  };
}

const springConfig = { stiffness: 300, damping: 30 };

export default function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-15, 15]), springConfig);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / rect.width;
      const mouseY = (e.clientY - rect.top) / rect.height;
      x.set(mouseX);
      y.set(mouseY);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0.5);
    y.set(0.5);
    setIsHovered(false);
  }, [x, y]);

  return (
    <motion.div
      ref={cardRef}
      className="group perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="block h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden
                   transition-shadow duration-300 hover:shadow-2xl hover:shadow-neon/20
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label={`View project: ${project.title}`}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback placeholder if image fails to load
              (e.target as HTMLImageElement).src = '/images/placeholder.png';
            }}
          />
        </div>
        <div className="p-5">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {project.category}
          </span>
          <h3 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {project.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                +{project.tags.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}