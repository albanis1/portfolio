import { Metadata } from 'next';
import { getAllProjects, getAllCategories } from '@/lib/projects';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectFilters from '@/components/projects/ProjectFilters';

export const metadata: Metadata = {
  title: 'Projects | Developer Portfolio',
  description: 'Explore my featured projects across various technology domains.',
};

interface Props {
  searchParams?: { category?: string };
}

export default function ProjectsPage({ searchParams }: Props) {
  const category = searchParams?.category;
  const projects = getAllProjects(category);
  const categories = getAllCategories();

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-4">
        My Projects
      </h1>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
        A curated selection of projects that demonstrate my engineering capabilities.
      </p>

      <ProjectFilters categories={categories} selected={category} />

      {projects.length === 0 ? (
        <div className="text-center py-20">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            No projects found{category ? ` in "${category}"` : ''}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}