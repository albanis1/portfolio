import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

export interface ProjectMeta {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  demoUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

export interface ProjectDetail extends ProjectMeta {
  contentHtml: string;
  images: string[];
}

const projectsDirectory = path.join(process.cwd(), 'content', 'projects');

/**
 * Read and parse all markdown project files, optionally filtered by category.
 * @param category optional category filter (exact match)
 * @returns array of ProjectMeta objects sorted by featured then date (not implemented but by order)
 */
export function getAllProjects(category?: string): ProjectMeta[] {
  if (!fs.existsSync(projectsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(projectsDirectory).filter(
    (fileName) => fileName.endsWith('.md')
  );

  const projects: ProjectMeta[] = fileNames.map((fileName) => {
    const fullPath = path.join(projectsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    // Basic validation and default values
    const project: ProjectMeta = {
      title: data.title ?? 'Untitled',
      slug: data.slug ?? slugify(data.title ?? fileName.replace('.md', '')),
      description: data.description ?? '',
      category: data.category ?? 'uncategorized',
      tags: Array.isArray(data.tags) ? data.tags : [],
      image: data.image ?? '/images/placeholder.png',
      demoUrl: data.demoUrl || undefined,
      repoUrl: data.repoUrl || undefined,
      featured: !!data.featured,
    };

    return project;
  });

  // sort: featured first, then by slug
  projects.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.slug.localeCompare(b.slug);
  });

  if (category) {
    return projects.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  return projects;
}

/**
 * Extract all unique categories from project files.
 */
export function getAllCategories(): string[] {
  const projects = getAllProjects();
  const categories = projects.map((p) => p.category);
  return Array.from(new Set(categories));
}

/**
 * Get a single project by slug.
 * @param slug project slug (from frontmatter)
 * @returns ProjectDetail or null if not found
 */
export async function getProjectBySlug(
  slug: string
): Promise<ProjectDetail | null> {
  if (!fs.existsSync(projectsDirectory)) {
    return null;
  }

  const fileNames = fs.readdirSync(projectsDirectory);
  let fileContent = '';
  let matchedFile = '';

  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;
    const fullPath = path.join(projectsDirectory, fileName);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(content);
    if (data.slug === slug || slugify(data.title ?? '') === slug) {
      fileContent = content;
      matchedFile = fileName;
      break;
    }
  }

  if (!matchedFile) {
    return null;
  }

  const { data, content: rawContent } = matter(fileContent);

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize) // prevent XSS
    .use(rehypeStringify)
    .process(rawContent);

  const contentHtml = processedContent.toString();

  const detail: ProjectDetail = {
    title: data.title ?? 'Untitled',
    slug: data.slug ?? slugify(data.title ?? matchedFile.replace('.md', '')),
    description: data.description ?? '',
    category: data.category ?? 'uncategorized',
    tags: Array.isArray(data.tags) ? data.tags : [],
    image: data.image ?? '/images/placeholder.png',
    images: Array.isArray(data.images) ? data.images : [],
    demoUrl: data.demoUrl || undefined,
    repoUrl: data.repoUrl || undefined,
    featured: !!data.featured,
    contentHtml,
  };

  return detail;
}

/**
 * Get all project slugs for static generation.
 */
export function getAllProjectSlugs(): string[] {
  const fileNames = fs.existsSync(projectsDirectory)
    ? fs.readdirSync(projectsDirectory).filter((f) => f.endsWith('.md'))
    : [];

      const slugs: string[] = [];
  fileNames.forEach((fileName) => {
    const fullPath = path.join(projectsDirectory, fileName);
    const content = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(content);
    slugs.push(data.slug ?? slugify(data.title ?? fileName.replace('.md', '')));
  });
  return slugs;
}

// Helper: create a slug from a string
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}