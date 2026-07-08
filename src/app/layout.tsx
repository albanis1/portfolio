import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Muhammad Sigit | Portofolio',
    template: '%s | Muhammad Sigit',
  },
  description:
    'Portofolio profesional Muhammad Sigit, Technical Lead dengan pengalaman 5+ tahun membangun sistem enterprise.',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://portofolio-muhammadsigit.vercel.app',
    siteName: 'Muhammad Sigit Portofolio',
    title: 'Muhammad Sigit | Portofolio',
    description:
      'Portofolio profesional Muhammad Sigit, Technical Lead dengan pengalaman 5+ tahun membangun sistem enterprise.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Muhammad Sigit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Sigit | Portofolio',
    description:
      'Portofolio profesional Muhammad Sigit, Technical Lead dengan pengalaman 5+ tahun membangun sistem enterprise.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${inter.variable} font-sans`}>
      <body className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-6xl">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}