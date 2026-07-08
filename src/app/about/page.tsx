import { getAboutData } from '@/lib/about'
import { AboutSection } from '@/components/about/AboutSection'

export const metadata = {
  title: 'Tentang Saya',
  description: 'Informasi profesional tentang Alexander Albanis',
}

/**
 * Halaman /about yang menampilkan grid kartu interaktif.
 */
export default async function AboutPage() {
  const aboutData = getAboutData()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <AboutSection data={aboutData} />
    </main>
  )
}