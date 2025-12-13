import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert Vietnamese text to URL-friendly slug
 * Handles Vietnamese accents: "Thám Tử Conan" -> "tham-tu-conan"
 */
export function toSlug(str: string): string {
  // Convert to lowercase
  let slug = str.toLowerCase().trim()
  
  // Vietnamese character map
  const from = "àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ"
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiioooooooooooooooooouuuuuuuuuuuyyyyyd"
  
  // Replace Vietnamese characters
  for (let i = 0; i < from.length; i++) {
    slug = slug.replace(new RegExp(from[i], 'g'), to[i])
  }
  
  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-')
  
  // Remove special characters (keep only letters, numbers, and hyphens)
  slug = slug.replace(/[^a-z0-9-]/g, '')
  
  // Remove consecutive hyphens
  slug = slug.replace(/-+/g, '-')
  
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, '')
  
  return slug
}
