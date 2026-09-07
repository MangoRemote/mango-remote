'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef } from 'react'
import type { Category } from '@/lib/types'

interface Props {
  categories: Category[]
  currentParams: { q?: string; category?: string; type?: string; region?: string; asia?: string; country?: string; level?: string; posted?: string }
}

const ASIAN_COUNTRIES = [
  'Japan', 'Vietnam', 'Thailand', 'Indonesia', 'Philippines',
  'Malaysia', 'Singapore', 'South Korea', 'Taiwan', 'Hong Kong',
  'China', 'India', 'Cambodia', 'Myanmar', 'Sri Lanka',
]

const COUNTRY_FLAGS: Record<string, string> = {
  'Japan': '🇯🇵', 'Vietnam': '🇻🇳', 'Thailand': '🇹🇭', 'Indonesia': '🇮🇩',
  'Philippines': '🇵🇭', 'Malaysia': '🇲🇾', 'Singapore': '🇸🇬', 'South Korea': '🇰🇷',
  'Taiwan': '🇹🇼', 'Hong Kong': '🇭🇰', 'China': '🇨🇳', 'India': '🇮🇳',
  'Cambodia': '🇰🇭', 'Myanmar': '🇲🇲', 'Sri Lanka': '🇱🇰',
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
    // When switching region/country, clear the other
    if (key === 'country' && value) params.delete('asia')
    if (key === 'asia' && value) params.delete('country')
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
        value={currentParams.country || (currentParams.asia === '1' ? '_asia' : '')}
        onChange={e => {
          const v = e.target.value
          if (v === '_asia') update('asia', '1')
          else update('country', v)
        }}
      >
        <option value="">All regions</option>
        <option value="_asia">🌏 Asia / APAC</option>
        <optgroup label="── Countries ──">
          {ASIAN_COUNTRIES.map(c => (
            <option key={c} value={c}>{COUNTRY_FLAGS[c]} {c}</option>
          ))}
        </optgroup>
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
        value={currentParams.level || ''}
        onChange={e => update('level', e.target.value)}
      >
        <option value="">All levels</option>
        <option value="senior">Senior</option>
        <option value="manager">Manager / Lead</option>
        <option value="entry">Entry level</option>
      </select>

      <select
        className="filter-select"
        value={currentParams.posted || ''}
        onChange={e => update('posted', e.target.value)}
      >
        <option value="">Any time</option>
        <option value="1">Last 24 hours</option>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
      </select>
    </div>
  )
}
