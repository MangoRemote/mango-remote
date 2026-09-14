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
    title: 'The WildCard',
    slug: 'wildcard-douro-labs',
    company: 'Douro Labs',
    category: 'Engineering',
    regions: ['Anywhere'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.ashbyhq.com/dourolabs.xyz/2fb41cbd-cec9-4e81-9b2f-d7bcc01abe9e',
    description: `This is a standing invitation. If you don't see a role matching what you do, that's not a reason to move on. Some of the best work at Douro Labs today was pitched by the person now doing it.

Douro Labs is a core contributor to Pyth Network, the real-time financial data infrastructure powering DeFi across 50+ blockchains. We operate at the intersection of high-frequency data, decentralized systems, and open finance. The work is technically demanding, the stakes are real, the mission matters: making trustworthy, low-latency market data a public good for the world.

We do not always know in advance who we need next. But we know how exceptional people think, and the most impactful hires often define their own scope.

What we're looking for: You have genuine conviction about Web3—not because it's trendy, but because you've spent real time with it, building, researching, contributing, breaking things to understand. You follow protocol debates, have opinions worth defending, care about where decentralized finance is going.

You understand, or are ready to go deep on, why data infrastructure is foundational. Oracles are the trust layer in the DeFi Stack. If that framing excites you, you're already thinking the way we do.

You have a track record. Not necessarily a long one, but a real one. Shipped products, open-source contributions, published research, communities built from scratch—something showing you don't just think about ideas but execute.

You are high-agency. You don't wait to be told what is broken. You see the problem, move on it, bring others along. In fast-moving ecosystem, that instinct is more valuable than any credential.

You are comfortable operating globally. We're remote-first with roots in Porto. Collaborators, integrators, stakeholders spread across every major timezone. You navigate that naturally.

What working here looks like: We move fast and build fast! When you're the data layer for billions in on-chain activity, precision is product. We take that seriously. At the same time, we're early enough that you shape how things get built, not just execute someone else's vision. Work alongside people who've shipped at Jump, Bloomberg, and leading crypto protocols. Real ownership over domain. You'll be challenged and trusted.

How to apply: Click apply and share anything showing your work: GitHub, portfolio, published research, project you're proud of. We read everything and review every application personally, on rolling basis.

The future of decentralized finance will be built by people who see around corners. If that's you, we want to hear from you.`,
  },
  {
    title: 'AP English Language and Composition Teacher (Remote)',
    slug: 'ap-english-teacher-abc-education',
    company: 'ABC Education Group',
    category: 'Other',
    regions: ['Hong Kong', 'Shanghai', 'Anywhere'],
    employment_type: 'part-time',
    apply_url: 'https://abceducation-1719511743.na.teamtailor.com/jobs/681960-ap-english-language-and-composition-teacher-remote',
    description: `ABC Education Group launched Polaris Global Academy, an online school serving highly ambitious students worldwide. We specialize in helping academically strong students get ahead, stand out, achieve big academic goals. We're seeking part-time AP English Language and Composition teacher for upcoming school year.

If you're passionate about helping high school students develop strong rhetorical analysis, argumentative writing, and synthesis skills—and looking to join new and growing virtual school—we invite you to apply.

This is part-time, hourly, fully remote, requiring no travel.

Key responsibilities: Remotely teach AP English Language and Composition to small student class. Deliver 2–3 hours live instruction weekly during academic year. Guide students through AP exam's synthesis, rhetorical analysis, and argument essays, plus multiple-choice rhetorical skills section per current College Board requirements. Craft engaging asynchronous learning activities and assignments keeping students on pace, completing all AP course content and required components. Utilize LMS, College Board resources, Zoom delivering engaging lessons. Deliver instruction using proven methods and materials within official AP English Language and Composition Course and Exam Description (CED).

Required: Bachelor's degree. Master's degree preferred. Direct AP English Language and Composition teaching experience. Strong College Board scoring rubrics and exam format working knowledge.

Preferred: AP English Language and Composition virtual/online teaching experience.

Compensation: Competitive rates commensurate with experience.`,
  },
  {
    title: 'Global Account Director, Payment Partnerships - WooCommerce',
    slug: 'global-account-director-payments-automattic',
    company: 'Automattic',
    category: 'Sales',
    regions: ['Anywhere'],
    employment_type: 'full-time',
    salary_min: 105000,
    salary_max: 215000,
    salary_currency: 'USD',
    apply_url: 'https://job-boards.greenhouse.io/automatticcareers/jobs/7889285',
    description: `Lead one of WooCommerce's most strategically significant partnerships—a $100M ARR partnership with 30% YoY growth mandate. This senior commercial leadership role operates at intersection of executive relationship management, commercial strategy, cross-functional execution. Equally comfortable in C-suite boardroom and technical working session.

Automattic is the global leader in publishing, messaging, commerce software, building the operating system for open web. We democratize publishing, messaging, commerce so anyone with story can tell it, anyone with product can sell it, regardless of income, gender, politics, language, location. Strong open-source commitment with deep WordPress roots powering 43% of web.

WooCommerce: ecommerce and fintech; 4M+ stores, 34% global online stores; 1B+ monthly users. We manage internet properties for Salesforce, Porsche, Meta, Disney, NASA.

Your ownership: Full strategic and commercial lifecycle from multi-year joint business planning to day-to-day execution. Primary relationship owner across all partner organization levels. Internal champion, orchestrator, accountable owner—aligning engineering, product, marketing, legal, finance behind shared partner growth agenda.

Responsibilities: Own and grow $100M ARR strategic partnership delivering minimum 30% YoY growth through disciplined pipeline development, commercial expansion, joint go-to-market execution. Develop, maintain, execute rolling multi-year strategic partnership plan. Identify, scope, close expansion opportunities (new geographies, product lines, merchant segments, revenue structures) unlocking mutual value. Define and track commercial KPIs, milestones, leading indicators. Build and sustain deep trusted relationships across partner organization levels. Serve as primary executive contact driving QBRs, annual planning, escalation resolution. Act as single accountable internal owner managing broad stakeholder set securing alignment, investment, execution commitment. Proactively manage partner satisfaction, anticipate friction, resolve before relationship risk. Lead multi-year joint business plan development and ongoing refinement. Build and present compelling business cases to senior WooCommerce leadership. Translate strategy into phased actionable execution plans. Drive accountability through clear ownership, milestone tracking, executive reporting. Maintain deep payments ecosystem understanding—acquiring, PSPs, alternative payment methods, payment network rules, interchange economics, bank transfer costs. Monitor emerging payment technologies and competitive dynamics. Use technical fluency assessing integration feasibility, validating business cases, ensuring commercial terms grounded in product/operational understanding. Translate capability gaps and merchant needs into partnership priorities. Drive global partnership growth identifying and activating opportunities across geographies. Represent WooCommerce strategic interests in commercial negotiations, contract renewals, expansion partnerships.

Required: 10+ years strategic partnerships, global account management, or commercial leadership in payments industry. Demonstrated partnership growth track record at significant scale ($50M+ ARR) consistently delivering aggressive revenue targets. Deep payment economics knowledge—interchange structures, bank transfer costs, payment network rules, partner and merchant outcome pricing/cost dynamics. Strong technical fluency in payment capabilities. Exceptional executive presence and communication. Strong analytical and financial modeling capabilities. Proven internal orchestrator ability. Experience managing multi-year joint business plans.

Salary: $105,000–$215,000 USD. Global ranges, we pay local currency. US-based candidates only.

Benefits: Fully remote, open vacation policy, strong compensation philosophy.`,
  },
  {
    title: 'Treasury Assistant Vice President (Remote)',
    slug: 'treasury-avp-xapo-bank',
    company: 'Xapo Bank',
    category: 'Finance',
    regions: ['Anywhere'],
    employment_type: 'full-time',
    apply_url: 'https://job-boards.greenhouse.io/xapo61/jobs/7827631003',
    description: `Join Xapo Bank's Treasury team as AVP, driving Bitcoin-first strategy with traditional finance focus, particularly fixed income investment strategies balancing yield enhancement with prudent risk-taking. Work closely with Head of Treasury, bringing trading mindset to Treasury, structuring products across traditional fixed income and Bitcoin.

If you're commercially minded finance professional thriving on designing creative, risk-aware solutions at traditional finance and Bitcoin intersection, join our team.

Xapo Bank is fully distributed team 160+ Xapiens, 50+ countries. Mission: world enjoying economic freedom and wealth protection, no matter where you live or who's running your country. We search world for best people for the job. Work hard, think globally, inspire each other learning and growing. Committed to changing how things done. 100% remote, headquartered Gibraltar.

Responsibilities: Manage and grow Treasury fixed income investment portfolio—sourcing, evaluating, executing investments optimizing returns within approved risk limits. Assess and balance risk/reward across Treasury investment and structuring activities. Structure investment and yield products for Treasury with internal stakeholders and counterparties. Design and structure Bitcoin-referenced products—yield, hedging, investment structures aligning Bank's Bitcoin-first strategy. Execute and manage OTC Bitcoin trades and FX flows maintaining counterparty relationships ensuring best execution. Apply trading discipline and market experience to Treasury day-to-day investment, hedging, execution. Identify and mitigate investment-related risks (credit, market, currency, interest rate). Contribute to Treasury Management Information—investment performance, P&L, risk reporting for senior committees like ALCO.

Required: CFA or CIMA or similar qualification preferred. Proven fixed income investments experience—sourcing, evaluating, managing portfolio. Demonstrated product structuring for Treasury experience, ideally Bitcoin-referenced structures. Strong OTC Bitcoin and FX trading/flow experience. Prior trading role with strong market execution and price discovery understanding. Strong risk-reward trade-off grasp. Creative commercially minded approach designing new investment and yield-enhancing solutions. Must have crypto experience. Financial principles, investment management, treasury operations understanding. Excellent quantitative and analytical abilities. Investment and market-related risks knowledge. Strong verbal and written communication. High attention to detail and accuracy. Alignment with Xapo Values-Driven Leadership principles.

Why Xapo: Shape future, improve lives through cutting-edge tech, work 100% remote from anywhere. Build amazing things with autonomy and collaborative teamwork balance. Set your own schedule, flexible PTO. Collaborate, learn, grow with high-performance team. Yearly learning and development budget. We prioritize consumer protection and regulatory requirements.`,
  },
  {
    title: 'Marketing Director',
    slug: 'marketing-director-sterry-hongkong',
    company: 'STERRY',
    category: 'Marketing',
    regions: ['Hong Kong'],
    employment_type: 'full-time',
    apply_url: 'https://sterry.applytojob.com/apply/pw7SSljG2o/Marketing-Director',
    description: `Join STERRY's leadership team as Marketing Director. Own everything from big strategy to granular execution—and genuinely love doing both. You'll work directly with CEO, collaborating cross-functionally.

STERRY is dynamic growth marketing agency—rocket fuel behind crowdfunding and e-commerce success. Since day one, we've helped clients generate 100M+ in trackable online revenue through strategies rooted in measurable performance.

What you'll do: Own and execute end-to-end marketing strategy including brand, demand generation, content, SEO, paid marketing, product marketing. Lead and manage team across development, design, data functions. Drive growth initiatives and monitor KPIs—MQLs, sign-ups, conversions, CAC, LTV. Develop and refine company's product narrative and marketing messaging. Collaborate with Shopify team on joint campaigns, audience initiatives, cross-channel marketing. Work directly with CEO supporting marketing priorities and business growth.

Team structure: Work closely with WordPress Developer, Full Stack Dev Lead, Frontend Developer, UI/UX Designer & Product Lead, Web Scraper, AI Automation Manager.

Who you are: Previous SaaS or MarTech environment experience. Ability moving from strategy/planning to execution and campaign delivery. Technical team member management experience. Creator and influencer marketing industry interest or familiarity. Effective executive leadership communication ability while collaborating with development teams. Shopify and e-commerce experience strong advantage.

What you bring: Proven SaaS, MarTech, or high-growth technology environment experience. Seamless strategy-to-execution translation. Comfortable leading and collaborating with cross-functional technical teams. Creator and influencer marketing industry understanding and interest. Strong executive leadership and technical stakeholder communication. Shopify and e-commerce ecosystem experience highly desirable.

Apply: Send resume and short cover letter via Jazz HR portal. Only shortlisted candidates contacted.`,
  },
  {
    title: 'Marketing Director',
    slug: 'marketing-director-sterry-singapore',
    company: 'STERRY',
    category: 'Marketing',
    regions: ['Singapore'],
    employment_type: 'full-time',
    apply_url: 'https://sterry.applytojob.com/apply/6jJhyhUdYe/Marketing-Director',
    description: `Join STERRY's leadership team as Marketing Director. Own everything from big strategy to granular execution—and genuinely love doing both. You'll work directly with CEO, collaborating cross-functionally.

STERRY is dynamic growth marketing agency—rocket fuel behind crowdfunding and e-commerce success. Since day one, we've helped clients generate 100M+ in trackable online revenue through strategies rooted in measurable performance.

What you'll do: Own and execute end-to-end marketing strategy including brand, demand generation, content, SEO, paid marketing, product marketing. Lead and manage team across development, design, data functions. Drive growth initiatives and monitor KPIs—MQLs, sign-ups, conversions, CAC, LTV. Develop and refine company's product narrative and marketing messaging. Collaborate with Shopify team on joint campaigns, audience initiatives, cross-channel marketing. Work directly with CEO supporting marketing priorities and business growth.

Team structure: Work closely with WordPress Developer, Full Stack Dev Lead, Frontend Developer, UI/UX Designer & Product Lead, Web Scraper, AI Automation Manager.

Who you are: Previous SaaS or MarTech environment experience. Ability moving from strategy/planning to execution and campaign delivery. Technical team member management experience. Creator and influencer marketing industry interest or familiarity. Effective executive leadership communication ability while collaborating with development teams. Shopify and e-commerce experience strong advantage.

What you bring: Proven SaaS, MarTech, or high-growth technology environment experience. Seamless strategy-to-execution translation. Comfortable leading and collaborating with cross-functional technical teams. Creator and influencer marketing industry understanding and interest. Strong executive leadership and technical stakeholder communication. Shopify and e-commerce ecosystem experience highly desirable.

Apply: Send resume and short cover letter via Jazz HR portal. Only shortlisted candidates contacted.`,
  },
  {
    title: 'Bookkeeper (Remote)',
    slug: 'bookkeeper-smartscale360-philippines',
    company: 'SmartScale360',
    category: 'Finance',
    regions: ['Philippines'],
    employment_type: 'full-time',
    apply_url: 'https://smartscale360.applytojob.com/apply/VtHvID4Yzl/Bookkeeper-Remote',
    description: `SmartScale360 is hiring experienced US Bookkeeper supporting US-based franchise businesses through accurate bookkeeping, financial reporting, day-to-day accounting operations. Help ensure financial records remain organized, compliant, up to date.

If you're detail-oriented, highly organized, experienced with QuickBooks Online, we'd love to hear from you.

Key responsibilities: Maintain accurate QuickBooks Online (QBO) bookkeeping records for multiple US-based franchise businesses. Process and reconcile financial transactions—bank deposits, bank feeds, accounts, credit cards, loans. Record payroll journal entries from third-party payroll providers. Prepare recurring journal entries—commissions, COGS, royalties, advertising, depreciation, interest, other month-end adjustments. Support month-end close process ensuring financial record accuracy and completeness. Generate Profit & Loss (P&L) reports and assist with financial reporting and job profitability tracking. Communicate with franchise owners regarding bookkeeping, account inquiries, financial records. Assist with compliance documentation—insurance audits, tax preparation support. Coordinate vendor purchases and monitor orders for job materials and supplies. Provide administrative and operational support as business needs evolve.

Required: 2+ years bookkeeping experience supporting US businesses (franchise accounting experience plus). Strong QuickBooks Online (QBO) proficiency. Bank reconciliations, journal entries, month-end close, financial reporting experience. Profit & Loss (P&L) reporting, general ledger management, bookkeeping best practices working knowledge. Compliance documentation, audits, or tax preparation support familiarity. Excellent attention to detail, analytical, organizational skills. Strong English communication (written and verbal). Ability managing multiple priorities while working independently in remote environment. Franchise or multi-location business support experience plus. ServiceMinder or similar field service software familiarity advantage.

Tools: QuickBooks Online (QBO), Google Workspace & Microsoft Office, Slack/Zoom/Microsoft Teams, ServiceMinder.

Work-from-home requirements: Laptop/PC Intel i5 (or equivalent) 8GB+ RAM, stable 100 Mbps internet, secondary internet connection/device/power source backup.

Schedule: To be confirmed by client, any day of week availability required, flexible US business hours based on operational needs.

Why join: Permanent remote work, competitive salary + performance bonuses, healthcare benefits, annual performance appraisal, career growth opportunities, established US-based clients, supportive collaborative remote team.`,
  },
  {
    title: 'Enterprise Account Executive',
    slug: 'enterprise-account-executive-elastic-korea',
    company: 'Elastic',
    category: 'Sales',
    regions: ['South Korea'],
    employment_type: 'full-time',
    apply_url: 'https://jobs.elastic.co/jobs/sales/south-korea/enterprise-account-executive/8186104?gh_jid=8186104',
    description: `Drive net-new revenue and expansion within Enterprise Accounts in assigned territory. Elastic is the Search AI Company enabling everyone to find answers in real time using all their data at scale.

Elastic Search AI Platform used by 50%+ Fortune 500, brings together search precision and AI intelligence enabling everyone to accelerate results that matter. Take all structured/unstructured data, secure and protect private information effectively. Complete cloud-based solutions for search, security, observability help organizations deliver on AI promise.

Key responsibilities: Fuel Search AI solutions, Observability and Security solutions adoption within new Enterprise accounts while deepening existing engagement. Assist users and customers harnessing full search analytics power transforming data into actionable insights. Demonstrate fluency about cloud economics, usage-based pricing, modern data architectures. Move beyond transactions to addressing intricate data challenges customers face. Articulate Open-Source value while advocating advanced commercial features. Showcase how solutions enable working more efficiently and intelligently. Develop comprehensive business plans leveraging community, customer, partner ecosystems driving significant territory growth. Proactively identify new opportunities, successfully manage complex sales cycles. Conduct deep discovery and qualification uncovering pain, business impact, budget, decision criteria using frameworks like MEDDPICC. Work hand-in-glove with Solutions Architects, Customer Success, Marketing, RevOps accelerating deals and driving exceptional customer outcomes. Consistent accurate sales forecasting skills. Collaborate with customers building formal close plans and keeping CRM updated. Create leadership alignment to accelerate deals. Use new technologies for performance advantage and deal structuring.

Required: Combination of high-level technical curiosity and value-based seller grit. Success in SaaS subscription sales in Enterprise accounts evidenced by overachievement. Ability crafting tailored narratives linking Elastic technical capabilities (Search, Observability, Security) to measurable business outcomes. Executive negotiation & closing leading high-stakes contract and pricing discussions. Technical & cloud fluency comfortable discussing broad range of topics—security, observability, vector/traditional search, cloud cost optimization. Relationship building establishing credibility with technical developers and executive leadership. Ability operating globally. English fluency. Open-Source model enthusiasm and community reliance on solutions appreciation.

Bonus: Open-source or developer-centric infrastructure company prior experience. Observability (logs, metrics, traces) or security analytics (SIEM/XDR) use cases familiarity.

Benefits: Competitive pay based on work here not previous salary, health coverage for you and family in many locations, flexible location and schedule ability for many roles, generous vacation, $2K annual donation matching (or local equivalent), 40 volunteer hours yearly, 16 weeks minimum parental leave.`,
  },
];

(async () => {
  console.log('Starting batch job insertion...\n');
  for (const job of jobs) {
    await addJob(job);
  }
  console.log('\n✨ Batch complete!');
})();
