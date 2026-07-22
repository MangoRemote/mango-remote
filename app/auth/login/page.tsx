'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      setError('Check your email to confirm your account.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="auth-page">
      <h1>{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
      <p>{mode === 'login' ? 'Access your MangoRemote account.' : 'Start finding Asia-friendly remote jobs.'}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 8, padding: '10px 0', textAlign: 'center' }} disabled={loading}>
          {loading ? 'Loading...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>

      <p style={{ marginTop: 20, fontSize: 13.5, color: 'var(--muted)', textAlign: 'center' }}>
        {mode === 'login' ? (
          <>No account? <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontWeight: 500, fontSize: 13.5 }}>Sign up</button></>
        ) : (
          <>Have an account? <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontWeight: 500, fontSize: 13.5 }}>Sign in</button></>
        )}
      </p>
    </div>
  )
}
