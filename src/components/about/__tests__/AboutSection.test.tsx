import { render, screen, fireEvent } from '@testing-library/react'
import { AboutSection } from '../AboutSection'
import type { AboutData } from '@/lib/about'

// Mock framer-motion agar tidak error di environment testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock data
const mockData: AboutData = {
  name: 'Alexander Albanis',
  title: 'Senior Fullstack Engineer',
  summary: 'Seorang insinyur perangkat lunak berpengalaman.',
  specialization: 'Cloud Native Development',
  yearsOfExperience: 12,
  currentPosition: 'Principal Engineer',
  interests: ['Distributed Systems', 'WebAssembly'],
  careerGoals: 'Menjadi CTO.',
  socialLinks: {
    github: 'https://github.com/albanis1',
    linkedin: 'https://linkedin.com/in/albanis',
    email: 'alex@albanis.dev',
  },
}

describe('AboutSection', () => {
  it('merender grid kartu berdasarkan data', () => {
    render(<AboutSection data={mockData} />)

    expect(screen.getByLabelText('Tentang Saya')).toBeInTheDocument()
    expect(screen.getByText('Ringkasan Profesional')).toBeInTheDocument()
    expect(screen.getByText('Spesialisasi')).toBeInTheDocument()
    expect(screen.getByText('Tahun Pengalaman')).toBeInTheDocument()
    expect(screen.getByText('Posisi Saat Ini')).toBeInTheDocument()
    expect(screen.getByText('Hubungi Saya')).toBeInTheDocument()
  })

  it('menampilkan data dari props', () => {
    render(<AboutSection data={mockData} />)

    expect(screen.getByText(/insinyur perangkat lunak/i)).toBeInTheDocument()
    expect(screen.getByText('12+')).toBeInTheDocument()
    expect(screen.getByText('Principal Engineer')).toBeInTheDocument()
  })

  it('kartu ringkasan dapat dibalik', () => {
    render(<AboutSection data={mockData} />)

    const summaryCard = screen.getByLabelText('Kartu Ringkasan Profesional')
    expect(summaryCard).toBeInTheDocument()

    // Sebelum flip, teks tujuan karir tidak terlihat
    expect(screen.queryByText('Tujuan Karir')).not.toBeInTheDocument()

    // Klik kartu untuk flip
    fireEvent.click(summaryCard)

    // Setelah flip, teks tujuan karir muncul
    expect(screen.getByText('Tujuan Karir')).toBeInTheDocument()
    expect(screen.getByText('Menjadi CTO.')).toBeInTheDocument()
  })

  it('menampilkan tautan sosial jika tersedia', () => {
    render(<AboutSection data={mockData} />)

    expect(screen.getByLabelText('GitHub Profile')).toHaveAttribute('href', mockData.socialLinks.github)
    expect(screen.getByLabelText('LinkedIn Profile')).toHaveAttribute('href', mockData.socialLinks.linkedin)
    expect(screen.getByLabelText('Send Email')).toHaveAttribute('href', `mailto:${mockData.socialLinks.email}`)
  })
})