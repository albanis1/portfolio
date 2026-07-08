import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from '../HeroSection';
import { act } from 'react';

// Mock framer-motion
const mockMotionValue = (initialValue: number) => ({
  get: jest.fn(() => initialValue),
  set: jest.fn(),
  onChange: jest.fn(),
  subscribe: jest.fn(),
  destroy: jest.fn(),
  toJSON: () => initialValue,
  valueOf: () => initialValue,
  toString: () => String(initialValue),
});

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
  useMotionValue: (initial: number) => mockMotionValue(initial),
}));

const mockData = {
  name: 'John Do',
  title: 'Full-Stack Developer',
  subtitle: 'Building scalable systems',
  heroCta: [
    { label: 'Explore Portfolio', action: 'scroll-to-about' as const, variant: 'primary' as const },
    { label: 'Download Resume', action: 'download-resume' as const, variant: 'secondary' as const },
    { label: 'Contact Me', action: 'scroll-to-contact' as const, variant: 'accent' as const },
  ],
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
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 2000);
    });
    expect(screen.getByText('Building scalable systems')).toBeInTheDocument();
  });

  it('displays the name with typewriter effect', () => {
    render(<HeroSection {...mockData} />);
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 500);
    });
    expect(screen.getByText('John Do')).toBeInTheDocument();
  });

  it('shows subtitle after name is fully typed', () => {
    render(<HeroSection {...mockData} />);
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

  it('scrolls to about section when Explore Portfolio is clicked', () => {
    const aboutDiv = document.createElement('div');
    aboutDiv.id = 'about';
    document.body.appendChild(aboutDiv);
    const scrollMock = jest.spyOn(aboutDiv, 'scrollIntoView').mockImplementation(() => {});

    render(<HeroSection {...mockData} />);
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 2000);
    });
    fireEvent.click(screen.getByText('Explore Portfolio'));
    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(aboutDiv);
    scrollMock.mockRestore();
  });

  it('scrolls to contact section when Contact Me is clicked', () => {
    const contactDiv = document.createElement('div');
    contactDiv.id = 'contact';
    document.body.appendChild(contactDiv);
    const scrollMock = jest.spyOn(contactDiv, 'scrollIntoView').mockImplementation(() => {});

    render(<HeroSection {...mockData} />);
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 2000);
    });
    fireEvent.click(screen.getByText('Contact Me'));
    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(contactDiv);
    scrollMock.mockRestore();
  });

  it('has proper accessibility attributes', () => {
    render(<HeroSection {...mockData} />);
    const banner = document.querySelector('section[role="banner"]');
    expect(banner).toBeInTheDocument();

    // Indikator scroll menyembunyikan SVG dari screen reader
    const svg = document.querySelector('svg[aria-hidden="true"]');
    expect(svg).toBeInTheDocument();

    // Teks "Scroll" juga disembunyikan secara visual
    const srOnly = document.querySelector('.sr-only');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly).toHaveTextContent('Scroll down');

    // Tombol CTA memiliki aria-label deskriptif
    expect(screen.getByLabelText('Scroll to About section')).toBeInTheDocument();
    expect(screen.getByLabelText('Download resume in new tab')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll to contact form')).toBeInTheDocument();
  });

  it('renders gradient aurora layers with correct radial gradient classes', () => {
    render(<HeroSection {...mockData} />);
    // Semua lapisan aurora harus memiliki kelas bg-gradient-radial
    const auroraLayers = document.querySelectorAll('.bg-gradient-radial');
    expect(auroraLayers.length).toBe(3);
  });

  it('snapshot matches', () => {
    const { container } = render(<HeroSection {...mockData} />);
    act(() => {
      jest.advanceTimersByTime(mockData.name.length * 100 + 3000);
    });
    expect(container.firstChild).toMatchSnapshot();
  });
});