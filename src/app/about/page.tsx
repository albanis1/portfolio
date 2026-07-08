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
  try {
    const aboutData = getAboutData()
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <AboutSection data={aboutData} />
      </main>
    )
  } catch (error) {
    // Render fallback error dengan pesan yang ramah
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-8">
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 max-w-md text-center backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-red-300 mb-4">Data Tidak Tersedia</h2>
          <p className="text-gray-300">
            Maaf, informasi tentang saya sedang tidak dapat dimuat. Silakan coba beberapa saat lagi atau hubungi saya melalui media sosial.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-xs text-red-400 mt-4 font-mono">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          )}
        </div>
      </main>
    )
  }
}