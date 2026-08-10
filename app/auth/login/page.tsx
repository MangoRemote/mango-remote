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
  const [mode, setMode] = useState<'login' | 'reset'>('login')
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/set-password`,
      })
      if (error) { setError(error.message); setLoading(false); return }
      setResetSent(true)
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Incorrect email or password.'); setLoading(false); return }
    router.push('/account')
    router.refresh()
  }

  if (resetSent) {
    return (
      <div className="auth-layout">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1>Check your email</h1>
            <p>We've sent a password reset link to <strong>{email}</strong>. Click the link to set a new password.</p>
          </div>
          <button className="btn-primary auth-submit" onClick={() => { setMode('login'); setResetSent(false) }}>
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-layout">
      <div className="auth-form-wrap">
        <div className="auth-form-header">
          <h1>{mode === 'login' ? 'Sign in' : 'Reset password'}</h1>
          <p>
            {mode === 'login'
              ? <>Sign in to your MangoRemote account. New here? <a href="/premium" style={{color:'var(--accent)', fontWeight:500}}>Get Premium →</a></>
              : "Enter your email and we'll send you a reset link."
            }
          </p>
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
          {mode === 'login' && (
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
          )}
          {error && <div className="form-error">{error}</div>}
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? '...' : mode === 'login' ? 'Sign in' : 'Send reset link'}
          </button>
        </form>
        <p style={{marginTop:16, fontSize:13, color:'var(--muted)', textAlign:'center'}}>
          {mode === 'login'
            ? <><span>Forgot your password? </span><button onClick={() => setMode('reset')} style={{color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontSize:13}}>Reset it</button></>
            : <button onClick={() => setMode('login')} style={{color:'var(--accent)', background:'none', border:'none', cursor:'pointer', fontSize:13}}>Back to sign in</button>
          }
        </p>
      </div>
    </div>
  )
}
