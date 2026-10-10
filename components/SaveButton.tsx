'use client'

import { useState } from 'react'

interface Props {
  jobId: string
  initialSaved: boolean
}

export default function SaveButton({ jobId, initialSaved }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    const method = saved ? 'DELETE' : 'POST'
    const res = await fetch('/api/saved-jobs', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: jobId }),
    })
    if (res.ok) setSaved(!saved)
    else alert('Could not update your saved jobs. Please try again.')
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="save-btn"
      title={saved ? 'Remove from saved' : 'Save job'}
      aria-label={saved ? 'Remove from saved' : 'Save job'}
    >
      {saved ? '★' : '☆'}
    </button>
  )
}
