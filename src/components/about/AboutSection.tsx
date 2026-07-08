'use client'

import type { AboutData } from '@/lib/about'
import { AboutCard } from './AboutCard'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

interface AboutSectionProps {
  data: AboutData
}

/**
 * Grid kartu Tentang Saya dengan konfigurasi front/back.
 */
export function AboutSection({ data }: AboutSectionProps) {
  const cards = [
    {
      id: 'summary',
      frontTitle: 'Ringkasan Profesional',
      frontContent: <p className="text-pretty leading-relaxed">{data.summary}</p>,
      backTitle: 'Tujuan Karir',
      backContent: <p className="text-pretty leading-relaxed">{data.careerGoals}</p>,
      flipEnabled: true,
    },
    {
      id: 'specialization',
      frontTitle: 'Spesialisasi',
      frontContent: <p className="font-medium">{data.specialization}</p>,
      backTitle: 'Minat & Fokus',
      backContent: (
        <ul className="list-disc list-inside text-left">
          {data.interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>
      ),
      flipEnabled: true,
    },
    {
      id: 'experience',
      frontTitle: 'Tahun Pengalaman',
      frontContent: (
        <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          {data.yearsOfExperience}+
        </div>
      ),
      flipEnabled: false,
    },
    {
      id: 'position',
      frontTitle: 'Posisi Saat Ini',
      frontContent: <p className="font-medium">{data.currentPosition}</p>,
      flipEnabled: false,
    },
    {
      id: 'contact',
      frontTitle: 'Hubungi Saya',
      frontContent: (
        <div className="flex gap-4 text-2xl text-white/80">
          {data.socialLinks.github && (
            <a
              href={data.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              onClick={(e) => e.stopPropagation()}
            >
              <FaGithub className="hover:text-purple-400 transition" />
            </a>
          )}
          {data.socialLinks.linkedin && (
            <a
              href={data.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              onClick={(e) => e.stopPropagation()}
            >
              <FaLinkedin className="hover:text-blue-400 transition" />
            </a>
          )}
          {data.socialLinks.email && (
            <a
              href={`mailto:${data.socialLinks.email}`}
              aria-label="Send Email"
              onClick={(e) => e.stopPropagation()}
            >
              <FaEnvelope className="hover:text-red-400 transition" />
            </a>
          )}
        </div>
      ),
      flipEnabled: false,
    },
  ]

  return (
    <section
      id="about"
      className="py-20 px-4 md:px-8 max-w-7xl mx-auto"
      aria-label="Tentang Saya"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
        Tentang Saya
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {cards.map((card, index) => (
          <AboutCard
            key={card.id}
            index={index}
            frontTitle={card.frontTitle}
            frontContent={card.frontContent}
            backTitle={card.backTitle}
            backContent={card.backContent}
            flipEnabled={card.flipEnabled}
          />
        ))}
      </div>
    </section>
  )
}