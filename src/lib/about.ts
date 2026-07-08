import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface HeroCtaItem {
  label: string;
  action: 'scroll-to-about' | 'download-resume' | 'scroll-to-contact';
  variant: 'primary' | 'secondary' | 'accent';
}

export interface AboutData {
  name: string;
  title: string;
  subtitle: string;
  heroCta: HeroCtaItem[];
}

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Membaca dan mem‑parsing data dari content/about.md.
 * Jika terjadi kesalahan (file tidak ditemukan, frontmatter salah),
 * akan mengembalikan data default agar halaman tidak crash.
 */
export function getAboutData(): AboutData {
  const defaultData: AboutData = {
    name: 'Alex Chen',
    title: 'Senior Full-Stack & Platform Engineer',
    subtitle: 'Crafting resilient systems, one deploy at a time',
    heroCta: [
      { label: 'Explore Portfolio', action: 'scroll-to-about', variant: 'primary' },
      { label: 'Download Resume', action: 'download-resume', variant: 'secondary' },
      { label: 'Contact Me', action: 'scroll-to-contact', variant: 'accent' },
    ],
  };

  try {
    const fullPath = path.join(contentDirectory, 'about.md');
    if (!fs.existsSync(fullPath)) {
      console.warn('about.md tidak ditemukan, menggunakan data default');
      return defaultData;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    // Validasi field wajib
    if (!data.name || !data.title || !data.subtitle || !Array.isArray(data.heroCta)) {
      throw new Error('Invalid about.md frontmatter: missing required fields');
    }

    // Validasi tiap item heroCta
    const validActions = ['scroll-to-about', 'download-resume', 'scroll-to-contact'];
    const validVariants = ['primary', 'secondary', 'accent'];
    const heroCta: HeroCtaItem[] = data.heroCta.map((item: any) => {
      if (!item.label || !item.action || !item.variant) {
        throw new Error('Invalid heroCta item: each must have label, action, variant');
      }
      if (!validActions.includes(item.action)) {
        throw new Error(`Invalid action in heroCta: ${item.action}`);
      }
      if (!validVariants.includes(item.variant)) {
        throw new Error(`Invalid variant in heroCta: ${item.variant}`);
      }
      return {
        label: item.label,
        action: item.action as HeroCtaItem['action'],
        variant: item.variant as HeroCtaItem['variant'],
      };
    });

    return {
      name: data.name,
      title: data.title,
      subtitle: data.subtitle,
      heroCta,
    };
  } catch (error) {
    console.error('Error parsing about.md, using default data:', error);
    return defaultData;
  }
}