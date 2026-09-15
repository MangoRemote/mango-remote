import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lsmqxktdyzlkuqtxfsvf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbXF4a3RkeXpsa3VxdHhmc3ZmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDI4MzA0MSwiZXhwIjoyMDM5ODU5MDQxfQ.nA_-2-dDqUWQVdpDLXz8IlC8fPUXxG4eqQLxL7zLGO8'

const supabase = createClient(supabaseUrl, supabaseKey)

const jobs = [
  {
    title: 'Account Executive, Mid Market - North Asia',
    company_id: 'hubspot',
    slug: 'account-executive-mid-market-north-asia-hubspot',
    description: `HubSpot is seeking a Mid-Market Account Executive to join our highly successful Asia Sales Team. You'll use proactive and inbound selling strategies to find and close new business, and increase customer usage of the HubSpot platform over time.

As an Account Executive, you'll run a full sales cycle and close both new business and install base at or above quota on a monthly cadence. You'll find new prospects from both inbound and self-sourced leads, run qualification calls with C-level executives and department leaders, and deliver online and in-person product demonstrations.

You'll act as a trusted advisor and business consultant to customers, selling through internal champions to multiple stakeholders and directly to C-level executives. Work collaboratively with HubSpot's marketing and technology departments to evolve sales strategy as new features and products are introduced.

Requirements:
- 4+ years of direct sales experience in Mid-market SaaS technology
- Fluency in Cantonese (required for North Asia market)
- Experience in complex selling environments
- Proven track record of presenting to C-level executives
- Strong pipeline and forecasting management
- Certified in a standardized sales method (e.g., Sandler)

Benefits include competitive remuneration with stock units, uncapped commissions, flexible work arrangements (home/office/hybrid), world-class training, education allowance up to USD$5,000/year, private health insurance, fitness reimbursement, and 16 weeks primary caregiver leave.`,
    apply_url: 'https://www.hubspot.com/careers/jobs/5990844?gh_jid=5990844',
    category_id: 'sales',
    employment_type: 'Full-time',
    region_tags: ['Singapore', 'North Asia', 'Asia-Pacific'],
    asia_friendly: true,
    status: 'live',
    source: 'direct_submission'
  },
  {
    title: 'Technical Support Engineer',
    company_id: 'netwrix',
    slug: 'technical-support-engineer-netwrix',
    description: `Netwrix is seeking a Technical Support Engineer to provide specialized technical assistance and resolve complex software, system, and infrastructure issues. You'll serve as a subject matter expert, ensuring product reliability, system performance, and customer satisfaction.

In this role, you'll troubleshoot and resolve customer-reported issues, analyze system logs and configurations, and escalate complex issues to engineering teams. You'll document solutions and best practices, develop diagnostic tools and automation to improve efficiency, and assist with system performance optimization and security best practices.

You'll also mentor and train other support team members, contributing to process improvements and enhanced service quality across the organization.

Requirements:
- Minimum 2 years in a technical support role
- Strong technical aptitude with exceptional written and verbal communication
- Hungry to learn and passionate about providing world-class support
- Empathetic mindset with drive to advocate for customers
- Excellent troubleshooting and analytical skills
- Experience working cross-functionally
- Team and goal-oriented with high output and low ego

Netwrix values customer focus, excellence, transparent ownership, clear thinking, innovation, expertise, and exceptional teamwork. Benefits include competitive health insurance, continuous learning opportunities, collaborative environment, regular town halls, and career advancement opportunities.`,
    apply_url: 'https://ats.rippling.com/en-GB/netwrix-corporation/jobs/addabefb-112c-490b-a4f4-8a18c6261f67',
    category_id: 'support',
    employment_type: 'Full-time',
    region_tags: ['Remote', 'Global'],
    asia_friendly: true,
    status: 'live',
    source: 'direct_submission'
  },
  {
    title: 'Cybersecurity Technical Mentor - Independent Contractor',
    company_id: 'udacity',
    slug: 'cybersecurity-technical-mentor-udacity',
    description: `Udacity (now part of Accenture) is seeking experienced Cybersecurity mentors to join our School of Cybersecurity as external contractors. You'll support learners in our immersive online platform, helping bridge the talent shortage in digital technologies.

As a Technical Mentor, you'll provide personalized 1:1 support, lead technical deep-dive sessions with slide presentations reviewing concepts in detail, and host group Q&A sessions to address learner queries. You'll review student project submissions, provide feedback on course content, and help learners understand real-world applications.

This is a flexible, part-time contractor role that you can manage alongside your current commitments.

Required Skills:
- 5+ years of cybersecurity experience
- Strong understanding of cybersecurity fundamentals (network, application, system security)
- Knowledge of threat detection, vulnerability assessment, and risk management
- Familiarity with security tools (SIEM, IDS/IPS, firewalls)
- Understanding of security frameworks and standards (NIST, ISO 27001)
- Experience with incident response and monitoring
- Basic networking knowledge
- Awareness of cloud security and data protection

Preferred: Penetration testing/ethical hacking experience, relevant certifications (Security+, CEH, CISSP)

Benefits: Make impact mentoring a global learning community, showcase expertise, network with mentors worldwide, and earn additional income with schedule flexibility.`,
    apply_url: 'https://job-boards.greenhouse.io/udacity/jobs/8535777002',
    category_id: 'engineering',
    employment_type: 'Contract',
    region_tags: ['Remote', 'US', 'Canada', 'Europe', 'MENA', 'India', 'APAC'],
    asia_friendly: true,
    status: 'live',
    source: 'direct_submission'
  },
  {
    title: 'Website Onboarding Specialist',
    company_id: 'cloudbeds',
    slug: 'website-onboarding-specialist-cloudbeds',
    description: `Cloudbeds is transforming hospitality with an intelligent property management platform used by hotels across 150+ countries. We're seeking a Website Designer Specialist to join our Professional Services team and help make "more reservations, happier guests" a reality.

As a Website Onboarding Specialist, you'll conceptualize and create high-quality, professional hospitality websites using our in-house website builder. You'll manage website onboarding projects and service delivery timelines for multiple accounts, communicate directly with diverse customer profiles via video calls, emails, and voice calls, and investigate website issues while suggesting improvements.

You'll coordinate with internal teams to resolve customer concerns, publish quality websites efficiently by following standard procedures, use graphic design tools to create branded visual elements, and research content to build websites quickly. You'll handle multiple deadline-driven projects while staying current with website trends and development techniques.

Requirements:
- 1+ years of website design and development experience
- HTML and CSS experience
- Adobe Photoshop and Canva proficiency
- CMS experience (WordPress, Drupal, or Duda)
- Fluent English
- Customer service or professional services background
- Excellent communication and problem-solving skills
- Reliable internet/wifi connection
- Preferred: Fluency in both English and Spanish

Schedule: 7:00 AM to 4:00 PM UTC (3:00 PM to 12:00 AM Philippine time)

Benefits: Remote-first culture, monthly wellness Fridays, fully paid parental leave, home office stipend, professional development through Cloudbeds University, and a welcoming, inclusive work environment.`,
    apply_url: 'https://job-boards.greenhouse.io/cloudbeds/jobs/4728997005',
    category_id: 'design',
    employment_type: 'Full-time',
    region_tags: ['Philippines', 'Asia-Pacific', 'Remote'],
    asia_friendly: true,
    status: 'live',
    source: 'direct_submission'
  },
  {
    title: 'Data Technical Mentor - Independent Contractor',
    company_id: 'udacity',
    slug: 'data-technical-mentor-udacity',
    description: `Udacity (part of Accenture) is seeking experienced Data Science mentors to join our School of Data as external contractors. You'll support learners in high-quality upskilling opportunities, helping them master data science and analytics in our immersive online platform.

As a Technical Mentor, you'll provide personalized 1:1 support addressing learner questions about course content and projects, lead technical deep-dive sessions with prepared presentations reviewing concepts in detail, and host group Q&A sessions via Slack or video to address project and coursework queries.

This is a flexible, part-time contractor position that works around your existing commitments.

Required Technical Skills:
- 5+ years of data science/analytics experience
- Proficiency in Python and/or SQL
- Strong understanding of data analysis, statistics, and data modeling
- Experience with data manipulation and visualization tools (Pandas, NumPy, Excel, Tableau/Power BI)
- Familiarity with ETL processes and data pipelines
- Understanding of databases (relational and/or NoSQL)
- Knowledge of data warehousing concepts and architecture
- Ability to work with large datasets and optimize data workflows
- Experience with data quality, validation, and governance

Preferred: Big data tools (Spark, Hadoop), cloud platforms (AWS, GCP, Azure), real-world data projects

Benefits: Make meaningful impact mentoring a global community, showcase expertise, network with mentors worldwide, stay current on cutting-edge technologies, and earn additional income with flexible scheduling.`,
    apply_url: 'https://job-boards.greenhouse.io/udacity/jobs/8535755002',
    category_id: 'engineering',
    employment_type: 'Contract',
    region_tags: ['Remote', 'US', 'Canada', 'Europe', 'MENA', 'India', 'APAC'],
    asia_friendly: true,
    status: 'live',
    source: 'direct_submission'
  },
  {
    title: 'Technical Solutions Specialist (Japan)',
    company_id: 'dropbox',
    slug: 'technical-solutions-specialist-japan-dropbox',
    description: `Dropbox is seeking a Technical Solutions Specialist based in Japan to serve as a trusted technical advisor to customers and partners across Japan and Korea. You'll independently lead technical discovery, solution design, product demonstrations, and pilots—helping customers understand how Dropbox enables secure collaboration, AI-powered workflows, and digital transformation.

In this role, you'll partner with Direct Sales and Channel teams to understand customer requirements and design secure, scalable solutions. You'll lead technical discovery sessions, product demos, security reviews, and proofs of concept. You'll advise customers on APIs, integrations, migrations, deployment strategies, and ongoing management of Dropbox solutions.

You'll build trusted relationships with IT, Security, Engineering, Operations, and executive teams. You'll translate technical capabilities into clear business value, enable sales teams through training and content, and represent the customer voice to Dropbox Product teams. Travel to customer sites, partner meetings, and industry events across Japan, Korea, and the APJ region is expected.

Requirements:
- Demonstrated experience in customer-facing technical pre-sales (Sales Engineer, Solutions Consultant, Technical Consultant)
- Strong knowledge of SaaS, cloud/on-premises integrations, APIs, identity and access management, and enterprise security
- Experience leading technical discovery, demos, workshops, security discussions, and proofs of concept
- Ability to translate technical information into business outcomes for diverse audiences
- Experience with AI-enabled solutions and enterprise security
- Professional fluency in Japanese and Korean with business-level English proficiency
- Willingness to travel to customer sites and events

Preferred: Collaboration/content management platform experience, channel partner experience, migration/integration expertise, enterprise technology familiarity, relevant certifications`,
    apply_url: 'https://www.dropbox.jobs/en/jobs/8092296/technical-solutions-specialist-japan/',
    category_id: 'sales',
    employment_type: 'Full-time',
    region_tags: ['Japan', 'Korea', 'Asia-Pacific'],
    asia_friendly: true,
    status: 'live',
    source: 'direct_submission'
  },
  {
    title: 'New Business Account Executive',
    company_id: 'twilio',
    slug: 'new-business-account-executive-twilio-japan',
    description: `Twilio is reshaping the future of communications with innovative solutions for hundreds of thousands of businesses. We're seeking a New Business Account Executive in Japan to drive growth strategy by winning new customers for Twilio's communications platform.

In this role, you'll develop and implement a comprehensive territory plan and winning strategy for target accounts. You'll collaborate with internal stakeholders including demand generation marketing, digital sales, partner managers, and system engineers to align goals and strategy.

You'll forecast business including sales funnel management and systematic follow-up using Salesforce as your source of truth. You'll be an active spokesperson for Twilio's mission, vision, values, and corporate story to customers, potential customers, and external partners.

Your customers span industries including retail, financial services, manufacturing, transportation, public sectors, ISVs, system integrators, and fast-moving tech startups. You'll work with application owners, product managers, line of business executives, and C-level leaders.

Requirements:
- 5+ years of high-touch sales experience
- Comfortable working with business and highly technical leaders
- Demonstrated track record of business growth and strategy development/execution
- Challenger mindset with appetite to acquire new business
- Record of delivering market-driven results at scale
- Business-level proficiency in English (spoken and written)

Desired: Deep telecom experience (SMS aggregators, carriers, communications platforms), Software/SaaS/CPaaS/CCaaS experience, Cloud Technology Sales background, System Integrators/Reseller/VAR experience

Location: Remote based in Japan
Travel: Approximately 25% travel expected

Benefits: Competitive pay, generous time off, parental and wellness leave, healthcare, retirement savings program, and opportunities to build positive community impact.`,
    apply_url: 'https://job-boards.greenhouse.io/twilio/jobs/8125581',
    category_id: 'sales',
    employment_type: 'Full-time',
    region_tags: ['Japan', 'Asia-Pacific', 'Remote'],
    asia_friendly: true,
    status: 'live',
    source: 'direct_submission'
  },
  {
    title: 'Seasonal Customer Support Representative (Remote)',
    company_id: 'flight',
    slug: 'seasonal-customer-support-representative-flight',
    description: `Flight builds remote-first customer support teams for growing startups that put people first. We're seeking a Seasonal Customer Support Representative to cover our client's holiday season needs (mid-November 2025 through January 2026).

You'll handle customer inquiries via live chat, email, and phone to answer questions and provide solutions. You'll provide accurate information using digital tools, share suggestions for customer experience improvements with your team and client, and work to meet and exceed productivity and quality goals.

This is an entry-level position perfect for those starting or building their customer support career. You'll represent Flight to our clients in a professional and friendly manner.

What You'll Do:
- Handle customer inquiries via live chat, email, and phone
- Provide accurate information and solutions using digital tools
- Share CX improvement suggestions with your team and client
- Meet and exceed productivity and quality goals
- Represent Flight professionally and courteously

What We Look For:
- Prior customer support experience
- Excellent verbal and written English communication
- High empathy and emotional intelligence
- Strong problem-solving skills
- Adaptability and growth-learning mindset
- Available to work full-time on any shift
- Willing to work Saturday or Sunday

What We Offer:
- Flexible remote work environment
- Global community of talented teammates
- Learning and development programs
- Early-stage startup with ownership and impact opportunities

Important: This role requires a bank account that accepts ACH or wire transfers in US Dollars. Online banks like Wise and Payoneer are recommended.

Location: Philippines only`,
    apply_url: 'https://flightcx01.applytojob.com/apply/kM7LPfbOXn/Seasonal-Customer-Support-Representative-Remote',
    category_id: 'support',
    employment_type: 'Full-time',
    region_tags: ['Philippines', 'Remote'],
    asia_friendly: true,
    status: 'live',
    source: 'direct_submission'
  }
]

async function addJobs() {
  try {
    // Check for duplicates by apply_url
    const { data: existingJobs } = await supabase
      .from('jobs')
      .select('apply_url')
      .in('apply_url', jobs.map(j => j.apply_url))

    const existingUrls = new Set(existingJobs?.map(j => j.apply_url) || [])
    const newJobs = jobs.filter(j => !existingUrls.has(j.apply_url))

    if (newJobs.length === 0) {
      console.log('✓ All jobs already exist')
      process.exit(0)
    }

    // Add timestamp
    const jobsToInsert = newJobs.map(job => ({
      ...job,
      published_at: new Date().toISOString()
    }))

    const { data, error } = await supabase
      .from('jobs')
      .insert(jobsToInsert)
      .select()

    if (error) {
      console.error('Error adding jobs:', error)
      process.exit(1)
    }

    console.log(`✓ Successfully added ${data.length} jobs:`)
    data.forEach(job => console.log(`  - ${job.title}`))
    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

addJobs()
