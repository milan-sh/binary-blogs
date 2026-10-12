import { AppwriteException } from 'appwrite'

export { cn } from 'cn'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatDate(date: string) {
  return dateFormatter.format(new Date(date))
}

export function htmlToText(html: string) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

export function excerpt(html: string, maxLength = 150) {
  const text = htmlToText(html)
  if (text.length <= maxLength) return text
  return `${text.slice(0, text.lastIndexOf(' ', maxLength) || maxLength).trimEnd()}…`
}

export function readingTime(html: string) {
  const words = htmlToText(html).split(' ').filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

// Appwrite document ids allow at most 36 chars and must start with a letter or digit
export const SLUG_MAX_LENGTH = 36

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z\d]+/g, '-')
    .replace(/^-+/, '')
    .slice(0, SLUG_MAX_LENGTH)
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function getErrorMessage(error: unknown) {
  if (error instanceof AppwriteException || error instanceof Error) {
    return error.message
  }
  return 'Something went wrong. Please try again.'
}

// Shared by the editor and the published post so both render identically
export const proseClasses =
  'prose prose-neutral max-w-none dark:prose-invert prose-headings:font-heading prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-lg prose-pre:border prose-pre:bg-muted prose-pre:text-foreground'
