export type EmploymentType = 'full-time' | 'contract' | 'part-time'
export type JobStatus = 'draft' | 'pending' | 'live' | 'expired'
export type JobSource = 'manual' | 'employer'
export type UserRole = 'jobseeker' | 'employer' | 'admin'
export type SubscriptionPlan = 'free' | 'premium'
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Company {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website: string | null
  industry: string | null
  description: string | null
  verified: boolean
}

export interface Job {
  id: string
  title: string
  slug: string
  company_id: string
  description: string
  salary_min: number | null
  salary_max: number | null
  salary_currency: string | null
  apply_url: string
  category_id: string
  employment_type: EmploymentType
  tags: string[]
  region_tags: string[]
  is_premium: boolean
  is_featured: boolean
  status: JobStatus
  source: JobSource
  asia_friendly: boolean
  published_at: string | null
  expires_at: string | null
  created_at: string
  company?: Company
  category?: Category
}

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
}

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  plan: SubscriptionPlan
  status: SubscriptionStatus
  current_period_end: string | null
}
