import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Developer Portfolio | Interactive Experience',
    template: '%s | Developer Portfolio',
  },
  description:
    'Premium interactive portfolio showcasing software engineering expertise, architecture design, and real-world projects.',
  keywords: [
    'software developer',
    'portfolio',
    'full stack',
    'architecture',
    'react',
    'next.js',
    'typescript',
  ],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://portfolio-website.vercel.app',
    siteName: 'Developer Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Portfolio',
    description: 'Premium interactive portfolio showcasing software engineering expertise.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-200">
        {children}
      </body>
    </html>
  );
}