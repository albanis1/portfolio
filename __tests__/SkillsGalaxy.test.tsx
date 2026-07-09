import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkillsGalaxy from '@/components/skills/SkillsGalaxy';
import type { Skill } from '@/lib/skills';
import '@testing-library/jest-dom';

// Mock data skill (minimal 8 untuk memenuhi acceptance criteria)
const mockSkills: Skill[] = [
  { name: 'React', level: 5, years: 5, projects: 15, description: 'React deskripsi' },
  { name: 'Node.js', level: 4, years: 4, projects: 12, description: 'Node deskripsi' },
  { name: 'Go', level: 3, years: 2, projects: 5, description: 'Go deskripsi' },
  { name: 'Docker', level: 4, years: 3, projects: 18, description: 'Docker deskripsi' },
  { name: 'Kubernetes', level: 3, years: 2, projects: 6, description: 'K8s deskripsi' },
  { name: 'PostgreSQL', level: 4, years: 5, projects: 16, description: 'Postgres deskripsi' },
  { name: 'Redis', level: 3, years: 3, projects: 10, description: 'Redis deskripsi' },
  { name: 'AWS', level: 3, years: 3, projects: 14, description: 'AWS deskripsi' },
  { name: 'CI/CD', level: 4, years: 4, projects: 22, description: 'CI/CD deskripsi' },
];

describe('SkillsGalaxy', () => {
  it('merender setidaknya 8 planet dari data skills', () => {
    render(<SkillsGalaxy skills={mockSkills} />);
    // Setiap planet dirender sebagai tombol dengan aria-label
    mockSkills.forEach((skill) => {
      expect(
        screen.getByRole('button', {
          name: `${skill.name} - Level ${skill.level}, ${skill.years} tahun pengalaman`,
        }),
      ).toBeInTheDocument();
    });
  });

  it('menampilkan tooltip saat hover planet', async () => {
    const user = userEvent.setup();
    render(<SkillsGalaxy skills={mockSkills} />);

    const planetButton = screen.getByRole('button', { name: /React - Level 5.*/ });
    await user.hover(planetButton);

    // Tooltip harus muncul dengan data yang benar
    expect(screen.getByText('Level 5/5 · 5 tahun')).toBeInTheDocument();
  });

  it('menyembunyikan tooltip saat mouse meninggalkan planet', async () => {
    const user = userEvent.setup();
    render(<SkillsGalaxy skills={mockSkills} />);
    const planetButton = screen.getByRole('button', { name: /React - Level 5.*/ });
    await user.hover(planetButton);
    expect(screen.getByText(/Level 5\/5/)).toBeInTheDocument();

    await user.unhover(planetButton);
    // Tooltip seharusnya menghilang (waitFor untuk animasi exit)
    await waitFor(() => {
      expect(screen.queryByText(/Level 5\/5/)).not.toBeInTheDocument();
    });
  });

  it('membuka modal detail saat planet diklik', async () => {
    const user = userEvent.setup();
    render(<SkillsGalaxy skills={mockSkills} />);
    const planetButton = screen.getByRole('button', { name: /Node\.js - Level 4.*/ });

    await user.click(planetButton);

    // Modal muncul
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Node deskripsi')).toBeInTheDocument();
    expect(screen.getByText('4 tahun')).toBeInTheDocument();
    expect(screen.getByText('12 proyek')).toBeInTheDocument();
  });

  it('menutup modal saat tombol tutup ditekan', async () => {
    const user = userEvent.setup();
    render(<SkillsGalaxy skills={mockSkills} />);
    const planetButton = screen.getByRole('button', { name: /Node\.js/ });
    await user.click(planetButton);
    expect(screen.getByText('Node.js')).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /Tutup/i }); // di dalam modal
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
    });
  });

  it('menutup modal dengan tombol Escape', async () => {
    const user = userEvent.setup();
    render(<SkillsGalaxy skills={mockSkills} />);
    const planetButton = screen.getByRole('button', { name: /Node\.js/ });
    await user.click(planetButton);
    expect(screen.getByText('Node.js')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Node.js')).not.toBeInTheDocument();
    });
  });

  it('menampilkan pesan jika data skill kosong', () => {
    render(<SkillsGalaxy skills={[]} />);
    expect(screen.getByText(/Belum ada data skill yang tersedia/i)).toBeInTheDocument();
  });

  it('tidak crash dengan data skill yang minimal (hanya 1 skill)', () => {
    const singleSkill = [mockSkills[0]];
    expect(() => render(<SkillsGalaxy skills={singleSkill} />)).not.toThrow();
    expect(screen.getByRole('button', { name: /React/ })).toBeInTheDocument();
  });
});