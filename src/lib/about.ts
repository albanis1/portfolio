import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface AboutData {
  name: string;
  title: string;
  subtitle: string;
  heroCta: string[];
}

const contentDirectory = path.join(process.cwd(), 'content');

export function getAboutData(): AboutData {
  const fullPath = path.join(contentDirectory, 'about.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data } = matter(fileContents);

  // Validasi sederhana: pastikan field yang diperlukan ada
  if (!data.name || !data.title || !data.subtitle || !Array.isArray(data.heroCta)) {
    throw new Error('Invalid about.md frontmatter: missing required fields');
  }

  return {
    name: data.name,
    title: data.title,
    subtitle: data.subtitle,
    heroCta: data.heroCta,
  };
}