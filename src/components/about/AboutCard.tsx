'use client'

import { motion } from 'framer-motion'
import { ReactNode, useState, useCallback } from 'react'

interface AboutCardProps {
  frontTitle: string
  frontContent: ReactNode
  backTitle?: string
  backContent?: ReactNode
  flipEnabled?: boolean
  index: number // untuk animasi stagger
}

/**
 * Kartu interaktif dengan hover lift, glow, dan flip animasi.
 */
export function AboutCard({
  frontTitle,
  frontContent,
  backTitle,
  backContent,
  flipEnabled = false,
  index,
}: AboutCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = useCallback(() => {
    if (flipEnabled) {
      setIsFlipped((prev) => !prev)
    }
  }, [flipEnabled])

  return (
    <motion.div
      role={flipEnabled ? 'button' : 'article'}
      tabIndex={flipEnabled ? 0 : -1}
      aria-label={`Kartu ${frontTitle}`}
      className={`relative w-full h-64 md:h-72 xl:h-80 rounded-2xl bg-white/5 
        backdrop-blur-md border border-white/10 shadow-lg cursor-pointer
        transition-colors duration-300 hover:border-purple-400/30
        focus:outline-none focus:ring-2 focus:ring-purple-400/50
        ${flipEnabled ? 'perspective-1000' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ 
        y: -8,
        scale: 1.03,
        boxShadow: '0 0 30px -10px rgba(168,85,247,0.4), 0 20px 25px -5px rgba(0,0,0,0.5)',
      }}
      whileTap={{ scale: 0.98 }}
      onClick={handleFlip}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleFlip()
        }
      }}
    >
      <div
        className={`absolute inset-0 transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : 'rotate-y-0'}`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        <CardFace title={frontTitle} content={frontContent} />
      </div>

      {flipEnabled && backContent && (
        <div
          className={`absolute inset-0 transition-transform duration-700 ${isFlipped ? 'rotate-y-0' : '[transform:rotateY(180deg)]'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardFace title={backTitle ?? ''} content={backContent} isBack />
        </div>
      )}
    </motion.div>
  )
}

function CardFace({
  title,
  content,
  isBack = false,
}: {
  title: string
  content: ReactNode
  isBack?: boolean
}) {
  return (
    <div
      className={`w-full h-full p-6 flex flex-col justify-center items-center text-center
        ${isBack ? 'bg-purple-950/40 rounded-2xl' : ''}`}
    >
      <h3 className="text-lg font-semibold text-white/90 mb-2">{title}</h3>
      <div className="text-sm text-gray-300 leading-relaxed max-h-full overflow-auto">
        {content}
      </div>
    </div>
  )
}