export type ATSType = 'greenhouse' | 'ashby' | 'lever'

export interface CompanySource {
  name: string
  ats: ATSType
  slug: string
}

export const COMPANY_SOURCES: CompanySource[] = [
  // Ashby
  { name: 'Airwallex', ats: 'ashby', slug: 'airwallex' },
  { name: 'Cohere', ats: 'ashby', slug: 'cohere' },
  { name: 'ElevenLabs', ats: 'ashby', slug: 'ElevenLabs' },
  { name: 'Notion', ats: 'ashby', slug: 'notion' },
  { name: '1Password', ats: 'ashby', slug: '1password' },
  { name: 'Supabase', ats: 'ashby', slug: 'supabase' },
  { name: 'Neara', ats: 'ashby', slug: 'neara' },
  { name: 'Linear', ats: 'ashby', slug: 'linear' },
  { name: 'n8n', ats: 'ashby', slug: 'n8n' },
  { name: 'Permitflow', ats: 'ashby', slug: 'permitflow' },
  { name: 'PostHog', ats: 'ashby', slug: 'posthog' },
  { name: 'Help Scout', ats: 'ashby', slug: 'helpscout' },
  { name: 'Welltech', ats: 'ashby', slug: 'welltech' },
  { name: 'Buffer', ats: 'ashby', slug: 'buffer' },
  { name: 'Zapier', ats: 'ashby', slug: 'zapier' },
  { name: 'Capchase', ats: 'ashby', slug: 'capchase' },
  // Greenhouse
  { name: 'Stripe', ats: 'greenhouse', slug: 'stripe' },
  { name: 'Elastic', ats: 'greenhouse', slug: 'elastic' },
  { name: 'Brex', ats: 'greenhouse', slug: 'brex' },
  { name: 'Remote.com', ats: 'greenhouse', slug: 'remotecom' },
  { name: 'GitLab', ats: 'greenhouse', slug: 'gitlab' },
  { name: 'Airbnb', ats: 'greenhouse', slug: 'airbnb' },
  { name: 'Grafana Labs', ats: 'greenhouse', slug: 'grafanalabs' },
  { name: 'Mercury', ats: 'greenhouse', slug: 'mercury' },
  { name: 'Cloudbeds', ats: 'greenhouse', slug: 'cloudbeds' },
  { name: 'Coursera', ats: 'greenhouse', slug: 'coursera' },
  { name: 'Webflow', ats: 'greenhouse', slug: 'webflow' },
  { name: 'Vercel', ats: 'greenhouse', slug: 'vercel' },
  { name: 'Calendly', ats: 'greenhouse', slug: 'calendly' },
  { name: 'Typeform', ats: 'greenhouse', slug: 'typeform' },
  { name: 'Netlify', ats: 'greenhouse', slug: 'netlify' },
  // Lever
  { name: 'Megaport', ats: 'lever', slug: 'megaport' },
  { name: 'TrustArc', ats: 'lever', slug: 'trustarc' },
]
