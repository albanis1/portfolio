import { getAboutData } from '@/lib/about';
import HeroSection from '@/components/hero/HeroSection';

export default function HomePage() {
  const aboutData = getAboutData();

  return (
    <main>
      <HeroSection {...aboutData} />
      {/* Section lainnya akan ditambahkan di sini */}
    </main>
  );
}