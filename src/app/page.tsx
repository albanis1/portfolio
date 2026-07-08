import { getAboutData } from '@/lib/about';
import HeroSection from '@/components/hero/HeroSection';

export default function HomePage() {
  let aboutData;
  try {
    aboutData = getAboutData();
  } catch (error) {
    // Fallback jika terjadi error fatal (tidak seharusnya karena getAboutData sudah fallback)
    aboutData = {
      name: 'Alex Chen',
      title: 'Senior Full-Stack & Platform Engineer',
      subtitle: 'Crafting resilient systems, one deploy at a time',
      heroCta: [
        { label: 'Explore Portfolio', action: 'scroll-to-about' as const, variant: 'primary' as const },
        { label: 'Download Resume', action: 'download-resume' as const, variant: 'secondary' as const },
        { label: 'Contact Me', action: 'scroll-to-contact' as const, variant: 'accent' as const },
      ],
    };
  }

  return (
    <main>
      <HeroSection {...aboutData} />
      {/* Placeholder: section About akan menggantikan div ini nantinya */}
      <div id="about" className="h-1" />
      {/* Section lainnya akan ditambahkan di sini */}
    </main>
  );
}