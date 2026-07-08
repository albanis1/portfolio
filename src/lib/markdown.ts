import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { HomeContent, Experience, Project, Skill } from './types';

const contentDir = path.join(process.cwd(), 'content');

function readMatter<T>(filename: string): T {
  const filePath = path.join(contentDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data } = matter(raw);
  return data as T;
}

export function getHomeContent(): HomeContent {
  return readMatter<HomeContent>('home.md');
}

export function getAllExperiences(): Experience[] {
  return readMatter<Experience[]>('experience.md');
}

export function getAllProjects(): Project[] {
  return readMatter<Project[]>('projects.md');
}

export function getAllSkills(): Skill[] {
  return readMatter<Skill[]>('skills.md');
}