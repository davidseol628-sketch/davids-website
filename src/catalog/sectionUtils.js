export function displaySectionTitle(title) {
  if (!title || typeof title !== 'string') return title

  const normalized = title.trim().toLowerCase()
  if (normalized === 'geometry lab') return '3-D Printing'
  if (normalized === 'algebra boost') return 'Environmental Science'

  return title
}
