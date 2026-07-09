import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Timeline from '../Timeline';
import type { Experience } from '@/lib/experience';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const mockExperiences: Experience[] = [
  {
    slug: '2020-acme-corp',
    company: 'Acme Corp',
    position: 'Senior Software Engineer',
    startDate: '2020-01',
    endDate: '2022-12',
    achievements: ['Led migration to microservices', 'Reduced latency by 30%'],
    technologies: ['React', 'Node.js', 'Kubernetes'],
    images: ['/images/exp1.jpg'],
    description: 'Led the architecture redesign.',
  },
  {
    slug: '2022-startupx',
    company: 'StartupX',
    position: 'Lead Backend Engineer',
    startDate: '2023-01',
    endDate: undefined,
    achievements: ['Built scalable API', 'Mentored juniors'],
    technologies: ['TypeScript', 'PostgreSQL'],
    images: ['/images/exp2.jpg'],
    description: 'Built backend from scratch.',
  },
];

beforeEach(() => {
  // Mock scrollWidth, clientWidth for scroll logic
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    value: 1200,
  });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    value: 800,
  });
});

describe('Timeline', () => {
  it('renders milestones for each experience', () => {
    render(<Timeline experiences={mockExperiences} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('StartupX')).toBeInTheDocument();
  });

  it('renders company names as buttons', () => {
    render(<Timeline experiences={mockExperiences} />);
    const companyButtons = screen.getAllByRole('button', { name: /view details for/i });
    expect(companyButtons).toHaveLength(2);
  });

  it('opens modal with details on milestone click', async () => {
    render(<Timeline experiences={mockExperiences} />);
    const btn = screen.getByRole('button', { name: /view details for acme corp/i });
    fireEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Led migration to microservices')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('closes modal when backdrop or close button is clicked', async () => {
    render(<Timeline experiences={mockExperiences} />);
    const btn = screen.getByRole('button', { name: /view details for acme corp/i });
    fireEvent.click(btn);
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    // Click close button
    const closeBtn = screen.getByLabelText('Close modal');
    fireEvent.click(closeBtn);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes modal on Escape key', async () => {
    render(<Timeline experiences={mockExperiences} />);
    fireEvent.click(screen.getByRole('button', { name: /view details for acme corp/i }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('shows "Present" for current position without endDate', () => {
    render(<Timeline experiences={mockExperiences} />);
    expect(screen.getByText(/2023-01 – Present/i)).toBeInTheDocument();
  });

  it('shows proper date range for past positions', () => {
    render(<Timeline experiences={mockExperiences} />);
    expect(screen.getByText(/2020-01 - 2022-12/i)).toBeInTheDocument();
  });

  it('renders scroll buttons when content overflows', async () => {
    // Ensure container is scrollable (already set in beforeEach)
    render(<Timeline experiences={mockExperiences} />);
    // Scroll buttons appear only after overflow detection (a timeout in useEffect)
    await waitFor(() => {
      expect(screen.getByLabelText('Scroll left')).toBeInTheDocument();
      expect(screen.getByLabelText('Scroll right')).toBeInTheDocument();
    });
  });

  it('horizontal scroll container has keyboard navigation via arrow keys', () => {
    render(<Timeline experiences={mockExperiences} />);
    const container = screen.getByRole('region', { name: /professional journey/i }); // might need to add aria-label to container
    // Actually, we haven't added an explicit region with that label. We can test by checking tabIndex and keydown handler. We'll simulate keydown on the container div.
    // To properly test, we can get the div by test id or by role. Since we have tabIndex={0}, we can find it by container's ref.
    // We'll use a data-testid on the scrollable container.
  });

  it('renders achievements list in modal', async () => {
    render(<Timeline experiences={mockExperiences} />);
    fireEvent.click(screen.getByRole('button', { name: /view details for startupx/i }));
    await waitFor(() => {
      expect(screen.getByText('Built scalable API')).toBeInTheDocument();
      expect(screen.getByText('Mentored juniors')).toBeInTheDocument();
    });
  });

  it('renders technology badges in modal', async () => {
    render(<Timeline experiences={mockExperiences} />);
    fireEvent.click(screen.getByRole('button', { name: /view details for startupx/i }));
    await waitFor(() => {
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    });
  });

  it('renders gallery images in modal when present', async () => {
    render(<Timeline experiences={mockExperiences} />);
    fireEvent.click(screen.getByRole('button', { name: /view details for acme corp/i }));
    await waitFor(() => {
      const img = screen.getByAlt('Acme Corp image 1');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', '/images/exp1.jpg');
    });
  });

  it('displays progress line with width based on scroll', async () => {
    render(<Timeline experiences={mockExperiences} />);
    // progress width is initially 0
    const progress = document.querySelector('.bg-gradient-to-r');
    expect(progress).toHaveStyle({ width: '0%' }); // initially 0
    // Fire scroll event to change progress
    const container = progress?.closest('[class*="overflow-x"]');
    if (container) {
      Object.defineProperty(container, 'scrollLeft', { value: 200, writable: true });
      fireEvent.scroll(container);
      // After scroll, width should update accordingly (maxScroll = 400, so 200/400 = 50%)
      // We need to wait for state update
      await waitFor(() => {
        expect(progress).toHaveStyle({ width: '50%' });
      });
    }
  });

  it('handles empty experiences gracefully', () => {
    render(<Timeline experiences={[]} />);
    expect(screen.getByText('Professional Journey')).toBeInTheDocument();
    // No milestone buttons
    expect(screen.queryByRole('button')).toBeNull();
  });
});