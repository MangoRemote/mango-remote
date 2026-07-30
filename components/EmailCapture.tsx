'use client'

import { useState } from 'react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setDone(true)
    setLoading(false)
  }

  return (
    <div className="email-capture">
      <div className="email-capture-inner">
        <div className="email-capture-text">
          <strong>Get weekly remote jobs in your inbox</strong>
          <p>Free. No spam. Unsubscribe anytime.</p>
        </div>
        {done ? (
          <p className="email-capture-done">You&apos;re on the list.</p>
        ) : (
          <form onSubmit={handleSubmit} className="email-capture-form">
            <input
              type="email"
              className="email-capture-input"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
