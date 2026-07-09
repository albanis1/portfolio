import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Skill {
  name: string;
  level: number;     // 1-5
  years: number;
  projects: number;
  description: string;
}

interface SkillsFrontmatter {
  skills: Skill[];
}

/**
 * Membaca dan memparsing file skills.md, mengembalikan array Skill.
 * Hanya dapat dipanggil di server (Node.js runtime).
 */
export async function getSkills(): Promise<Skill[]> {
  try {
    const filePath = path.join(process.cwd(), 'content', 'skills.md');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(raw);
    const frontmatter = data as SkillsFrontmatter;

    if (!frontmatter.skills || !Array.isArray(frontmatter.skills)) {
      console.warn('Invalid skills frontmatter, returning empty array');
      return [];
    }

    // validasi minimal setiap skill
    return frontmatter.skills.filter(
      (skill) =>
        typeof skill.name === 'string' &&
        typeof skill.level === 'number' &&
        typeof skill.years === 'number' &&
        typeof skill.projects === 'number' &&
        typeof skill.description === 'string',
    );
  } catch (error) {
    console.error('Error reading skills.md:', error);
    return [];
  }
}