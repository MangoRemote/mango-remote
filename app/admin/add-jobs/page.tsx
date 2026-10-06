'use client'

import { useState } from 'react'

export default function AddJobsPage() {
  const [jobsJson, setJobsJson] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const jobs = JSON.parse(jobsJson)
      if (!Array.isArray(jobs)) throw new Error('Jobs must be an array')

      const response = await fetch('/api/add-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobs })
      })

      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Failed to add jobs')
      } else {
        setResult(data)
        setJobsJson('')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 28px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>Add Jobs</h1>

      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px' }}>
          Paste job data as JSON:
        </label>
        <textarea
          value={jobsJson}
          onChange={e => setJobsJson(e.target.value)}
          placeholder='[{"title": "...", "slug": "...", ...}]'
          style={{
            width: '100%',
            height: '400px',
            padding: '12px',
            fontFamily: 'monospace',
            fontSize: '13px',
            border: '1px solid #E8EAED',
            borderRadius: '6px',
            resize: 'vertical'
          }}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !jobsJson.trim()}
        style={{
          background: '#F26419',
          color: '#fff',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '6px',
          fontSize: '15px',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading || !jobsJson.trim() ? 0.6 : 1
        }}
      >
        {loading ? 'Adding...' : 'Add Jobs'}
      </button>

      {error && (
        <div style={{ marginTop: '24px', padding: '16px', background: '#FEE2E2', color: '#7F1D1D', borderRadius: '6px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '24px', padding: '16px', background: '#ECFDF5', color: '#065F46', borderRadius: '6px' }}>
          <strong>Success!</strong> Added {result.added} jobs:
          <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
            {result.jobs?.map((title: string, i: number) => (
              <li key={i}>{title}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: '48px', padding: '24px', background: '#F9FAFB', borderRadius: '10px', border: '1px solid #E8EAED' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>Example format:</h2>
        <pre style={{ fontSize: '12px', overflow: 'auto', background: '#fff', padding: '12px', borderRadius: '4px', border: '1px solid #E8EAED' }}>
{`[
  {
    "title": "Job Title",
    "slug": "job-title-company",
    "description": "Job description...",
    "apply_url": "https://example.com/apply",
    "employment_type": "Full-time",
    "region_tags": ["Remote", "Asia"],
    "asia_friendly": true,
    "status": "live",
    "source": "job_board_submission"
  }
]`}
        </pre>
      </div>
    </main>
  )
}
