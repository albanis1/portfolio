import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface HeroCtaItem {
  label: string
  action: 'scroll-to-about' | 'download-resume' | 'scroll-to-contact'
  variant: 'primary' | 'secondary' | 'accent'
}

export interface AboutData {
  name: string
  title: string
  // Data untuk Hero section
  subtitle: string
  heroCta: HeroCtaItem[]
  // Data untuk kartu "Tentang Saya"
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

  // Validasi minimal field wajib
  const requiredFields: (keyof AboutData)[] = [
    'name', 'title', 'subtitle', 'summary', 'specialization',
    'yearsOfExperience', 'currentPosition', 'interests', 'careerGoals'
  ]

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      throw new Error(`Field ${field} wajib ada di frontmatter about.md`)
    }
  }

  // Validasi tipe data yearsOfExperience sebagai number
  const years = Number(data.yearsOfExperience)
  if (isNaN(years)) {
    throw new Error('Field yearsOfExperience harus berupa angka')
  }

  // Pastikan interests array string
  if (!Array.isArray(data.interests)) {
    throw new Error('Field "interests" harus berupa array string')
  }

  // Validasi & normalisasi heroCta
  if (!Array.isArray(data.heroCta)) {
    throw new Error('Field "heroCta" harus berupa array')
  }

  const validActions = ['scroll-to-about', 'download-resume', 'scroll-to-contact']
  const validVariants = ['primary', 'secondary', 'accent']
  const heroCta: HeroCtaItem[] = data.heroCta.map((item: any) => {
    if (!item.label || !item.action || !item.variant) {
      throw new Error('Invalid heroCta item: each must have label, action, variant')
    }
    if (!validActions.includes(item.action)) {
      throw new Error(`Invalid action in heroCta: ${item.action}`)
    }
    if (!validVariants.includes(item.variant)) {
      throw new Error(`Invalid variant in heroCta: ${item.variant}`)
    }
    return {
      label: item.label,
      action: item.action as HeroCtaItem['action'],
      variant: item.variant as HeroCtaItem['variant'],
    }
  })

  return {
    name: data.name,
    title: data.title,
    subtitle: data.subtitle,
    heroCta,
    summary: data.summary,
    specialization: data.specialization,
    yearsOfExperience: years,
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
