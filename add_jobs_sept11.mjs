import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wdzxmpgqcoycrhdzxrzr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'
);

async function getCategoryId(name) {
  const { data } = await supabase.from('categories').select('id').ilike('name', name).single();
  return data?.id;
}

async function getOrCreateCompany(name) {
  try {
    const { data: company, error } = await supabase.from('companies').select('id').eq('name', name).single();
    if (company) return company;
  } catch (err) {
    // Company doesn't exist, create it
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  try {
    const { data: newCompany, error: insertError } = await supabase.from('companies').insert({ name, slug }).select().single();
    if (insertError) {
      console.error(`Error creating company ${name}:`, insertError);
      return null;
    }
    return newCompany;
  } catch (err) {
    console.error(`Exception creating company ${name}:`, err.message);
    return null;
  }
}

async function jobExists(applyUrl) {
  const { data } = await supabase.from('jobs').select('id').eq('apply_url', applyUrl).single();
  return !!data;
}

async function addJob(job) {
  if (await jobExists(job.apply_url)) {
    console.log(`⏭️  Skipped ${job.title} (duplicate URL)`);
    return;
  }

  const company = await getOrCreateCompany(job.company);
  if (!company) {
    console.error(`❌ Failed to create/fetch company: ${job.company}`);
    return;
  }
  const categoryId = await getCategoryId(job.category);

  const { data, error } = await supabase.from('jobs').insert({
    title: job.title,
    slug: job.slug,
    company_id: company.id,
    description: job.description,
    apply_url: job.apply_url,
    category_id: categoryId,
    employment_type: job.employment_type,
    region_tags: job.regions,
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    salary_currency: job.salary_currency || 'USD',
    status: 'live',
    source: 'manual',
    asia_friendly: true,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    published_at: new Date().toISOString(),
  }).select().single();

  if (error) {
    console.error(`❌ Error adding ${job.title}:`, error);
  } else {
    console.log(`✅ Added: ${job.title}`);
  }
}

const jobs = [
  {
    title: 'VP of Trust & Safety',
    slug: 'vp-trust-safety-vrchat',
    company: 'VRChat',
    category: 'Product',
    regions: ['Anywhere'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.lever.co/vrchat/8c124b62-0768-4863-9cf1-8af49522bcde',
    description: `Lead VRChat's Trust & Safety function to maintain a safe, respectful platform for 250,000+ worlds and a global community of millions.

You'll establish our Trust & Safety strategy, lead a high-performing team of moderation agents, and embed safety-by-design into our product. This role reports to the VP of Product and is critical to VRChat's mission to foster safe, welcoming virtual spaces.

Key responsibilities: Strategic direction for T&S, team leadership and development, product strategy for trust features, cross-departmental collaboration on safety design, content moderation oversight, policy development, industry engagement, and executive reporting.

Required: 5+ years trust & safety leadership at consumer tech companies (social, gaming, or community platforms), proven team management, content moderation expertise, policy development experience, and passion for online safety.

VRChat is 100% remote with comprehensive benefits including health insurance, 401K, stock options, unlimited vacation, and paid parental leave.`,
  },
  {
    title: 'Head of Business Development',
    slug: 'head-business-development-vrchat',
    company: 'VRChat',
    category: 'Sales',
    regions: ['Anywhere'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.lever.co/vrchat/95bbe331-59bc-4a57-9b38-aecbb3da3e45',
    description: `Drive VRChat's business development strategy with a focus on partnerships that grow the VRChat ecosystem. This senior, hands-on role combines individual contribution with building a scalable partnerships function.

You'll originate, evaluate, structure, and negotiate partnerships across IP licensing, entertainment, gaming, creators, platforms, and hardware—while establishing the processes needed to scale the function. Reports to VP of Operations & Legal, working closely with the Japan Growth team.

Key focus areas: IP partnerships, creator ecosystem growth, platform/hardware partnerships, content expansion, partnership models and frameworks, cross-functional alignment, and post-launch management.

Required: 8+ years B2D partnership experience in gaming, consumer tech, entertainment, media, marketplaces, or creator platforms. Proven track record building or scaling BD functions with measurable results. Strong commercial judgment, complex deal experience, and demonstrated success working with major brands and stakeholders.

100% remote company with stock options, benefits, unlimited vacation, and paid parental leave.`,
  },
  {
    title: 'Lead Solutions Engineer',
    slug: 'lead-solutions-engineer-acquia-japan',
    company: 'Acquia',
    category: 'Engineering',
    regions: ['Japan'],
    employment_type: 'full-time',
    apply_url: 'https://job-boards.greenhouse.io/acquia/jobs/8000008',
    description: `Lead Acquia's sales engineering efforts across Japan, combining technical expertise with business acumen to drive enterprise DXP adoption. You'll be the bridge between customer challenges and Acquia's Digital Experience Platform solutions.

This technical leadership role focuses on new-logo acquisition and cross-sell opportunities. You'll conduct discovery, design tailored DXP solutions, build and present custom proofs of concept, position against competitors, enable partners, and represent Acquia at industry events.

Key responsibilities: Strategic account growth, technical discovery and solution design, competitive positioning, custom PoC delivery, partner enablement, market presence, and product feedback loops to Acquia's engineering teams.

Required: Proven Solutions Engineering or Sales Engineering experience with enterprise CMS/DXP platforms. Solid understanding of modern web architectures, cloud deployment (AWS/Azure/GCP), APIs, and security. Strong partner/channel experience. Native-level Japanese and business-level English. Self-starter mentality with autonomy in a remote, regional role.

Bonus: Drupal experience, programming skills, published thought leadership, and strategic account program background.`,
  },
  {
    title: 'Consultant - FP&A - Financial Planning & Analysis',
    slug: 'consultant-fpa-anaplan-indonesia',
    company: 'Anaplan',
    category: 'Finance',
    regions: ['Indonesia'],
    employment_type: 'full-time',
    apply_url: 'https://job-boards.greenhouse.io/anaplan/jobs/8643426002',
    description: `Join Anaplan's Professional Services team as a Consultant to architect and deliver financial planning solutions for strategic enterprise accounts. You'll translate complex financial problems into sophisticated multi-dimensional planning models on Anaplan's platform.

Work with Fortune 500 companies (Coca-Cola, LinkedIn, Adobe, LVMH, Bayer) to design connected planning solutions, optimize existing models, lead data integration and migration, manage UAT testing, and support deployment.

Key responsibilities: Client requirement gathering per Anaplan frameworks, solution architecture design, multi-dimensional model development, data integration and migration, UAT leadership, deployment support, and model documentation.

Required: 6+ years Financial Planning & Analysis experience, background in Finance/Accounting/Supply Chain, subject matter expertise in planning/modeling, sophisticated Excel skills, formal system implementation methodology knowledge (Agile preferred), superb communication, proven ability to manage multiple responsibilities simultaneously, and customer-facing experience in Indonesia market.

Anaplan champions diverse perspectives and offers development programs, competitive salary with performance bonuses, health insurance, 401K, wellness benefits, and paid time off including parental leave.`,
  },
  {
    title: 'University Recruiting Manager',
    slug: 'university-recruiting-manager-stripe',
    company: 'Stripe',
    category: 'HR',
    regions: ['Singapore', 'APAC'],
    employment_type: 'full-time',
    salary_min: 212000,
    salary_max: 318000,
    salary_currency: 'SGD',
    apply_url: 'https://stripe.com/careers/listing/university-recruiting-manager/8094669?gh_jid=8094669',
    description: `Lead Stripe's university recruiting strategy and team to build the early-career talent pipeline that will shape Stripe's future. This high-visibility role combines strategic planning with hands-on execution.

You'll develop and deliver early-career hiring strategy across all lines of business, lead and develop a team of University Recruiters, partner with senior leaders across the company, and oversee global internship and apprenticeship programs including onboarding, experience design, and employee relations.

Key impact areas: University recruiting strategy and execution, team leadership and development, global internship/apprenticeship program management, cross-functional partnership (Finance, People Ops, Benefits, Onboarding, Legal), candidate experience improvement, university engagement and employer brand building, and people analytics for informed decision-making.

Required: Experience designing and delivering university recruiting strategy at high-growth organizations. Proven track record leading and developing University Recruiting professionals. Strategic thinking ability, strong communication and influencing skills, high ownership and rigorous work ethic, appreciation for craft and quality, deep people analytics interest, and proven partnership ability with hiring teams.

Stripe offers competitive salary (SGD 212K-318K), equity, bonus, retirement plans, health benefits, and wellness stipends.`,
  },
  {
    title: 'Senior Key Account Executive - Japanese speaker - SMB',
    slug: 'senior-key-account-executive-tripadvisor-japan',
    company: 'Tripadvisor',
    category: 'Sales',
    regions: ['Singapore', 'Japan'],
    employment_type: 'full-time',
    apply_url: 'https://job-boards.greenhouse.io/tripadvisor/jobs/7051639',
    description: `Manage a strategic book of business and drive new-logo acquisition for Tripadvisor's hotel solutions across Singapore and Japan. This hybrid role balances customer retention and new business development with a consultative sales approach.

You'll work with existing hotel company clients using business subscriptions and advertising solutions, expand relationships through cross-sell/upsell, manage whitespace opportunities in your territory, achieve and exceed quarterly revenue targets, and serve as the key communication link between customers and internal teams.

Key responsibilities: Book of business management and retention, territory and pipeline management, cross-sell and upsell strategy, new customer acquisition in greenfield markets, customer relationship expansion, sales target achievement, and internal coordination on customer issues.

Required: 3+ years sales experience with end-to-end sales cycle ownership. Ability to use AI tools to improve efficiency. Global-first mindset and self-starter mentality. Bachelor's degree. Bi-lingual fluency in Japanese and English. Excellent negotiation and closing skills. CRM experience (Salesforce/HubSpot). Territory and pipeline management experience. Coachability and dedication to self-improvement.

Tripadvisor offers flexible work, competitive salary with performance bonuses, development programs, health insurance, wellness benefits, paid time off, and employee assistance programs.`,
  },
  {
    title: 'Specialist Solutions Architect, Payments',
    slug: 'specialist-solutions-architect-payments-stripe',
    company: 'Stripe',
    category: 'Engineering',
    regions: ['Singapore', 'APAC'],
    employment_type: 'full-time',
    salary_min: 235000,
    salary_max: 352400,
    salary_currency: 'SGD',
    apply_url: 'https://stripe.com/careers/listing/specialist-solutions-architect-payments/8119970?gh_jid=8119970',
    description: `Become Stripe's dedicated Payments and Optimised Checkout specialist for APAC, supporting complex enterprise opportunities across Southeast Asia, Australia/NZ, and Greater China. You'll serve as a trusted technical advisor and thought leader on payment architecture and optimization.

Lead enterprise customer engagements from discovery through solution design, advise on payment modernization and checkout optimization, conduct deep discovery with business and technical stakeholders, act as an APAC payments thought leader, and scale impact through reusable assets and regional frameworks.

Key focus areas: Enterprise payment architecture design (cards, wallets, local methods, multi-currency, orchestration, fraud/risk), payment modernization and checkout optimization, cross-border and local payment method strategy, regional market insights, and thought leadership across APAC markets.

Required: 7+ years payments/fintech/financial services experience. Deep knowledge of payment flows, architecture, cards, wallets, local payment methods, multi-currency payments, payment orchestration, fraud/risk systems. Experience advising enterprises on modernization and optimization. Strong APAC payments landscape knowledge. Project management and stakeholder communication excellence. Professional English fluency and business Mandarin for technical conversations.

Preferred: Stripe integration experience, Optimised Checkout/payment orchestration knowledge, online payments/marketplaces/subscriptions experience, pre-sales or solutions architecture background, or early-stage regional function experience.

Stripe salary: SGD 235K-352.4K with equity, bonus, health benefits, and wellness stipends.`,
  },
  {
    title: 'APAC Executive Marketing',
    slug: 'apac-executive-marketing-stripe',
    company: 'Stripe',
    category: 'Marketing',
    regions: ['Singapore', 'APAC'],
    employment_type: 'full-time',
    salary_min: 230800,
    salary_max: 346200,
    salary_currency: 'SGD',
    apply_url: 'https://stripe.com/careers/listing/apac-executive-marketing/7764914?gh_jid=7764914',
    description: `Own and scale Stripe's executive relationship-building programs across APAC, designing the frameworks, playbooks, and processes that connect Stripe's leadership with the region's most important business executives.

This program ownership and governance role encompasses corporate hospitality activation, regional advisory councils, global delegation experiences, executive visit orchestration, executive profile elevation, and executive intelligence database management. You'll work across Australia/NZ, Japan, Greater China, India, and Southeast Asia.

Key responsibilities: Program framework and governance design, executive database development and maintenance, corporate hospitality strategy and activation, regional advisory council program delivery, global delegation experience leadership, executive visit orchestration, executive thought leadership positioning, and measurement/reporting on program impact.

Required: 8+ years B2B marketing with executive programs, high-touch relationship marketing, or sales-aligned marketing experience. Deep APAC expertise across Australia/NZ, Japan, Greater China, Southeast Asia. Strong instinct for working with sales and GTM teams. Experience building processes and governance from scratch. Ability to engage credibly across all organizational levels. Excellent written and verbal communication. Strong project management. AI tooling proficiency.

Preferred: Direct experience running advisory boards or sponsorship programs, CRM/ABM platform familiarity, fintech/payments/SaaS background, startup mentality, or experience with global team partnerships.

Stripe salary: SGD 230.8K-346.2K with equity, bonus, health benefits, and wellness stipends.`,
  },
  {
    title: 'Social Media Specialist (Remote/WFH)',
    slug: 'social-media-specialist-place-philippines',
    company: 'PLACE',
    category: 'Marketing',
    regions: ['Philippines'],
    employment_type: 'full-time',
    apply_url: 'https://place.com/corporate-careers/?gh_jid=4712902005',
    description: `Join PLACE's Brivity VA team as a Social Media Specialist to advocate for real estate businesses through strategic social media marketing and lead generation. You'll work directly with clients during business hours to develop and execute comprehensive marketing plans.

Develop marketing strategies, plan and execute events (trade shows, open houses, speaking engagements), create marketing collaterals for print and digital, manage client online presence and websites, leverage marketing analytics for customer acquisition insights, and oversee additional marketing initiatives.

Key responsibilities: Marketing plan development and execution, event planning and management, marketing collateral creation (graphics, video), social media and website management, marketing analytics and KPI tracking, lead generation strategy, content creation and optimization.

Required: Associate or Bachelor's degree in Marketing, Design, or related field. 2+ years marketing experience. Online content marketing and social media development expertise. Adobe Creative Suite and Canva proficiency. Graphic design or video production experience. Creative, collaborative, and results-oriented. Ability to manage competing demands and diverse workload. Meeting company technical requirements for workstation setup.

PLACE provides an end-to-end technology platform for real estate teams, handling bookkeeping, HR, legal, design, marketing, talent acquisition, training, and coaching.`,
  },
];

(async () => {
  console.log('Starting batch job insertion...\n');
  for (const job of jobs) {
    await addJob(job);
  }
  console.log('\n✨ Batch complete!');
})();
