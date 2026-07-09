'use client';

import Modal from '../ui/Modal';
import type { Skill } from '@/lib/skills';

interface SkillModalProps {
  skill: Skill | null;
  onClose: () => void;
}

export default function SkillModal({ skill, onClose }: SkillModalProps) {
  if (!skill) return null;

  return (
    <Modal isOpen={!!skill} onClose={onClose}>
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{skill.name}</h3>
      <div className="space-y-2 text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-4">
          <span className="font-medium">Level:</span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`h-2 w-6 rounded-full ${i < skill.level ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
          </div>
        </div>
        <p>
          <span className="font-medium">Pengalaman:</span> {skill.years} tahun
        </p>
        <p>
          <span className="font-medium">Proyek:</span> {skill.projects} proyek
        </p>
        <p className="mt-4 text-sm">{skill.description}</p>
      </div>
      <button
        onClick={onClose}
        className="mt-6 w-full py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        Tutup
      </button>
    </Modal>
  );
}