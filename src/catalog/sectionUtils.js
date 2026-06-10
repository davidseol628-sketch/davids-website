export function displaySectionTitle(title) {
  if (!title || typeof title !== 'string') return title
  return title.trim().toLowerCase() === 'geometry lab' ? '3-D Printing' : title
}
