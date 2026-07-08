import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from '../HeroSection';
import { act } from 'react';

// Mock framer-motion untuk render langsung tanpa animasi
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  motion: {
    div: 'div',
    h1: 'h1',
    p: 'p',
    button: 'button',
    span: 'span',
    svg: 'svg',
  },
  useAnimation: () => ({
    start: jest.fn(),
    set: jest.fn(),
  }),
}));

const mockData = {
  name: 'John Do',
  title: 'Full-Stack Developer',
  subtitle: 'Building scalable systems',
  heroCta: ['Explore Portfolio', 'Download Resume', 'Contact Me'],
};

describe('HeroSection', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    render(<HeroSection {...mockData} />);
    expect(screen.getByText('Building scalable systems')).toBeInTheDocument(); // subtitle setelah animasi
  });

  it('displays the name with typewriter effect', () => {
    render(<HeroSection {...mockData} />);
    // Pada awalnya, teks kosong atau sebagian
    // Setelah interval, tampil nama lengkap
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 500); // cukup untuk typing selesai
    });
    expect(screen.getByText('John Do')).toBeInTheDocument(); // Teks nama sudah selesai
  });

  it('shows subtitle after name is fully typed', () => {
    render(<HeroSection {...mockData} />);
    // Awalnya subtitle tidak ada
    expect(screen.queryByText('Building scalable systems')).toBeNull();
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 1000);
    });
    expect(screen.getByText('Building scalable systems')).toBeInTheDocument();
  });

  it('renders CTA buttons after subtitle', () => {
    render(<HeroSection {...mockData} />);
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 2000);
    });
    expect(screen.getByText('Explore Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Download Resume')).toBeInTheDocument();
    expect(screen.getByText('Contact Me')).toBeInTheDocument();
  });

  it('calls window.open when Download Resume is clicked', () => {
    const openMock = jest.spyOn(window, 'open').mockImplementation(() => null);
    render(<HeroSection {...mockData} />);
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 2000);
    });
    fireEvent.click(screen.getByText('Download Resume'));
    expect(openMock).toHaveBeenCalledWith('/resume.pdf', '_blank');
    openMock.mockRestore();
  });

  it('scrolls to contact section when Contact Me is clicked', () => {
    // Buat elemen dengan id 'contact' di DOM
    const contactDiv = document.createElement('div');
    contactDiv.id = 'contact';
    document.body.appendChild(contactDiv);
    const scrollIntoViewMock = jest.spyOn(contactDiv, 'scrollIntoView').mockImplementation(() => {});

    render(<HeroSection {...mockData} />);
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 2000);
    });
    fireEvent.click(screen.getByText('Contact Me'));
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(contactDiv);
    scrollIntoViewMock.mockRestore();
  });

  it('renders aurora background elements', () => {
    const { container } = render(<HeroSection {...mockData} />);
    // Periksa ada tiga div background (kelas tertentu, tetapi karena motion di-mock, kita cek jumlah div di dalam section)
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    // Cari div di dalam section dengan style background gradient (mock)
    // Karena mock, kita bisa cek dengan querySelectorAll
    const bgDivs = section?.querySelectorAll('div > div > div'); // kurang spesifik
    // Alternatif: tambahkan test-id untuk background
    // Untuk keperluan snapshot, bisa kita lakukan snapshot test
    expect(section).toMatchSnapshot();
  });
});