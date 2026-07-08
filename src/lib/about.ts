import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface AboutData {
  name: string
  title: string
  summary: string
  specialization: string
  yearsOfExperience: number
  currentPosition: string
  interests: string[]
  careerGoals: string
  socialLinks: {
    github?: string
    linkedin?: string
    email?: string
  }
}

const contentDirectory = path.join(process.cwd(), 'content')

/**
 * Membaca dan memvalidasi file `about.md`.
 * Hanya boleh digunakan di server components / API routes.
 */
export function getAboutData(): AboutData {
  const filePath = path.join(contentDirectory, 'about.md')
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`File about.md tidak ditemukan di ${filePath}`)
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(fileContent)

  // Validasi minimal
  const requiredFields: (keyof AboutData)[] = [
    'name', 'title', 'summary', 'specialization',
    'yearsOfExperience', 'currentPosition', 'interests', 'careerGoals'
  ]

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`Field ${field} wajib ada di frontmatter about.md`)
    }
  }

  // Pastikan interests array string
  if (!Array.isArray(data.interests)) {
    throw new Error('Field "interests" harus berupa array string')
  }

  return {
    name: data.name,
    title: data.title,
    summary: data.summary,
    specialization: data.specialization,
    yearsOfExperience: Number(data.yearsOfExperience),
    currentPosition: data.currentPosition,
    interests: data.interests,
    careerGoals: data.careerGoals,
    socialLinks: {
      github: data.socialLinks?.github,
      linkedin: data.socialLinks?.linkedin,
      email: data.socialLinks?.email,
    },
  }
}