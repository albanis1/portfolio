import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkillsGalaxy from './SkillsGalaxy';
import type { Skill } from '@/lib/skills';

// Mock Modal component
jest.mock('@/components/ui/Modal', () => {
  return function MockModal({
    isOpen,
    onClose,
    children,
  }: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }) {
    if (!isOpen) return null;
    return (
      <div role="dialog" aria-modal="true">
        {children}
        <button onClick={onClose} aria-label="Close modal">
          Close
        </button>
      </div>
    );
  };
});

const mockSkills: Skill[] = [
  {
    name: 'React',
    level: 5,
    years: 6,
    projects: 25,
    description: 'Membangun antarmuka kompleks.',
    category: 'frontend',
  },
  {
    name: 'Node.js',
    level: 4,
    years: 5,
    projects: 15,
    description: 'REST API dan servis backend.',
    category: 'backend',
  },
  {
    name: 'Docker',
    level: 4,
    years: 4,
    projects: 12,
    description: 'Containerization.',
    category: 'devops',
  },
  {
    name: 'Go',
    level: 2,
    years: 2,
    projects: 5,
    description: 'Bahasa performan.',
    category: 'language',
  },
  {
    name: 'AWS',
    level: 3,
    years: 3,
    projects: 8,
    description: 'Infrastruktur awan.',
    category: 'cloud',
  },
  {
    name: 'PostgreSQL',
    level: 4,
    years: 5,
    projects: 18,
    description: 'Database relasional.',
    category: 'database',
  },
  {
    name: 'Kubernetes',
    level: 3,
    years: 3,
    projects: 7,
    description: 'Orchestration.',
    category: 'devops',
  },
  {
    name: 'TypeScript',
    level: 5,
    years: 5,
    projects: 20,
    description: 'Superset JavaScript.',
    category: 'language',
  },
];

// Mock IntersectionObserver untuk memastikan animasi berjalan
beforeAll(() => {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
      takeRecords: jest.fn(),
      root: null,
      rootMargin: '',
      thresholds: [],
    })),
  });
});

describe('SkillsGalaxy', () => {
  it('renders without crashing with no skills', () => {
    const { container } = render(<SkillsGalaxy skills={[]} />);
    expect(
      screen.getByText('Tidak ada data keterampilan yang tersedia.')
    ).toBeInTheDocument();
  });

  it('renders the galaxy container with correct heading', () => {
    render(<SkillsGalaxy skills={mockSkills} />);
    expect(screen.getByText('Skills Galaxy')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Hover atau klik planet untuk melihat detail keterampilan teknis.'
      )
    ).toBeInTheDocument();
  });

  it('renders planets for each skill (min. 8)', () => {
    render(<SkillsGalaxy skills={mockSkills} />);
    // Planet dirender sebagai button dengan aria-label masing-masing
    mockSkills.forEach((skill) => {
      const planet = screen.getByRole('button', {
        name: new RegExp(skill.name, 'i'),
      });
      expect(planet).toBeInTheDocument();
    });
  });

  it('shows tooltip on hover over a planet', async () => {
    render(<SkillsGalaxy skills={mockSkills} />);
    const reactPlanet = screen.getByRole('button', { name: /React/i });

    // Hover planet React
    fireEvent.mouseEnter(reactPlanet);

    // Tooltip muncul
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByRole('tooltip')).toHaveTextContent('React');
      expect(screen.getByRole('tooltip')).toHaveTextContent('5/5');
    });

    // Saat mouse leave, tooltip hilang
    fireEvent.mouseLeave(reactPlanet);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('shows tooltip on keyboard focus (Enter / Tab)', async () => {
    render(<SkillsGalaxy skills={mockSkills} />);
    const nodePlanet = screen.getByRole('button', { name: /Node.js/i });

    // Fokus via keyboard (Tab)
    fireEvent.focus(nodePlanet);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByRole('tooltip')).toHaveTextContent('Node.js');
    });

    // Blur
    fireEvent.blur(nodePlanet);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('opens modal with skill details on planet click', async () => {
    render(<SkillsGalaxy skills={mockSkills} />);
    const reactPlanet = screen.getByRole('button', { name: /React/i });

    fireEvent.click(reactPlanet);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText(/5\/5/)).toBeInTheDocument();
      expect(screen.getByText(/6 tahun/)).toBeInTheDocument();
      expect(screen.getByText(/25/)).toBeInTheDocument();
      expect(
        screen.getByText('Membangun antarmuka kompleks.')
      ).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    render(<SkillsGalaxy skills={mockSkills} />);
    const reactPlanet = screen.getByRole('button', { name: /React/i });

    fireEvent.click(reactPlanet);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes modal on Escape key', async () => {
    render(<SkillsGalaxy skills={mockSkills} />);
    const reactPlanet = screen.getByRole('button', { name: /React/i });

    fireEvent.click(reactPlanet);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('renders orbit rings for visual context', () => {
    const { container } = render(<SkillsGalaxy skills={mockSkills} />);
    // Orbit rings adalah elemen <div> dengan class border yang berada di dalam container galaksi
    const orbitRings = container.querySelectorAll(
      '.rounded-full.border.border-gray-300'
    );
    // Harus ada 3 orbit ring
    expect(orbitRings.length).toBeGreaterThanOrEqual(3);
  });

  it('displays an information text below when a planet is hovered', async () => {
    render(<SkillsGalaxy skills={mockSkills} />);
    const goPlanet = screen.getByRole('button', { name: /Go/i });

    fireEvent.mouseEnter(goPlanet);

    await waitFor(() => {
      expect(
        screen.getByText(/Go — Level 2\/5, 2 tahun pengalaman/)
      ).toBeInTheDocument();
    });
  });
});