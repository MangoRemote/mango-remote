'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef } from 'react'
import type { Category } from '@/lib/types'

interface Props {
  categories: Category[]
  currentParams: { q?: string; category?: string; type?: string; region?: string; asia?: string }
}

export default function JobFilters({ categories, currentParams }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/jobs?${params.toString()}`)
  }, [router, searchParams])

  const updateDebounced = useCallback((key: string, value: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => update(key, value), 400)
  }, [update])

  return (
    <div className="filter-bar">
      <input
        type="search"
        className="search-input"
        placeholder="Search jobs..."
        defaultValue={currentParams.q || ''}
        onChange={e => updateDebounced('q', e.target.value)}
      />

      <select
        className="filter-select"
        value={currentParams.category || ''}
        onChange={e => update('category', e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map(c => (
          <option key={c.id} value={c.slug}>{c.name}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={currentParams.type || ''}
        onChange={e => update('type', e.target.value)}
      >
        <option value="">All types</option>
        <option value="full-time">Full-time</option>
        <option value="contract">Contract</option>
        <option value="part-time">Part-time</option>
      </select>

      <select
        className="filter-select"
        value={currentParams.asia || ''}
        onChange={e => update('asia', e.target.value)}
      >
        <option value="">All regions</option>
        <option value="1">🌏 Asia-friendly only</option>
      </select>
    </div>
  )
}
