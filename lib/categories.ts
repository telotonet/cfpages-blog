import fs from 'fs'
import path from 'path'
import type { CategoryMeta } from './types'

const CATEGORIES_DIR = path.join(process.cwd(), 'content/categories')

export function getAllCategories(): CategoryMeta[] {
  if (!fs.existsSync(CATEGORIES_DIR)) return []

  return fs
    .readdirSync(CATEGORIES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((filename): CategoryMeta => {
      const raw = fs.readFileSync(path.join(CATEGORIES_DIR, filename), 'utf-8')
      return JSON.parse(raw) as CategoryMeta
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getCategoryBySlug(slug: string): CategoryMeta | null {
  const filePath = path.join(CATEGORIES_DIR, `${slug}.json`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as CategoryMeta
}

export function getAllCategorySlugs(): string[] {
  if (!fs.existsSync(CATEGORIES_DIR)) return []
  return fs
    .readdirSync(CATEGORIES_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
}
