'use client'

import type { AboutData } from '@/lib/about'
import { AboutCard } from './AboutCard'

// Ikon SVG inline
function IconGitHub() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.263.82-.583 0-.288-.013-1.247-.02-2.45-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.774.418-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.47-2.38 1.236-3.22-.124-.303-.536-1.523.116-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.004-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.12 3.176.767.84 1.234 1.91 1.234 3.22 0 4.61-2.807 5.625-5.48 5.92.432.372.81 1.103.81 2.224 0 1.607-.015 2.9-.015 3.294 0 .322.216.7.825.58C20.565 21.797 24 17.304 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  )
}

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
              className="hover:text-purple-400 transition"
            >
              <IconGitHub />
            </a>
          )}
          {data.socialLinks.linkedin && (
            <a
              href={data.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-blue-400 transition"
            >
              <IconLinkedIn />
            </a>
          )}
          {data.socialLinks.email && (
            <a
              href={`mailto:${data.socialLinks.email}`}
              aria-label="Send Email"
              onClick={(e) => e.stopPropagation()}
              className="hover:text-red-400 transition"
            >
              <IconMail />
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