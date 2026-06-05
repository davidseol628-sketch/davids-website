/**
 * Map the Postgres exception messages raised by the enroll_student /
 * drop_student RPCs (errcode P0001) to friendly, user-facing strings.
 *
 * The RPCs raise: not_authorized, not_found, not_published, already_enrolled,
 * full. supabase-js surfaces the raised message on `error.message`.
 */
const MESSAGES = {
  not_authorized: "You're not allowed to do that.",
  not_found: 'That section no longer exists.',
  not_published: 'That section is not open for enrollment.',
  already_enrolled: 'This child is already enrolled in that section.',
  full: 'That section is full.',
}

export function rpcErrorMessage(error, fallback = 'Something went wrong.') {
  if (!error) return fallback
  const raw = (error.message || '').toLowerCase()
  for (const key of Object.keys(MESSAGES)) {
    if (raw.includes(key)) return MESSAGES[key]
  }
  return error.message || fallback
}
