'use client'

import { useState } from 'react'

export default function EmployerPreview() {
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')

  return (
    <section className="emp-preview">
      <h2>See how your listing looks</h2>
      <p className="emp-preview-hint">Type a few details. This is a preview only, nothing is saved.</p>
      <div className="emp-preview-fields">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Job title" aria-label="Job title" />
        <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Company" aria-label="Company" />
        <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Location, e.g. Singapore" aria-label="Location" />
      </div>
      <div className="emp-preview-card">
        <div className="emp-preview-title">{title || 'Your job title'}</div>
        <div className="emp-preview-company">{company || 'Company name'}</div>
        <div className="emp-preview-tags">
          <span className="tag">{location || 'Location'}</span>
          <span className="tag">Full-time</span>
        </div>
      </div>
    </section>
  )
}
