import { getSkills } from '@/lib/skills';
import SkillsGalaxy from './SkillsGalaxy';

/**
 * Server component yang mengambil data skill dari Markdown
 * dan meneruskannya ke client component SkillsGalaxy.
 */
export default async function SkillsGalaxyServer() {
  const skills = await getSkills();

  return (
    <section className="py-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
        Skills &amp; Teknologi
      </h2>
      {skills.length === 0 ? (
        <p className="text-center text-gray-400 dark:text-gray-500">
          Data skill tidak tersedia. Pastikan file <code>content/skills.md</code> terisi dengan benar.
        </p>
      ) : (
        <SkillsGalaxy skills={skills} />
      )}
    </section>
  );
}