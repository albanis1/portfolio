import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Experience {
  slug: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  achievements: string[];
  technologies: string[];
  images: string[];
  description?: string;
}

const experienceDirectory = path.join(process.cwd(), 'content', 'experience');

function slugify(filename: string): string {
  return filename.replace(/\.md$/, '');
}

function validateExperience(frontmatter: Record<string, unknown>): Omit<Experience, 'slug'> {
  const { company, position, startDate, endDate, achievements, technologies, images, description } = frontmatter;

  if (typeof company !== 'string' || !company.trim()) {
    throw new Error('Missing or invalid "company" in experience markdown');
  }
  if (typeof position !== 'string' || !position.trim()) {
    throw new Error('Missing or invalid "position" in experience markdown');
  }
  if (typeof startDate !== 'string' || !startDate.trim()) {
    throw new Error('Missing or invalid "startDate" in experience markdown');
  }

  // Optional defaults
  const safeEndDate = typeof endDate === 'string' ? endDate : undefined;
  const safeAchievements = Array.isArray(achievements) ? achievements.filter((a: unknown) => typeof a === 'string') as string[] : [];
  const safeTechnologies = Array.isArray(technologies) ? technologies.filter((t: unknown) => typeof t === 'string') as string[] : [];
  const safeImages = Array.isArray(images) ? images.filter((i: unknown) => typeof i === 'string') as string[] : [];
  const safeDescription = typeof description === 'string' ? description : undefined;

  return {
    company: company.trim(),
    position: position.trim(),
    startDate: startDate.trim(),
    endDate: safeEndDate,
    achievements: safeAchievements,
    technologies: safeTechnologies,
    images: safeImages,
    description: safeDescription,
  };
}

export async function getAllExperiences(): Promise<Experience[]> {
  let filenames: string[];
  try {
    filenames = fs.readdirSync(experienceDirectory);
  } catch (error) {
    // directory doesn't exist or other I/O error -> return empty
    return [];
  }

  const experiences: Experience[] = [];
  for (const filename of filenames) {
    if (!filename.endsWith('.md')) continue;

    const filePath = path.join(experienceDirectory, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);

    try {
      const validated = validateExperience(frontmatter);
      experiences.push({
        ...validated,
        slug: slugify(filename),
        description: validated.description || content?.trim() || undefined,
      });
    } catch (error) {
      console.error(`Skipping invalid experience file "${filename}":`, error);
      // skip invalid file, continue with rest
    }
  }

  // Sort by startDate ascending (oldest first)
  experiences.sort((a, b) => (a.startDate < b.startDate ? -1 : 1));
  return experiences;
}