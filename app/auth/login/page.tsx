'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Incorrect email or password. Premium members only.'); setLoading(false); return }
    router.push('/account')
    router.refresh()
  }

  return (
    <div className="auth-layout">
      <div className="auth-form-wrap">
        <div className="auth-form-header">
          <h1>Sign in</h1>
          <p>MangoRemote is for Premium members. <a href="/premium" style={{color:'var(--accent)', fontWeight:500}}>Not a member yet?</a></p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p style={{marginTop:16, fontSize:13, color:'var(--muted)', textAlign:'center'}}>
          Forgot your password? <a href="mailto:hello@mangoremote.com" style={{color:'var(--accent)'}}>Email us</a>
        </p>
      </div>
    </div>
  )
}
