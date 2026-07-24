'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Nav() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
  }

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <span className="nav-logo-mark">M</span>
        <span className="logo-mango">Mango</span><span className="logo-remote">Remote</span>
      </Link>

      <div className="nav-links">
        <Link href="/jobs">Jobs</Link>
        <Link href="/post-a-job">Post a Job</Link>
        <Link href="/done-for-you">Done For You</Link>
        <Link href="/about">About</Link>
      </div>

      <div className="nav-actions">
        {user ? (
          <>
            <Link href="/admin" className="btn-ghost">Dashboard</Link>
            <button className="btn-ghost" onClick={handleSignOut}>Sign out</button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="btn-ghost">Sign in</Link>
            <Link href="/premium" className="btn-primary">Go Premium</Link>
          </>
        )}
      </div>
    </nav>
  )
}
