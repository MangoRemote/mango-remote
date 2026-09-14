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
    const { data: company } = await supabase.from('companies').select('id').eq('name', name).single();
    if (company) return company;
  } catch (err) {}

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
  try {
    const { data } = await supabase.from('jobs').select('id').eq('apply_url', applyUrl).single();
    return !!data;
  } catch (err) {
    return false;
  }
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
    title: 'Business Development, APAC',
    slug: 'business-development-apac-gauntlet',
    company: 'Gauntlet',
    category: 'Sales',
    regions: ['Singapore', 'Hong Kong', 'APAC'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.lever.co/gauntlet/494b0acc-7cfa-4a58-b5dc-c3c914f5d394',
    description: `Own Gauntlet's business development presence in APAC, originating and closing partnerships that route deposits and mandates into Gauntlet's vault products (Aera, onchain treasury, and curated Morpho/Kamino vaults) with fintechs, exchanges, asset managers, and protocols across Japan, Korea, Singapore, and Southeast Asia.

This is a senior individual contributor role with full ownership: you are Gauntlet's presence in APAC. You'll work in-region relationships and leads into signed, funded partnerships while building your own pipeline and providing local-hours coverage that turns regional demand into a durable book.

Gauntlet builds financial systems for the future, operating across the entire stack to offer best-in-class vault products. We serve over $1.5B in client TVL across major fintechs, neobanks, protocols, exchanges, and capital allocators in crypto and traditional asset management. Our team combines traditional finance and crypto-native expertise.

Key responsibilities: Full deal cycle ownership (discovery, qualification, structuring, negotiation, close, activation), relationship growth and warm lead conversion, pipeline origination with APAC fintechs/exchanges/asset managers, local-hours coverage and regional event representation, regulatory navigation across FSA/MAS/evolving stablecoin landscape, and cross-functional collaboration with US teams.

Required: 6+ years work experience including 4+ years in partnerships, BD, or sales in APAC with network across fintechs, exchanges, family offices, and asset managers. Track record of selling technical solutions to non-technical audiences. Experience owning complex, multi-stakeholder deals with regulated financial institutions. Working knowledge of crypto/DeFi and APAC regulatory landscape. Comfort operating independently with judgment on US team involvement. Strong English; business fluency in Japanese, Korean, or Mandarin.

Bonus: Existing APAC financial institution relationships, active DeFi user, asset management/treasury/structured products exposure.`,
  },
  {
    title: 'Product Lead (Strategy + Full Stack)',
    slug: 'product-lead-optimizee-group',
    company: 'Optimizee Group',
    category: 'Product',
    regions: ['Anywhere'],
    employment_type: 'full-time',
    apply_url: 'https://forms.gle/4yqiWvhiCMnC6xdx7',
    description: `Lead product strategy and full-stack development for Optimizee Group's financial comparison platforms. This rare hybrid role is 60% product leadership (roadmap, prioritization, specs, analytics) and 40% full-stack development. You'll own the product roadmap end-to-end and build it yourself alongside our full-stack web developer.

Optimizee Group delivers results for 450+ partners through CryptoRunner (largest crypto comparison platform in Northern Europe), InvestoRunner (largest stock market comparison platform in Sweden), and CreditRunner (launching soon). We've generated 8M+ views and delivered 1.8M+ referrals with 44K monthly active users and 35K+ subscribers.

In 2026, we relaunched on fully custom-built platforms replacing WordPress. The new platforms connect to our in-house admin system with integrations to multiple AI models and third-party APIs. AI is deeply integrated across development, content, and operations. Over the past year, we shipped 970+ updates with 350+ tasks in the backlog.

Your role: Review platforms and backlog, decide priorities, and turn ideas into features. Work directly with founder (former web developer) on strategy and growth. Make data-first decisions turning user data, market insights, and analytics into actions that move traffic, conversion, and revenue per visitor.

Required: 5+ years full-stack development independently building and deploying production web applications with workflow setup (Git, code review, CI/CD). Proven product ownership with commercial instincts—you decide what to build, understand revenue implications. Strong backend, database, and architecture skills. Proven full-stack development in Laravel/PHP preferred. Genuine interest in crypto, investing, personal finance with high standards for comparison platforms.

Tech stack: PHP 8.2+/Laravel 12, Server-rendered Laravel Blade with Alpine.js, Tailwind CSS, MySQL, Redis, Linux VPS with Nginx, GitHub Actions, AI model integrations.

Benefits: Clear path to Head of Product, work with founder on strategy, high autonomy, competitive compensation + performance bonus, fully remote, home office setup provided, annual business trips (Dubai, Singapore, Hong Kong), all AI and tools needed.`,
  },
  {
    title: 'Multi-Family Market Analyst',
    slug: 'multi-family-market-analyst-bhproperties',
    company: 'BH Properties',
    category: 'Finance',
    regions: ['Philippines', 'Anywhere'],
    employment_type: 'full-time',
    apply_url: 'https://bhproperties.applytojob.com/apply/8H87wtTPLs/MultiFamily-Market-Analyst',
    description: `Support BH Properties' acquisitions and finance teams as Market Analyst, performing financial analysis, market research, due diligence, investment presentations, and pipeline organization. This highly visible role requires effective communication with executives, property sellers, brokers, and service providers.

BH Properties is a privately held commercial real estate investment firm focused on value-add acquisitions in office, industrial, retail, and multi-family properties throughout Western US, with investments in distressed debt and ground leases. Vertically integrated with offices across LA, Riverside, San Francisco, San Diego, Seattle, Phoenix, Austin, Dallas, and Houston. The 30-year track record and strong balance sheet enable quick, creative deal structuring. Currently owns and operates ~10M square feet across 18 states.

Work during US Pacific business hours from Philippines. Report to Managing Director, Head of Affordable Housing Acquisitions.

Key responsibilities: Financial analysis and real estate underwriting on investment opportunities, review offering memoranda and seller materials (income statements, balance sheets, cash flows), conduct market research and analysis for investment presentations, prepare high-caliber slide decks, assist in property-level due diligence (lease review, rent roll, loan documents, title/survey coordination), perform market-level due diligence (sale comps, lease comps, investment trends), organize and maintain acquisition pipeline.

Required: Bachelor's degree in real estate, finance, or accounting (plus). MBA preferred. 2-5 years real estate asset management, finance, or acquisitions experience. Comfort and proficiency underwriting multifamily/apartment/affordable housing opportunities. Experience with quantitative spreadsheet evaluations and ROI/cash flow/NOI analysis. Advanced Excel modeling skills. Strong organizational, time management, verbal and written skills. Strong desire to succeed, work effectively with minimal oversight, team player mentality. Passion for multifamily real estate and growth with exceptional team.

We offer: Generous consulting fee plus development and stability within well-capitalized, entrepreneurial, growing real estate investment group.`,
  },
  {
    title: 'Member of Technical Staff (Data Intelligence)',
    slug: 'member-of-technical-staff-data-intelligence-reka',
    company: 'Reka',
    category: 'Engineering',
    regions: ['Anywhere'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.ashbyhq.com/Reka/32f1d782-9a49-4a2e-8842-ac90d002bc8d',
    description: `Join Reka's Data Intelligence team to ensure our data is high quality and can be produced at petabyte scale reliably and efficiently. Work closely with model researchers, data infrastructure engineers, and cross-functional partners to define "good data" and make smart choices about data that show up in model behavior.

Reka is a globally distributed foundation model startup headquartered in San Francisco building useful multimodal AI. Our mission: build multimodal AI and use it to empower organizations and businesses. Our founding team and members contributed to breakthroughs in AI over the past decade from Google DeepMind, Facebook AI Research (FAIR), and successful startups.

Key responsibilities: Work with model researchers to define "good data" (quality metrics, validation checks, thresholds), explore open-source datasets and create internal ones for fundamental World Models, build algorithms for automated data quality assessment and domain adaptation from synthetic to real data, track datasets, metadata, provenance, and versions for reproducible experiments, own CI/CD and development tooling for data stack (GitHub, Python, PyTorch), track and optimize throughput, storage, and compute utilization.

Required: Strong ML and deep learning fundamentals with experience building and operating large-scale data/compute systems. Comfortable moving between research questions and production engineering. Demonstrated research experience with data compositions, quality, and dataset releases. Ability to design and execute experiments with unbiased outcomes. Practical experience with distributed processing and orchestration (Spark, Ray, Airflow). Solid Python skills, familiarity with modern model training workflows (datasets, checkpoints, experiment tracking). Strong data quality instincts—measuring, monitoring, preventing regressions at scale. Fast-moving environment comfort, prioritization ability, clear communication with researchers and engineers.

Bonus: Large video dataset experience, dataset curation for training, or building internal tooling for ML evaluation/analysis.

Benefits: 5 weeks paid leave, comprehensive healthcare (vision, dental), visa support including H1B and OPT transfers.`,
  },
  {
    title: 'Associate Technical Account Manager I',
    slug: 'associate-technical-account-manager-trustarc',
    company: 'TrustArc',
    category: 'Customer Support',
    regions: ['Philippines'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.lever.co/trustarc/d0dd89d7-c15d-4f6b-8872-3b9f36144b8b',
    description: `Join TrustArc's technical support team to manage and provide Tier 1 support for Cookie Consent Manager, supporting small to enterprise-level clients. You'll be responsible for successful product integration, strong client relationships, and continuous satisfaction improvement.

TrustArc is the leader in data privacy, automating and simplifying end-to-end privacy management programs for global organizations. We're the only company delivering the depth of privacy intelligence with complete platform automation essential for growing privacy regulations. We have global teams across Americas, Europe, and Asia helping customers worldwide demonstrate compliance, minimize risk, and build trust.

Key responsibilities: Manage Tier 1 technical support for TrustArc Cookie Consent Manager solution via Zendesk, answer all inbound client inquiries with courtesy and professionalism, understand customer needs and translate into strategic solutions, provide technical assistance during implementation and deployment, identify expansion opportunities, maintain organized project documentation with projected completion dates, utilize client-based tools and applications for customer management, contribute to product development and process documentation, work in team-based environment, transfer/escalate to appropriate departments, explore unclear feature requests until full understanding is reached.

Required: Bachelor's degree + 1-2 years software technical support, account management, or technical customer-facing role. Understanding of technological platforms and web infrastructure. Understanding of technical documentation including product specs and API integrations. Intermediate Microsoft Excel knowledge. Intermediate HTML/CSS/JavaScript and debuggers knowledge. Excellent customer relationship skills (client-facing, ability to assess needs, interact with all management levels including executive). Ability to work cross-functionally with Product, Engineering, Sales. Fast-paced environment effectiveness and quick product learning. Strong communication skills (written and verbal). Strong project-management skills.

What we offer: Competitive compensation, health/vision/dental care, PTO, computer + welcome package, work from home, continuing education, philanthropic and health-focused activity participation, PHP 20K employee referral program.`,
  },
  {
    title: 'Solutions Consultant - Malaysia',
    slug: 'solutions-consultant-immersive-labs-malaysia',
    company: 'Immersive Labs',
    category: 'Sales',
    regions: ['Malaysia'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.ashbyhq.com/immersivelabs/e04f0b0e-5b83-4908-b83a-d5b2bd22f17c',
    description: `Showcase the value of the Immersive One platform and secure technical wins across METNA & APAC region from Malaysia. At Immersive Labs, we're positioned to future-proof organizations against any cyber challenge through Immersive One—the leading cyber resilience solution.

Immersive is the cyber proving ground for the AI enterprise. Through Immersive One, organizations test whether people, AI-enabled workflows, cyber teams, agents, and leaders can perform securely under realistic pressure, then turn performance into evidence for improvement, benchmarking, and readiness. Trusted by 30%+ of Fortune 100 and ranked #1 in Forrester Wave™ 2026.

We help world's biggest brands (Citi, Pfizer, Humana, HSBC) protect revenues and brand reputations. Founded 2017, we've grown to 300+ employees globally, announced 180M+ funding, and voted Best place to work multiple times.

The Scale Team operates at high velocity serving large customer volumes through fast, repeatable, digitally-led motion. As Solutions Consultant on Scale Team, you'll own technical pre-sales and first two months onboarding across many accounts. Deliver one-to-many enablement getting customers to value quickly and supporting migration to Immersive One Core platform.

Key responsibilities: Deliver product demonstrations based on sales qualification, tailored to prospect use case. Rank solution fit (Green/Yellow/Red/NA) to steer sales investment. Set up and run in-platform free trials with coaching. Answer technical questions and flag blockers. Maintain platform and competitor knowledge. Run kick-off sessions and contained onboarding within two-month window. Provide light-touch integration guidance. Run check-in and coaching sessions. Deliver one-to-many activities (webinars, workshops, bootcamps). Support phased migration to Immersive One Core. Partner closely with Inside Sales and Customer Operations.

Required: 2+ years sales engineering, solutions consulting, technical onboarding, or technical customer-facing role in SaaS or cybersecurity. Comfortable working at high volume and pace. Confident presenter to technical and non-technical audiences. Quick qualification and prioritization ability. Clear communication of technical concepts. Proficiency in IT fundamentals (hardware/software, databases, networking, security, development). Knowledge of information security concepts, compliance, standards.

Preferred: Onboarding, enablement, or one-to-many session delivery at scale. Product-led growth (PLG) or digitally-led customer motion familiarity. Windows & Linux operating systems, security tools (IDS, firewalls, anti-malware, SIEM), public cloud environments experience.

Benefits: 25 days annual leave + 2 volunteering days + birthday half day, enhanced parental leave, mindfulness groups, critical illness cover, career development through platform, 'Learn Anything' fund, share options, recognition & rewards, flexible working options, sociable team with monthly socials and sports clubs, bi-annual in-person EMEA HQ meetings.`,
  },
  {
    title: 'APAC Communications',
    slug: 'apac-communications-elevenlabs',
    company: 'ElevenLabs',
    category: 'Marketing',
    regions: ['Singapore', 'Australia', 'India'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.ashbyhq.com/elevenlabs/222122a3-24e9-4dd6-908a-5c9cd91f7e27',
    description: `Build and protect ElevenLabs' reputation across APAC as we expand. Raise ElevenLabs' profile, shape understanding, and run campaigns demonstrating value in major markets including India, Singapore, Japan, and Australia. Help build infrastructure for elite APAC communications operation as connective tissue between global and regional teams.

ElevenLabs is an AI research and product company transforming human-technology interaction. Launched January 2023 with first human-like AI voice model. Today we serve millions of users and thousands of businesses—from fast-growing startups to enterprises like Deutsche Telekom and Meta. Investors include Andreessen Horowitz, ICONIQ Growth, and Sequoia. We've raised $781M at $11B valuation.

We've expanded from voice into three main platforms: ElevenAgents (seamless intelligent customer experiences), ElevenCreative (generate and edit speech, music, image, video across 70+ languages), ElevenAPI (AI audio foundational models).

Key responsibilities: Define and own APAC communications strategy, build reputation as we expand. Design and run creative, high-engagement campaigns across media, social, events. Shape regional narrative: develop positioning, turn global news into local stories, create original local moments. Spot reputational risks early and mitigate. Build relationships with journalists, influencers, customers, industry bodies, event organizers. Support executives with media interviews and speaking opportunities. Partner across sales, marketing, policy, legal, deployment—especially GMs and marketing leads. Define operating model for APAC comms, manage agencies as needed.

Required: Experience managing communications across multiple APAC markets. Strong relationships with top-tier publication journalists, demonstrable story pitching and difficult corporate issue handling track record. Firm grasp of political, regulatory, economic, cultural landscape in region. Knack for unusually creative comms campaigns including non-traditional tactics. Excellent written and verbal communication. Thrive in fast-moving environment with nascent operating models.

Benefits: High-velocity innovation, truly global team (30+ countries), remote-first, continuous growth, learning & development discretionary stipend, social travel stipend, annual company offsite, co-working monthly stipend.`,
  },
  {
    title: 'Account Manager - APAC',
    slug: 'account-manager-apac-elevenlabs',
    company: 'ElevenLabs',
    category: 'Sales',
    regions: ['Singapore', 'APAC'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.ashbyhq.com/elevenlabs/46b3cde4-709f-4d46-9817-5cf881bb35d5',
    description: `Join ElevenLabs' early Account Management team with endless impact opportunities. Partner to develop scalable account management playbook and framework supporting customers in APAC region. Build and maintain strong relationships with commercial and enterprise clients—managing customers across Southeast Asia and North Asia.

Be part of early Account Management team at generational AI company. Play key role in driving long-term adoption of multiple products. Monitor customer usage and adoption to identify improvement or expansion areas. Own expansion and renewal of accounts in your book. Measure and improve customer satisfaction & experience. Own account management KPIs (NRR/GRR) and track against company goals.

Required: 3-7 years Account Management or Customer Success in fast-paced SaaS organization. Strong builder and customer excellence mindset. Commercial experience—you'll own renewals and expansion. Strong communication and interpersonal skills maintaining relationships at all organizational levels. Excellent problem-solving and analytical skills addressing customer needs. Hybrid customer & product-driven mentality prioritizing client satisfaction & scale. Fluency in English and Mandarin—professional-level Mandarin fluency required for confident communication, engagement with customers, negotiation, complex idea articulation (verbal and written). Bilingual work environment experience highly preferred.

Benefits: Innovative culture, growth paths, learning & development stipend, social travel stipend, annual company offsite, co-working monthly stipend.`,
  },
  {
    title: 'Account Executive - North Asia',
    slug: 'account-executive-north-asia-elevenlabs',
    company: 'ElevenLabs',
    category: 'Sales',
    regions: ['Singapore', 'North Asia'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.ashbyhq.com/elevenlabs/b647ad26-3e3a-4e0b-8ef4-6bab2cacd5c7',
    description: `Drive North Asia and Singapore business for ElevenLabs as founding Account Executive. Build and manage growing portfolio of new accounts across industries adopting conversational AI. Identify opportunities where ElevenLabs' conversational AI drives user engagement, automation, or cost efficiency. Demonstrate expertise—or strong willingness to learn—about conversational AI and voice technology value across customer support, virtual agents, in-app assistants.

Required: 7-10 years sales experience in SaaS or technology company, ideally with AI, generative AI, LLM-based products, or API platforms exposure. Experience selling technical solutions to product, engineering, or innovation teams strong plus. Proven track record meeting & exceeding sales targets in fast-paced environment. Expertise or willingness to learn voice and audio AI and solution help. Excellent communication and interpersonal skills building and maintaining organizational stakeholder relationships. Hybrid customer & product-driven mentality prioritizing client satisfaction & scale. Fluency in English and Chinese with deep understanding of business, cultural, and buying nuances across Southeast Asia and Greater China. Sales across multiple Asian markets (Mandarin-speaking regions) strongly preferred.

Benefits: Innovative culture, growth paths, learning & development stipend, social travel stipend, annual company offsite, co-working monthly stipend.`,
  },
  {
    title: 'Strategic Account Executive - Singapore',
    slug: 'strategic-account-executive-singapore-elevenlabs',
    company: 'ElevenLabs',
    category: 'Sales',
    regions: ['Singapore'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.ashbyhq.com/elevenlabs/75f7890c-2d11-4c18-a95f-03ef85e6bd15',
    description: `Lead ElevenLabs' most important customer relationships across North Asia and Singapore as founding Strategic Account Executive. Own focused portfolio driving net-new business and expansion inside complex enterprise organizations. Build multi-threaded executive relationships and position yourself as trusted advisor to senior stakeholders navigating transformation across customer experience, product, operations.

This is not transactional. You'll architect custom solutions combining technology and services, collaborate cross-functionally delivering measurable outcomes, bring field intelligence to product roadmap. The region is early-stage—you're not executing a playbook, you're writing it.

Responsibilities: Own and grow focused strategic account portfolio across North Asia and Singapore, driving net-new and expansion. Develop and execute multi-year account strategies across business units, geographies, and use cases—FSI, technology, e-commerce, government-linked corporations. Identify, scope, close large complex deals (multi-product, multi-region, custom solutions) including in-country data residency and private deployment. Build deep multi-threaded relationships across executive, product, engineering, business stakeholders—navigating HQ and regional structures. Act as strategic advisor educating on emerging AI voice trends and shaping customers' long-term AI roadmap. Partner cross-functionally with Solutions Engineering, Customer Success, FDE. Translate bespoke deal patterns into repeatable frameworks, offerings, product insights. Feed field learnings into product roadmap and sales playbook. Drive creative outbound strategies: executive briefings, onsites, regional events, relationship-based approaches.

Required: 6–10+ years quota-carrying experience focused on strategic or enterprise accounts in North Asia and Singapore. Proven track record closing and expanding seven-figure+ deals within named accounts. Large North Asia enterprise experience strongly preferred. Leading complex multi-threaded sales cycles across large regional organizations with layered approvals. Proven land-and-expand motion and long-term account growth. Scoping consultative custom deals beyond standard SKUs. Technical fluency engaging product and engineering on APIs, integrations, architecture, data security. Executive presence influencing C-suite stakeholders in English and Mandarin settings. Track record translating customer needs into product feedback and roadmap influence. Creative self-driven outbound approach, high-growth ambiguous environment comfort. Regular travel willingness for customer engagements. Bias toward action, ownership, AI in workflows. English and Mandarin fluency (written/spoken) required; additional regional language a strong plus. Singapore residence required.

Benefits: Innovative culture, growth paths, learning & development stipend, social travel stipend, annual company offsite, co-working monthly stipend.`,
  },
  {
    title: 'Onboarding Coach',
    slug: 'onboarding-coach-cloudbeds-thailand',
    company: 'Cloudbeds',
    category: 'Customer Support',
    regions: ['Thailand'],
    employment_type: 'full-time',
    apply_url: 'https://job-boards.greenhouse.io/cloudbeds/jobs/4671392005',
    description: `Join Cloudbeds' Customer Onboarding Team to care for clients and their properties like guests in a hotel—always going the extra mile. Train clients on our system, tailored to fit their hospitality business needs. Step into clients' shoes demonstrating how our system makes their lives easier.

Cloudbeds transforms hospitality with intelligently designed platform powering properties across 150 countries, processing billions in bookings annually. From independent properties to hotel groups, we help hoteliers transform operations and uplevel commercial strategy through unified platform integrating with hundreds of partners. We're World's Best Hotel PMS Solutions Provider, landed on Deloitte's Technology Fast 500 again in 2024.

Key responsibilities: Facilitate client onboarding, training, ongoing support via video, phone, email. Resolve customer inquiries and troubleshoot escalated issues across channels. Partner with Sales defining success, demonstrating ROI, driving retention. Build strong client relationships encouraging loyalty and product adoption. Develop deep Cloudbeds product and customer needs understanding. Contribute to training materials and stay updated on system changes. Record activities in Salesforce, gather feedback, share insights for product improvements.

Required: 3+ years 5-star hospitality experience in key roles (Front Desk or Revenue Manager) within leading hotel brand, or 3+ years relevant SaaS industry experience in customer-facing role. English fluency.

Recommended: Project Management certification.

We offer: Remote first always, PTO per local labor requirements, monthly Wellness Fridays (extra-long weekends), fully paid parental leave, home office stipend, professional development in Cloudbeds University, manager training, upskilling, knowledge transfer access.`,
  },
  {
    title: 'Ops Coordinator, Asia',
    slug: 'ops-coordinator-asia-enveritas',
    company: 'Enveritas',
    category: 'Operations',
    regions: ['Indonesia'],
    employment_type: 'full-time',
    apply_url: 'https://job-boards.greenhouse.io/enveritas/jobs/5421720008',
    description: `Support Enveritas' operations in Asia as Ops Coordinator based in Indonesia, focusing on Indonesian programme (coffee and cacao)—largest and most complex in region—while providing data quality and analytical support to other Asian origins (India, China, Laos, PNG, Timor-Leste).

Enveritas builds solutions for smallholder coffee farmers currently beyond reach of existing sustainability certification/verification approaches. We've developed rigorous, scalable, transparent verification method working in "underserved space." This verification backbone Responsible Sourcing platform helps companies meet sustainability targets by investing in areas needing it most.

Manage, analyze, clean data on real-time basis, provide feedback to field teams, collaborate with Enveritas global team members from varied backgrounds. Position is fully remote in Indonesia with ability to travel domestically to coffee/cacao-producing regions and occasionally to other region countries.

Key responsibilities: Monitor daily data collection quality, communicate issues to Field Coordinators. Manage and supervise Quality Control Officers (QCOs), review daily QC reports. Follow up with Field Coordinators to correct rejected surveys, monitor completed surveys, check for bad data. Support close-out and data finalization with contextual regional insights. Manage backcheck survey process. Support survey collection delivery in Indonesia. Support list-based verification coordination. Test and help design Data Quality tools and survey questionnaires. Collaborate on Data Quality protocols. Prepare and share regular analysis and collection progress statistics. Contribute to analysis projects and stakeholder presentations. Help surface trends and insights enabling supply chain actors to make data-driven sourcing decisions. Support Country Lead managing coffee/cacao stakeholder relationships, build local connections. Help communicate findings clearly to stakeholders in Bahasa Indonesia and English. Develop deep expertise in Indonesian sustainability issues. Support Field Coordinators and enumerators onboarding and training.

Required: Experience with data and working across teams. Indonesia-based. 1-2 years managing and conducting quantitative/qualitative research with strong data quality management knowledge highly desirable. Bachelor's degree in development studies, economics, business, statistics, plant science, forestry. Strong computer skills—Microsoft Office, Google Docs, quantitative data collection software/platforms. Excellent Bahasa Indonesia verbal and written proficiency, strong working English proficiency. Comfortable collaborating across timezones with global team. Willingness to travel to coffee/cacao-producing regions across Indonesia.`,
  },
  {
    title: 'GTM Enablement - APAC',
    slug: 'gtm-enablement-apac-elevenlabs',
    company: 'ElevenLabs',
    category: 'Marketing',
    regions: ['India', 'Singapore'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.ashbyhq.com/elevenlabs/55b21715-6e89-456e-af07-0b17b1e455e8',
    description: `Be ElevenLabs' first enablement hire in APAC, owning everything from program architecture to live delivery to market-specific localization. India is most established market, Australia has grown substantially, we're building presence across Singapore, Japan, South Korea, China, New Zealand. You'll inherit strong global programs and infrastructure, but everything regional starts with you.

Own full-stack enablement for APAC: scope regional needs, design program architecture, build e-learning, deliver live training, measure impact against ramp time, discovery quality, win rates. Run biweekly onboarding delivering 5-6 live sessions per cohort, every two weeks, for new sellers across India, ANZ, Singapore, Japan, South Korea, China. Continuously improve curriculum based on feedback and ramp data.

Localize global content for APAC markets: adapt sales decks, one-pagers, talk tracks, competitive materials. Partner with local AEs and leaders ensuring messaging lands with regional buying committees, procurement norms, cultural expectations. Orchestrate translation and localization vendors.

Be technical translator explaining how voice models and Agents platform work credibly. You don't need engineering background but need product fluency and understanding winning approach.

Collaborate with Partner Enablement Lead on partner certification and enablement programs across APAC. Localize partner-facing curricula, support regional partner onboarding, ensure channel sellers have product fluency matching direct teams.

Operate as global team part, collaborating with enablement counterparts in Americas and EMEA, contributing to global programs, joining weekly sync at 4pm CEST at least weekly.

Required: 8-12 years GTM roles, 4-6 years sales enablement (or solutions engineering with transition to enablement). Experience as early or first enablement hire for APAC at US or European software company scaling region. Track record building enablement programs from zero (onboarding, ongoing skill development, e-learning, measurement). Ability to localize HQ-produced content for multiple APAC markets through local sellers and vendors. Strong live facilitation skills and recurring high-frequency delivery cadence stamina. Technical aptitude explaining APIs, model behavior, latency, integration concepts. API-first or technical product company experience strongly preferred (Twilio, Datadog, MongoDB, Snowflake, Stripe, Confluent, Zoom). English business fluency required; Japanese, Mandarin, or Korean strong plus. APAC-based with reliable 2pm or 3pm BST weekly call ability.

Bonus: Distributed onboarding across 5+ timezones, developer-facing or usage-based product selling/enabling, measurement systems tying enablement to pipeline/win-rate outcomes, channel partner enabling/onboarding experience, operating experience in India, ANZ, Japan, Korea, North Asia, Southeast Asia.`,
  },
  {
    title: 'Revenue Strategy & Operations - APAC',
    slug: 'revenue-strategy-operations-apac-elevenlabs',
    company: 'ElevenLabs',
    category: 'Operations',
    regions: ['Singapore', 'Australia', 'India'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.ashbyhq.com/elevenlabs/0bbf2519-4f28-4de3-836a-aabc302050d7',
    description: `Join ElevenLabs' Revenue Operations team playing key role scaling go-to-market operations. Work at intersection of technical problem-solving and operational excellence, building and maintaining tools, automations, dashboards empowering sales, data, and product teams to execute with precision.

Operate as strategic advisor to cross-functional partners, podded by functional area (pre- vs. post-sale) driving revenue acceleration, insights, business growth. Each Revenue Strategy & Operations team member serves dedicated partner to specific GTM function—SDRs, AEs, Partnerships, Account Management.

Responsibilities: End-to-end process management building and maintaining strategic automations and standardized processes supporting cross-functional teams. Cross-functional collaboration driving initiatives enhancing revenue generation and operational effectiveness. Leadership partnership providing strategic insights, actionable recommendations, performance reporting. Experimentation developing and testing new ideas, workflows, sources improving critical levers. Data-driven strategy overseeing analytics and performance analyses. Reporting & analytics leadership designing and managing dashboards, reports, KPIs measuring and enhancing team performance.

Required: 4+ years Revenue Operations at high-growth technology companies. Proven track record developing and implementing end-to-end solutions from data collection and analysis to execution. Breaking complex problems into smaller actionable steps ability. Strong analytical skills with proven SQL expertise and data visualization using BI tools (Sigma). Excellent communication and collaboration with cross-functional teams. Highly adaptable with proactive problem-solving and process improvement approach. Strong coachability and learning willingness. Strong work ethic, highly motivated driven individual. Analytical, efficient, solving complex challenges with first principles mindset. Excellence consistency and high-quality fast work delivery. Initiative and autonomous day-one work drive. Learning and contribution focus with ego-leaving ability.

Bonus: Distributed onboarding across 5+ timezones and async delivery balancing, developer-facing or usage-based product selling/enabling track record, measurement systems tying enablement to pipeline/win-rate outcomes, channel partner enabling/onboarding, India/ANZ/Japan/Korea/North Asia/Southeast Asia operating experience.`,
  },
];

(async () => {
  console.log('Starting batch job insertion...\n');
  for (const job of jobs) {
    await addJob(job);
  }
  console.log('\n✨ Batch complete!');
})();
