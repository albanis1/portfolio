import Link from 'next/link';

interface ProjectFiltersProps {
  categories: string[];
  selected?: string;
}

export default function ProjectFilters({ categories, selected }: ProjectFiltersProps) {
  return (
    <nav aria-label="Project categories" className="flex flex-wrap gap-2 justify-center mb-8">
      <Link
        href="/projects"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
          ${!selected ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`/projects?category=${encodeURIComponent(cat)}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${selected === cat ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
        >
          {cat.charAt(0).toUpperCase() + cat.slice(1)}
        </Link>
      ))}
    </nav>
  );
}