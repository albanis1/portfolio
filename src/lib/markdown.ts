import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'content');

/**
 * Membaca dan mem-parsing file Markdown dengan frontmatter.
 * @param subfolder Subfolder di dalam /content (misal 'projects', 'experience')
 * @param slug Nama file tanpa ekstensi
 * @returns Objek berisi data frontmatter dan konten HTML
 */
export async function getMarkdownContent(
  subfolder: string,
  slug: string,
): Promise<{ data: Record<string, unknown>; contentHtml: string }> {
  const fullPath = path.join(contentDirectory, subfolder, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    throw new Error(`File Markdown tidak ditemukan: ${fullPath}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html, { sanitize: true }).process(content);
  const contentHtml = processedContent.toString();

  return { data, contentHtml };
}

/**
 * Mendapatkan daftar semua slug file Markdown dalam subfolder.
 */
export function getMarkdownSlugs(subfolder: string): string[] {
  const dirPath = path.join(contentDirectory, subfolder);

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const fileNames = fs.readdirSync(dirPath);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}