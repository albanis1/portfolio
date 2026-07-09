import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Skill {
  name: string;
  level: number;      // 1-5
  years: number;
  projects: number;
  description: string;
  category: string;
}

interface SkillsFrontmatter {
  skills: Skill[];
}

/**
 * Validasi struktur skill dari frontmatter.
 * Mengembalikan array Skill yang valid, atau array kosong jika tidak valid.
 */
function validateSkills(data: unknown): Skill[] {
  if (!data || typeof data !== 'object' || !('skills' in data)) {
    return [];
  }
  const { skills } = data as Record<string, unknown>;
  if (!Array.isArray(skills)) return [];

  return skills.filter((item: unknown): item is Skill => {
    if (typeof item !== 'object' || item === null) return false;
    const s = item as Record<string, unknown>;
    return (
      typeof s.name === 'string' &&
      typeof s.level === 'number' && s.level >= 1 && s.level <= 5 &&
      typeof s.years === 'number' &&
      typeof s.projects === 'number' &&
      typeof s.description === 'string' &&
      typeof s.category === 'string'
    );
  });
}

/**
 * Membaca file skills.md dari direktori content/ dan mengembalikan array Skill.
 * Jika file tidak ditemukan atau format salah, return array kosong.
 */
export async function getSkills(): Promise<Skill[]> {
  const filePath = path.join(process.cwd(), 'content', 'skills.md');

  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
  } catch {
    console.warn(`Skills file not found at ${filePath}`);
    return [];
  }

  const raw = await fs.promises.readFile(filePath, 'utf-8');
  const parsed = matter(raw);
  const skills = validateSkills(parsed.data);

  if (skills.length === 0) {
    console.warn('No valid skills found in content/skills.md');
  }

  return skills;
}

// Ekspor lain jika dibutuhkan untuk testing atau SSG
export { validateSkills };