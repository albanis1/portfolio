export interface HomeContent {
  name: string;
  role: string;
  summary: string;
  featuredProjects: string[];
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  employmentType: string;
  responsibilities: string[];
  relatedProjects: string[];
  skills: string[];
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  link?: string;
  featured: boolean;
}

export type Skill = string;