'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Nav() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <span className="nav-logo-emoji">🥭</span>
        <span className="logo-mango">Mango</span><span className="logo-remote">Remote</span>
      </Link>

      <div className="nav-links">
        <Link href="/jobs">Remote Jobs</Link>
        <Link href="/post-a-job">Post a Job</Link>
        <Link href="/about">About</Link>
      </div>

      <div className="nav-actions">
        {ready && user ? (
          <>
            <Link href="/account" className="btn-nav-plain">My Account</Link>
            <button className="btn-ghost" onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signOut()
              window.location.href = '/'
            }}>Sign out</button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="btn-nav-plain">Sign in</Link>
            <Link href="/premium" className="btn-primary">Unlock All Jobs</Link>
          </>
        )}
      </div>
    </nav>
  )
}
