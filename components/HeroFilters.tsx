'use client'

import { useRouter } from 'next/navigation'

export default function HeroFilters() {
  const router = useRouter()

  const navigate = (key: string, value: string) => {
    if (value) router.push(`/jobs?${key}=${encodeURIComponent(value)}`)
  }

  return (
    <div className="hero-filters">
      <select className="hero-filter-select" defaultValue="" onChange={e => navigate('category', e.target.value)}>
        <option value="">All Categories</option>
        <option value="engineering">Engineering</option>
        <option value="design">Design</option>
        <option value="marketing">Marketing</option>
        <option value="sales">Sales</option>
        <option value="support">Support</option>
        <option value="product">Product</option>
        <option value="finance">Finance</option>
        <option value="hr-recruiting">HR & Recruiting</option>
        <option value="operations">Operations</option>
      </select>

      <select className="hero-filter-select" defaultValue="" onChange={e => navigate('level', e.target.value)}>
        <option value="">Experience Level</option>
        <option value="entry">Entry Level</option>
        <option value="mid">Mid Level</option>
        <option value="senior">Senior</option>
        <option value="manager">Manager / Lead</option>
      </select>

      <select className="hero-filter-select" defaultValue="" onChange={e => navigate('posted', e.target.value)}>
        <option value="">Any Time</option>
        <option value="1">Last 24 hours</option>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
      </select>

      <select className="hero-filter-select" defaultValue="" onChange={e => navigate('type', e.target.value)}>
        <option value="">Job Type</option>
        <option value="full-time">Full-time</option>
        <option value="contract">Contract</option>
        <option value="part-time">Part-time</option>
      </select>
    </div>
  )
}
