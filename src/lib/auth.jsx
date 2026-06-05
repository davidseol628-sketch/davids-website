/* eslint-disable react-refresh/only-export-components -- AuthProvider, useAuth, and RequireAuth intentionally live together per the plan's file layout. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from './supabase'

const AuthContext = createContext(null)

/**
 * Resolve an auth.users.id to its app role + profile row by checking which of
 * parents / tutors / admins contains it. A given auth user belongs to exactly
 * one of these tables; that table determines the role.
 *
 * Order: admins first (most privileged), then tutor, then parent.
 * Returns { role, profile } or { role: null, profile: null } if no row found.
 */
async function resolveRole(userId) {
  if (!supabase || !userId) return { role: null, profile: null }

  // admins
  {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) console.error('resolveRole(admins):', error.message)
    if (data) return { role: 'admin', profile: data }
  }

  // tutors
  {
    const { data, error } = await supabase
      .from('tutors')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) console.error('resolveRole(tutors):', error.message)
    if (data) return { role: 'tutor', profile: data }
  }

  // parents
  {
    const { data, error } = await supabase
      .from('parents')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) console.error('resolveRole(parents):', error.message)
    if (data) return { role: 'parent', profile: data }
  }

  return { role: null, profile: null }
}

/**
 * AuthProvider holds the current Supabase session, the resolved app user
 * (the matching row in parents/tutors/admins), and the derived role.
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null) // 'parent' | 'tutor' | 'admin' | null
  const [profile, setProfile] = useState(null)
  // If Supabase isn't configured we have nothing to resolve, so start ready.
  const [loading, setLoading] = useState(() => Boolean(supabase))

  // Re-fetch a user's role/profile. Exposed so callers can refresh after, e.g.,
  // a signup inserts the matching parents/tutors row, or right after a login.
  // Pass `explicitUid` to resolve a specific user (e.g. the one just returned by
  // signInWithPassword) without depending on possibly-stale session state.
  const refreshProfile = useCallback(async (explicitUid) => {
    // Prefer the caller-supplied uid; otherwise read the freshest one we can.
    // The `session` state may lag right after a sign-in (onAuthStateChange is
    // async), so fall back to getSession().
    let uid = explicitUid || session?.user?.id
    if (!uid && supabase) {
      const { data } = await supabase.auth.getSession()
      uid = data?.session?.user?.id
    }
    if (!uid) {
      setRole(null)
      setProfile(null)
      return { role: null, profile: null }
    }
    const { role: r, profile: p } = await resolveRole(uid)
    setRole(r)
    setProfile(p)
    return { role: r, profile: p }
  }, [session?.user?.id])

  useEffect(() => {
    if (!supabase) return

    let active = true
    // The uid whose role/profile is currently authoritative. Async resolutions
    // that finish after the session has moved on (e.g. an overlapping/stale
    // session) are ignored so they can't clobber the current user's role.
    let currentUid = null

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      const next = data?.session ?? null
      currentUid = next?.user?.id ?? null
      setSession(next)
      if (next?.user?.id) {
        const { role: r, profile: p } = await resolveRole(next.user.id)
        if (!active || currentUid !== next.user.id) return
        setRole(r)
        setProfile(p)
      }
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, next) => {
      if (!active) return
      currentUid = next?.user?.id ?? null
      setSession(next ?? null)
      if (next?.user?.id) {
        const { role: r, profile: p } = await resolveRole(next.user.id)
        if (!active || currentUid !== next.user.id) return
        setRole(r)
        setProfile(p)
      } else {
        setRole(null)
        setProfile(null)
      }
    })

    return () => {
      active = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      role,
      profile,
      loading,
      refreshProfile,
      signOut: async () => {
        if (supabase) await supabase.auth.signOut()
        setSession(null)
        setRole(null)
        setProfile(null)
      },
    }),
    [session, role, profile, loading, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (ctx === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

/**
 * Route guard. Usage: <RequireAuth as="parent"><Dashboard /></RequireAuth>
 * - Redirects to /login if not authenticated (preserving intended location).
 * - If `as` is given, redirects home when the resolved role doesn't match.
 *   Omit `as` to require any authenticated user.
 */
export function RequireAuth({ as, children }) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (as && role !== as) {
    return <Navigate to="/" replace />
  }

  return children
}
