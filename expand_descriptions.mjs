import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdzxmpgqcoycrhdzxrzr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkenhtcGdxY295Y3JoZHp4cnpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDcwNDMyNCwiZXhwIjoyMTAwMjgwMzI0fQ.RJRPD9kuQiOEgtZC_K-aODbaQ740HVoz-q-VuN6LU8g'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const expandedDescriptions = {
  'Sales Development Representative - Korea': `Elastic, the Search AI Company, is looking for a Sales Development Representative to help us grow our business in Korea. You'll prospect into strategic Korean accounts and help create meaningful conversations with decision-makers about how our platform solves their most critical challenges.

**What you'll do:**
• Prospect into strategic Korean accounts through phone, email, social selling, and events
• Engage inbound and outbound prospects with a thoughtful, multi-channel approach
• Conduct discovery calls to understand customer challenges and qualify opportunities
• Collaborate closely with Account Executives and Marketing to identify target accounts
• Develop strong product knowledge across Elastic's AI-powered search, observability, and security solutions
• Execute outbound campaigns and track pipeline metrics
• Attend events and participate in field marketing activities

**What we're looking for:**
• Sales, sales development, or customer-facing experience (preferred but not required)
• Strong drive to succeed and build a career in tech sales
• Highly coachable mindset—you actively seek feedback and embrace challenges
• Genuine curiosity about technology and how businesses grow
• Excellent communication skills across phone, email, LinkedIn, and digital channels
• Strong organizational skills with ability to prioritize multiple opportunities
• Fluency in English and Korean
• Comfort with CRM tools and sales technologies

**Nice-to-haves:**
• Prior experience in SaaS or CPaaS sales
• AI-first mindset and familiarity with AI tools
• Experience with sales development tools like LinkedIn Sales Navigator

**What we offer:**
• Competitive salary and benefits package
• Ability to craft your own schedule with flexible locations
• Generous vacation and parental leave
• Professional development and learning opportunities
• Health coverage for you and your family`,

  'Intermediate Backend Engineer, India': `GitLab is the intelligent orchestration platform for DevSecOps. We're looking for an Intermediate Backend Engineer to own features from requirements through shipping and production support. You'll work on code that powers millions of developers worldwide.

**What you'll do:**
• Own backend features end-to-end: design, implement, test, ship, and follow up in production
• Design and maintain APIs, background jobs, service integrations, and data models
• Write maintainable, secure, observable, and performant code
• Add and improve automated test coverage (unit, integration, contract, end-to-end)
• Review colleagues' code for correctness, maintainability, security, and performance
• Investigate and resolve build, deployment, and runtime failures
• Operate the services your team builds—identify technical debt and propose improvements
• Use AI productively in daily development work

**What we're looking for:**
• Professional backend development experience with strong fundamentals
• Proficiency in any modern backend language (Ruby/Rails, Go, or equivalent)
• Experience building and shipping production applications
• Strong programming, API, database, testing, and debugging skills
• Understanding of system-level performance and reliability
• Ability to work independently while seeking input at the right time
• Sound judgment about security, reliability, performance, and maintainability trade-offs
• Clear written communication in a remote, asynchronous environment

**Nice-to-haves:**
• Production experience with Go services, APIs, or concurrency patterns
• Docker, Kubernetes, Helm, or CI/CD experience
• Rust experience, especially for systems or performance work
• PostgreSQL schema design, caching, or event-driven architecture knowledge
• Observability experience with metrics, logs, traces, and dashboards
• Contribution to open source projects

**What we offer:**
• Flexible paid time off
• Equity compensation and employee stock purchase plan
• Growth and development fund
• Parental leave and team member resource groups
• Fully remote, work from anywhere`,

  'Salesforce Project Manager': `TTEC Digital is seeking a Salesforce Project Manager to drive successful delivery of Salesforce consulting engagements. You'll own project execution across schedule, budget, resources, and delivery quality—ensuring clients get maximum value from their investments.

**What you'll do:**
• Own day-to-day execution of Salesforce implementation projects
• Develop and maintain integrated project plans with clear milestones and dependencies
• Manage project budgets, tracking labor hours, burn rates, and forecasts
• Identify budget and schedule variances early and communicate potential overruns
• Develop and manage resource plans based on project scope and delivery needs
• Coordinate cross-functional delivery teams (consultants, developers, QA, architects)
• Maintain and actively manage project risks, assumptions, issues, and dependencies
• Facilitate project kickoffs, planning sessions, status meetings, and governance activities
• Produce weekly status reports covering schedule, budget, risks, issues, and decisions
• Support Agile, Waterfall, or hybrid delivery methodologies as needed
• Manage scope against contractual commitments and handle change control
• Coordinate testing, UAT, deployment, and go-live activities

**What we're looking for:**
• 5+ years of project management or technology delivery experience
• Experience managing implementation or digital transformation projects
• Strong understanding of project budgeting and labor hour forecasting
• Demonstrated ability to identify variances and take corrective action
• Experience with Statements of Work and contractual commitments
• Familiarity with Agile/Scrum, Waterfall, and hybrid methodologies
• Strong organizational and prioritization skills
• Excellent written and verbal communication
• Ability to build relationships with clients and delivery teams
• Problem-solving and conflict-resolution skills

**Nice-to-haves:**
• Salesforce or enterprise CRM implementation experience
• Project Management Professional (PMP) certification
• Certified ScrumMaster (CSM) or PMI-ACP
• Experience with Salesforce-specific tools and platforms

**What we offer:**
• Permanent remote opportunity in the Philippines
• Flexible working hours
• Competitive salary based on experience
• Professional development opportunities
• Health insurance and benefits package`,

  'Full Stack / Product Engineer': `Allium is building the System of Record for Onchain Finance. We're solving a massive problem: blockchain data is public but unusable at scale. As a Full Stack/Product Engineer, you'll design intuitive experiences for users to work with tens of thousands of data schemas and complex workflows.

**What you'll do:**
• Own product design and engineering for features end-to-end
• Design and iterate on UI/workflow/layout combinations obsessively to get details right
• Build intuitive primitives that feel natural to users—think lego blocks for data workflows
• Help customers get their jobs done with elegant, thoughtful design
• Work closely with product, design, and other engineers on implementation
• Use AI to accelerate development and problem-solving
• Contribute to a culture of excellence where everything matches the quality of the core product

**What we're looking for:**
• Deep passion for building products that users love
• Strong design taste and attention to detail—you get annoyed when things feel "off"
• Joy in iterating on UI and workflows to find the perfect solution
• Obsessive care about work quality and user experience
• Ability to balance product thinking with strong engineering fundamentals
• Comfort with ambiguity in a fast-moving startup environment
• Experience shipping features that users rave about

**Nice-to-haves:**
• Prior experience at high-growth fintech or data companies
• Background promoting to technical audiences
• Design system or component library experience

**What we offer:**
• Opportunity to shape institutional-grade financial infrastructure
• Work on problems that matter to billions in onchain finance
• Annual discretionary stipend for learning and development
• Annual travel budget to meet colleagues globally
• Company offsites in inspiring locations (past: Croatia, Italy)
• Fully remote, distributed team across continents`,

  'Enterprise Project Manager': `Canonical is seeking an Enterprise Project Manager to ensure complex enterprise programs deliver exceptional results on schedule, within budget, and to stakeholder satisfaction. You'll drive project success through exceptional stakeholder management and operational discipline.

**What you'll do:**
• Own full program and project delivery within schedule, scope, cost, and resource expectations
• Identify key technical and project risks early; establish mitigation plans and track to completion
• Maintain strong customer focus and engage stakeholders to achieve successful outcomes
• Conduct regular status meetings and business reviews with customers
• Manage delivery schedules and third-party deliverables to keep projects on track
• Advocate for appropriate Canonical technologies that fit customer needs
• Represent the team to customers, partners, and internal stakeholders
• Build and maintain strong customer relationships based on integrity and accountability

**What we're looking for:**
• Extensive experience in Enterprise IT Programs and Software Engineering Project Management
• Track record of managing complex, multi-stakeholder initiatives
• Excellent written and verbal communication skills
• Experience leading cross-cultural, remote, and global project teams
• Strong negotiation and influencing skills with executives and technical teams
• Deep understanding of Linux, Open Source, and Cloud Technologies
• Bachelor's degree in a STEM discipline
• Project Management Professional (PMP) or equivalent certification
• Agile Project Management certification (Scrum Master or equivalent)
• Willingness to travel domestically and internationally

**What we offer:**
• Fully remote work environment—we've been distributed since 2004
• Personal learning and development budget of $2,000 USD annually
• Annual compensation review with performance-driven bonus
• Recognition rewards and career advancement opportunities
• Generous annual holiday leave plus parental leave
• Employee Assistance Programme and wellness platform
• Opportunity to travel and meet colleagues at company sprints worldwide
• Priority Pass and travel upgrades for company events`,

  'AI Response Evaluation Analyst (Freelance)': `iMerit Inc is assembling a global team of evaluators to improve AI models through careful human judgment. You'll review AI responses, decide which hold up, and write detailed rationales that feed directly into model improvement.

**What you'll do:**
• Review AI-generated responses across multiple domains and use cases
• Rate and rank responses against defined quality criteria: accuracy, relevance, conciseness, safety, localization
• Write short, detailed rationales for every ranking you submit
• Interpret conversational context to identify what users really wanted
• Compare multiple responses and explain why one is better than another
• Verify factual claims using approved research sources
• Flag tasks that cannot be reliably assessed rather than guessing
• Work independently with flexibility on your schedule

**What we're looking for:**
• Strong critical thinking and sound judgment in ambiguous situations
• Solid research skills and meticulous attention to detail
• Excellent reading comprehension and analytical ability
• Professional written English that is clear and concise
• Self-direction and discipline to meet deadlines without supervision
• Reliability and consistency in evaluating complex information

**Nice-to-haves:**
• Prior experience in AI evaluation or annotation work
• Background in writing, editing, research, or translation
• Familiarity with AI models and their limitations

**What we offer:**
• Independent contractor engagement
• Fully remote and flexible—you choose your hours
• Work on cutting-edge AI improvement projects
• Task-based compensation
• Paid qualification assessment before live work begins
• Variable task volume based on project demand`,

  'Data Analyst - Japan': `Peroptyx is seeking Data Analysts in Japan to improve mapping data for digital navigation applications. Your local knowledge and research skills will help validate and enhance location accuracy, business information, and routing data that millions rely on.

**What you'll do:**
• Review and validate mapping data for accuracy and completeness
• Verify business names, opening hours, and location information
• Check distance and routing accuracy from origin to destination points
• Research locations using approved tools and local knowledge
• Identify data gaps and errors that impact user experience
• Work independently with flexible scheduling
• Contribute to improving navigation accuracy globally

**What we're looking for:**
• Fluency in English and Japanese
• Excellent research and fact-checking skills
• Excellent local knowledge of Japan's geography, culture, and business environment
• Analytical mindset with strong attention to detail
• Minimum 5 consecutive years living in Japan
• Good understanding of search engines, maps, and social media platforms
• Ability to learn and apply multiple sets of instructions independently

**Nice-to-haves:**
• Prior experience with mapping or geospatial data validation
• Familiarity with local business directories and regional platforms

**What we offer:**
• Flexible working schedule—work up to 20 hours per week
• Work weekends, evenings, or whenever suits you
• Competitive hourly rate (¥2,250/hour)
• Work from home comfort
• Minimal commitment with maximum flexibility`,

  'Software Engineer': `Sticker Mule is building the Internet's most lucrative commerce platform by combining software, manufacturing, and AI into one fully integrated stack. We're profitable, privately owned, and doing nine figures in annual revenue—with zero outside investors telling us what to do.

**What you'll do:**
• Contribute to our suite of commerce tools: Stores, AI Tools, Notify, Reply, and mobile apps
• Ship features end-to-end across web and mobile from the same codebase
• Work in small autonomous teams that own products entirely
• Leverage AI aggressively to push the limits of what you can build
• Balance pragmatism with quality—move fast while building for the masses
• Collaborate with a distributed team across 40+ countries

**What we're looking for:**
• Exceptional full-stack software engineering skills
• Strong ability to use AI productively in daily development
• Excellent written and verbal communication in English
• Experience shipping production features at scale
• Comfort with our tech stack: Go, TypeScript, React, Expo, GraphQL, Postgres, GCP
• Ability to move quickly and make pragmatic trade-offs

**Nice-to-haves:**
• Prior startup experience
• Familiarity with print/manufacturing domain
• Experience building for creators and small businesses

**What we offer:**
• Salary: $150,000–$250,000 USD + $20,000 signing bonus
• 4 weeks vacation plus country-specific holidays
• Fully remote from anywhere globally
• Profitable, sustainable business with no VC pressure
• Direct impact on a platform millions use
• Autonomous team structure with real ownership`,

  'Remote Assignment Grader (Grades 6–12)': `Polaris Global Academy is redefining asynchronous online learning. We're seeking experienced educators to grade student assignments for grades 6–12 across multiple subject areas—no live teaching, just high-quality evaluation and feedback.

**What you'll do:**
• Review student-submitted assignments across grade levels and subjects
• Provide clear, rubric-aligned written feedback using our feedback model
• Work independently on your own schedule
• Meet quality standards and turnaround expectations
• Support students across diverse subject areas
• Contribute to a growing global educational platform

**What we're looking for:**
• Teaching or tutoring experience at middle or high school level
• Familiarity with US education standards and assessment practices
• Strong attention to detail and excellent written communication
• Ability to assess student work across multiple subject areas
• Comfort with online learning platforms
• Ability to meet deadlines consistently

**Nice-to-haves:**
• Experience with rubric-based assessment
• Background in curriculum design or educational assessment
• Familiarity with diverse learning platforms

**What we offer:**
• $5 per assignment
• Fully asynchronous, fully remote work
• Flexible schedule—work when it suits you
• Opportunities for increased volume as we scale
• International educator team environment
• Professional development opportunities with colleagues globally`,

  'Senior Machine Learning Engineer, AI Platform': `Airbnb's Community Support Products ML team is transforming customer service with Generative AI. We're building LLM-powered agents, fine-tuning models, developing evaluation frameworks, and creating feedback loops that continuously improve how Airbnb supports hosts and guests at scale.

**What you'll do:**
• Envision and champion novel ML systems and product integrations
• Design and implement AI solutions for customer service at scale
• Work on LLM fine-tuning, optimization, and agentic AI systems
• Build RAG/search infrastructure and LLM evaluation frameworks
• Develop testing automation and feedback-based learning systems
• Collaborate cross-functionally with product, design, and engineering teams
• Learn and share cutting-edge AI/ML technologies with teams across regions

**What we're looking for:**
• PhD/Master's degree in Computer Science or equivalent professional experience
• 4+ years of ML engineering with ownership of large-scale systems
• Deep background in designing and shipping AI/ML systems and services
• Passion for building efficient, scalable ML-powered products
• Strong experience with LLM-driven chatbots or agentic AI systems
• Excellent communication and collaboration skills
• Fluency in both English and Mandarin (essential)

**Nice-to-haves:**
• Prior experience improving production ML systems at scale
• Background in dialogue systems or conversational AI
• Experience with LLM safety, alignment, or guardrails

**What we offer:**
• Opportunity to shape how hundreds of millions interact with Airbnb
• Work on state-of-the-art AI challenges
• Access to unique, rich datasets
• Collaborate with world-class AI researchers and engineers
• Competitive compensation and benefits
• Remote-first work environment`,

  'FIU Compliance Associate': `Kraken is one of the world's longest-standing crypto platforms, trusted by over 10 million individuals and institutions. Our Compliance team is expanding, and we're seeking an FIU (Financial Investigation Unit) Compliance Associate to help us detect and prevent financial crime at scale.

**What you'll do:**
• Conduct financial investigations and prepare SARs (Suspicious Activity Reports) and STRs
• Monitor transaction patterns and adjust workflows for volume fluctuations
• Handle volume surges while maintaining quality and compliance standards
• Utilize advanced tools and spreadsheet functions for data analysis
• Manage multiple priorities: individual production work and ad-hoc projects
• Flag high-risk activities and maintain detailed investigation records
• Collaborate with cross-functional compliance and legal teams

**What we're looking for:**
• 2+ years of anti-financial crime experience with crypto background
• Understanding of compliance operations and financial crime processes
• Proven ability to identify, assess, and mitigate financial crime risks
• Familiarity with Google Suite (particularly Sheets and Docs)
• Comfort and proficiency with AI tools for automation
• Familiarity with blockchain analysis tools (Chainalysis, Elliptic, TRM)
• Strong attention to detail and excellent organizational skills
• Ability to work independently and maintain high standards

**Nice-to-haves:**
• Financial crime certifications (CAMS, ICA, CRCM, CRC)
• SQL or Python programming experience
• Prior experience in traditional financial crime compliance

**What we offer:**
• Competitive salary and benefits
• Remote work across multiple global locations
• Opportunity to work on cutting-edge financial crime detection
• Professional development and career growth in compliance
• Team environment focused on impact`,

  'Deployment Strategist - Singapore': `ElevenLabs is transforming how businesses interact with customers through AI agents. Our Deployment Strategist role combines pre-sales expertise, customer partnership, and technical architecture to help enterprises deploy ElevenAgents against their most challenging business problems.

**What you'll do:**
• Meet with strategic customers to deeply understand their AI transformation goals
• Locate customers' biggest pain points and map them to ElevenAgents solutions
• Own flagship deals end-to-end: use case identification, structure, and close
• Embed inside strategic customer teams as a trusted technical partner
• Identify high-impact use cases and collaborate with engineers to bring them to life
• Guide customers on best practices for designing and deploying agents
• Present demos and proposals to audiences ranging from technical teams to C-suite
• Collaborate with research teams to feed field insights into product roadmap
• Deliver measurable business outcomes for customers

**What we're looking for:**
• 3+ years of customer-facing technical experience
• Strong product development and delivery background
• Commercial instinct and comfort with deal structuring conversations
• Basic Python proficiency and familiarity with API integration
• Excellent communication and ability to simplify complex concepts
• Proven track record owning complex, ambiguous projects
• Adaptability across different customer environments and industries
• Technical aptitude and familiarity with LLM and AI frameworks
• Ability to map enterprise workflows to AI solutions

**Nice-to-haves:**
• Prior experience at enterprises implementing AI transformation
• Domain expertise in customer service, operations, or sales
• Experience presenting to government or enterprise C-suite

**What we offer:**
• Competitive compensation and benefits
• Remote-first with travel for customer engagement
• Work on transformative AI infrastructure
• Direct impact on how enterprises adopt AI agents
• Collaborative, fast-moving team environment
• Professional development and AI expertise building`,

  'Building Management System Coordinator': `Willow is building the leading Operational AI platform for the built world. We help owners and operators of large, complex buildings understand, manage, and optimize their operations through connected digital twins. Our Customer Engineering team is expanding, and we're seeking a coordinator to help deliver successful implementations.

**What you'll do:**
• Help build and set up Digital Twins for client buildings
• Work directly on live deployment projects from kickoff to go-live
• Use building systems knowledge (HVAC, BMS, electrical, mechanical) to validate data
• Process and analyze large datasets to identify issues and ensure accuracy
• Work with 3D building models (Revit, Navisworks) for accurate Digital Twin creation
• Collaborate across departments to support system integrations
• Use AI tools to speed up data processing, documentation, and problem-solving
• Maintain daily progress updates and flag risks or blockers to team leads
• Engage with Product and Engineering teams to improve platform capabilities

**What we're looking for:**
• 3+ years' experience in MEP engineering, Building Automation Services, or project coordination
• Background in SaaS or technology-enabled services business preferred
• MEP engineering background (mechanical, electrical, plumbing) with control systems focus
• Understanding of building technology systems: HVAC controls, BMS, lighting, metering, IT/OT/IoT, access control
• 3D modeling/BIM experience (Revit, Navisworks, Archicad)
• Comfort using AI tools like Claude to improve productivity
• Strong communication skills—able to explain things clearly and simply
• Strong data analysis skills working with large, disparate datasets
• Positive attitude, flexible, and highly motivated

**Nice-to-haves:**
• Experience with building commissioning or performance optimization
• Familiarity with facility management best practices
• Project management or coordination background

**What we offer:**
• Remote-first work environment
• Competitive salary and benefits
• Opportunity to work on cutting-edge building optimization technology
• Collaborative team focused on customer success
• Professional development opportunities
• May require travel to customer sites during implementation phases`,

  'Account Executive 4': `Twilio is seeking an experienced Account Executive to drive new customer acquisition and expand revenue across our platform. You'll work on complex, multi-product opportunities, partnering closely with technical specialists and strategy teams to help enterprises unlock value from unified communications and data platforms.

**What you'll do:**
• Prospect and close new business across the full Twilio platform
• Own highly analytical, consultative sales cycles with enterprise customers
• Build multi-threaded relationships across customer organizations
• Lead discovery conversations to understand business needs and technical requirements
• Collaborate with Specialist Sales to architect solutions for complex deals
• Work with cross-functional teams (Product, Finance, Legal) to structure contracts
• Execute multiple projects simultaneously while maintaining forecast accuracy
• Present to customer C-suite and technical stakeholders
• Act as voice of customer to internal product and strategy teams

**What we're looking for:**
• 12+ years of full-cycle sales experience
• Minimum 5 years managing or leading quantitative, analytical products
• Track record selling cloud communications and customer data platforms
• Demonstrated success in outbound prospecting and territory development
• Proven consultative technical solution selling experience
• Comfort working with both business and technical stakeholders
• Ability to conduct deep discovery and translate pain points into solutions
• Strong forecasting and financial management skills
• Experience managing complex enterprise sales cycles
• Excellent verbal and written communication

**Nice-to-haves:**
• Deep CPaaS, Data Platform, or communications platform selling experience
• Domain expertise in fintech, retail, healthcare, or insurance
• Experience presenting to C-suite executives
• Track record with high-ACV deals

**What we offer:**
• Competitive salary and benefits package
• Generous time off and wellness leave
• Equity opportunity
• Travel budget for customer engagement
• Remote-first culture with optional in-person collaboration
• Professional development and mentorship`,

  'Customer Success Associate - Philippines': `First Advantage is seeking a Customer Success Associate to serve as the primary point of contact for clients. You'll manage service delivery, handle client inquiries, and ensure every interaction reinforces client confidence and satisfaction with our platform.

**What you'll do:**
• Serve as the go-to expert for client queries and case-specific requirements
• Manage day-to-day client interactions via multiple channels
• Monitor and manage cases to ensure timely delivery aligned with SLAs
• Review documentation for accuracy and completeness
• Provide proactive communication about delays, updates, and next steps
• Handle first-level client escalations and drive resolution
• Dispatch reports and deliverables with accuracy and professionalism
• Build productive relationships with clients across all levels
• Contribute feedback to improve internal processes and client satisfaction

**What we're looking for:**
• Bachelor's degree in Business, Marketing, Commerce, or related field
• 1–2 years' experience in client-facing roles
• Experience in client coordination, account support, or customer engagement
• Comfortable managing multiple ongoing requests and projects
• Strong organization, follow-up, and documentation skills
• Clear written and verbal communication
• Highly organized and detail-oriented mindset
• Proactive, customer-focused approach to problem-solving
• Ability to work independently and take initiative

**Nice-to-haves:**
• Prior experience in client operations or engagement roles
• Background in account coordination or administrative support
• Experience managing customer support in BPO or multinational companies
• Salesforce or CRM familiarity

**What we offer:**
• Full-time remote position in the Philippines
• Competitive base salary
• Normal office hours with flexible working arrangements
• Benefits package including health coverage
• Career advancement opportunities in client operations
• Training and development support
• NBI clearance required`,

  'Branding Manager - Hong Kong Based': `STERRY is a growth marketing agency specializing in crowdfunding and e-commerce success. We're seeking an experienced Branding Manager to take ownership of brand identity and market positioning for a luxury fashion brand in Hong Kong—a strategic and fast-moving market.

**What you'll do:**
• Develop and execute comprehensive brand strategy tailored for Hong Kong market
• Ensure absolute consistency across all brand touchpoints
• Conduct market research on fashion trends and competitive landscape
• Lead planning and execution of campaigns, launches, and collaborations
• Oversee development of marketing collateral and localized content
• Define brand social media and digital content strategy
• Manage agency relationships (PR, creative, media buying)
• Serve as brand guardian, training teams on guidelines and positioning
• Work with e-commerce team to ensure premium online experience
• Report on brand health and campaign effectiveness to senior management

**What we're looking for:**
• 5+ years of progressive experience in brand management
• Minimum 3 years specifically in the fashion sector
• Legal eligibility to work in Hong Kong with solid local market understanding
• Proven track record developing and executing successful integrated campaigns
• Exceptional written and verbal communication in English and Cantonese
• Bachelor's degree in Marketing, Business, Communications, or related field
• Proficiency in data analysis and translating insights into strategy
• Creative mindset with strong attention to detail
• Ability to manage multiple projects simultaneously under tight deadlines

**Nice-to-haves:**
• Experience with luxury or premium fashion brands
• Understanding of Asian luxury market dynamics
• Background in omnichannel brand strategy

**What we offer:**
• Competitive compensation package
• Full remote flexibility
• Opportunity to work with international brands
• Collaborative and innovative marketing environment
• Professional development in luxury brand management
• Creative freedom and strategic input on brand direction`,

  'Dubbing Specialist (Freelance)': `ElevenLabs' Productions team operates a marketplace bringing together AI audio tools and human expertise to deliver high-quality localized content at scale. We're seeking freelance Dubbing Specialists to optimize translations and produce natural-sounding dubbed audio for creators and media companies worldwide.

**What you'll do:**
• Optimize translations for dubbed content—balancing accuracy, lip-sync, and natural delivery
• Produce natural-sounding dubbed audio using AI tools and your creative expertise
• Cast voices strategically to ensure content sounds authentic in your language
• Collaborate with audio engineering and mixing teams on final edits
• Work independently on flexible, project-based assignments
• Claim and complete jobs directly on our platform
• Maintain high quality standards across all deliverables

**What we're looking for:**
• Native or near-native fluency in a supported language
• Prior experience dubbing and translating audiovisual content
• Strong attention to detail and commitment to linguistic accuracy
• Understanding of lip-sync, pacing, and delivery nuances
• Ability to work independently and deliver on time
• Creative instincts for voice casting and localization

**Nice-to-haves:**
• Experience with language service providers or localization teams
• Exposure to AI-assisted dubbing tools
• Background in audio production or sound design
• Experience with multiple languages

**What we offer:**
• Competitive task-based compensation
• Fully remote and flexible scheduling
• Work on cutting-edge AI dubbing projects
• Exposure to content from top creators and studios
• Opportunity to grow skills in emerging AI audio technology
• Variable workload based on project availability`,

  'AI Content Writer - Sri Lanka': `Bizycorp Pvt Ltd is building a remote-first team of content creators leveraging AI to produce high-quality marketing content at scale. We're seeking an AI Content Writer based in Sri Lanka to join our growing team and help brands tell their stories.

**What you'll do:**
• Create, edit, and optimize content using AI tools across multiple mediums
• Write for blogs, websites, landing pages, social media, and email campaigns
• Research industry topics, audiences, and competitors to inform strategy
• Repurpose podcasts and event transcripts into blogs, guides, social carousels
• Train AI models and refine prompts to improve content automation workflows
• Write SEO-friendly content optimized for search visibility and engagement
• Proofread and edit for clarity, accuracy, and brand alignment
• Collaborate with internal teams and subject matter experts
• Manage content calendars and revisions
• Continuously improve content quality, tone, and consistency

**What we're looking for:**
• Excellent English command with strong grammar and writing skills
• Proven experience writing content for websites, blogs, social media, and marketing campaigns
• Skilled at using AI tools to generate and humanize content efficiently
• Solid understanding of SEO best practices and keyword optimization
• Strong research skills, particularly in professional services (medical, legal, etc.)
• Ability to adapt tone and style across brands and audiences
• Strong proofreading skills with exceptional attention to detail
• Comfortable managing multiple projects with tight deadlines
• Self-driven, detail-oriented, and able to work independently
• Hands-on social media experience (LinkedIn, Instagram, Facebook, YouTube)
• Familiarity with Zoom, G-Suite, Canva, and project management tools

**Nice-to-haves:**
• Prior content writing or digital marketing experience
• Background in SEO or content strategy
• Experience with content management systems

**What we offer:**
• Full-time remote position from Sri Lanka
• Flexible work schedule: 5 hours day + 3 hours evening
• Salary: 85,000 LKR monthly (including basic and allowances)
• EPF/ETF enrollment per Sri Lankan law
• Potential increment after 6-month probation
• Paid leave and selected training programs
• Performance-based annual rewards
• Global team exposure with 250+ employees worldwide`,

  'Senior Revenue Operations Manager': `WooCommerce/Automattic is scaling B2B merchant acquisition and building out Revenue Operations from the ground up. This is your opportunity to design systems, processes, and data foundations that enable predictable growth—not just optimizing what exists, but building what doesn't yet.

**What you'll do:**
• Build core dashboards and reporting that clearly answer \"where are we vs. target?\"
• Identify process and data gaps; establish remediation plans
• Create capacity and territory models
• Map the full tech stack and establish integrations (Salesforce, Gong, ChiliPiper, etc.)
• Establish data quality standards and governance practices
• Operationalize the CS function: health scoring, churn prediction, workflows
• Create rules of engagement between Sales and CS
• Build enablement infrastructure and processes
• Perform ongoing analysis to guide strategy (win/loss, cycle length, retention, segmentation)
• Support territory planning, quota setting, and compensation administration
• Partner with Sales and CS leadership as a trusted operational and analytical advisor

**What we're looking for:**
• 6–8+ years of RevOps experience including at least one 0→1 build or major foundation reset
• Deeply data-driven mindset—\"if the data isn't there, how do we get it?\"
• Comfortable speaking truth to power and surfacing trade-offs with data
• AI is a strength, not a buzzword—concrete examples of how you use it
• Hands-on technically with strong Salesforce expertise (flows, integrations)
• Comfortable working with data (SQL, Python, or equivalent)
• Pragmatic and intentional approach—balancing short-term fixes with long-term systems
• Ability to partner as an equal with revenue leaders
• Strong skills communicating data-backed insights to executives

**Nice-to-haves:**
• Experience at high-growth fintech or payments companies
• Prior success building repeatable operational frameworks across markets
• Experience managing distributed, multicultural teams
• Familiarity with Salesforce, Gong, ChiliPiper, or similar tools

**What we offer:**
• Salary: $140,000–$200,000 USD (compensation varies by location)
• Fully remote, work from anywhere
• Open vacation policy
• Flexible work environment
• Competitive benefits by country
• Growth and development opportunities
• Impact on a platform millions of merchants use`,

  'Marketing Associate': `Canonical is seeking a Marketing Associate to support demand generation and brand building. You'll contribute to campaigns, messaging, and strategies that help enterprises and developers understand and adopt Ubuntu and open source solutions at scale.

**What you'll do:**
• Contribute to go-to-market planning and execution
• Draft and edit compelling messaging and positioning for diverse audiences
• Assist in developing campaign plans and content dissemination strategies
• Partner with demand generation and digital teams to optimize marketing funnels
• Coordinate webinars, events, and social media promotions
• Track campaign performance and report on key metrics
• Support content creation and storytelling efforts
• Collaborate with product and sales teams to align messaging

**What we're looking for:**
• Genuine passion for technology and curiosity about open source
• Analytical thinking and ability to break down complex issues
• Strong interpersonal skills and ability to collaborate in fast-paced teams
• Excellent verbal and written communication with storytelling ability
• Proactive mindset and strong prioritization skills
• Basic understanding of marketing principles or go-to-market strategies
• Growth mindset—eager to learn and open to feedback
• Attention to detail and ability to meet deadlines

**Nice-to-haves:**
• Prior internship or experience in marketing or demand generation
• Familiarity with open source technologies
• Experience with marketing automation or analytics tools

**What we offer:**
• Fully remote working environment—distributed since 2004
• Personal learning and development budget of $2,000 USD annually
• Annual compensation review with performance potential
• Recognition rewards and career growth opportunities
• Annual holiday leave and parental leave
• Employee Assistance Programme
• Opportunity to meet colleagues at company sprints worldwide
• Travel benefits and networking opportunities`,

  'Senior Solutions Architect I, Pre-Sales - South Korea Defense': `Planet Labs is seeking a Senior Solutions Architect to help South Korea's Defense and Intelligence community leverage earth observation data to solve their most critical challenges. This role combines deep technical expertise, customer partnership, and strategic business development.

**What you'll do:**
• Design complex solutions demonstrating Planet's earth observation data and services value
• Architect and deliver compelling solution demonstrations and technical presentations
• Build trusted advisor relationships with customers across technical and management levels
• Act as senior technical advisor for customer business challenges
• Craft technical responses to tenders, RFIs/RFPs
• Work with sales teams to develop account strategies and drive deals
• Participate in customer workshops and training sessions
• Stay current with earth observation, geospatial, and defense/intelligence trends
• Present to key government stakeholders and C-suite executives
• Represent customer needs to Planet's product and strategy teams

**What we're looking for:**
• 6+ years of technical experience supporting the South Korean defense and intelligence community
• Bachelor's degree in relevant technical field
• Ability to travel up to 50% (including international travel)
• Excellent verbal and written communication skills
• Professional working proficiency in English
• Experience with GIS and Remote Sensing in defense context
• Background in IMINT, ISR, or related intelligence disciplines
• Experience with geospatial software (QGIS, SocetGXP, ArcGIS, GDAL)
• Proficiency in Python or similar programming languages
• Deep knowledge of AI/ML applications in earth observation

**Nice-to-haves:**
• Mandarin-speaking ability
• Prior experience presenting to high-level government officials
• Background in intelligence analysis or operations
• Experience with satellite imagery or UAV data

**What we offer:**
• Competitive salary and benefits
• Remote-first work arrangement based in South Korea
• Opportunity to work on cutting-edge space technology
• Travel budget and expenses covered
• Professional development and training budget
• Equity and performance bonuses
• Health and wellness benefits
• Engaging work on problems of national importance`,

  'Dedicated Linux Desktop & Devices Support Engineer, Singapore': `Canonical is seeking a Linux Engineer with passion for customer success to support Ubuntu Desktop and Server technical stacks. You'll own customer problems end-to-end, from troubleshooting through resolution, delivering exceptional technical support that builds loyalty and drives adoption.

**What you'll do:**
• Investigate and resolve complex customer issues with Ubuntu and open source products
• Own cases from initial report through resolution and follow-up
• Troubleshoot Linux systems using logs, stack traces, and configuration analysis
• Collaborate with colleagues and escalate to senior engineers when needed
• Contribute knowledge base articles documenting solutions and best practices
• Participate in weekend support rotation as needed
• Stay current on Ubuntu development and new product releases
• Set appropriate customer expectations on resolution timelines
• Maintain high SLA compliance and customer satisfaction scores

**What we're looking for:**
• Professional written and spoken English with excellent presentation skills
• Exceptional academic track record from high school and university
• Undergraduate degree in a technical subject or compelling alternative path
• Track record of exceeding expectations and delivering outstanding results
• Hands-on Linux troubleshooting experience
• Experience integrating Linux with other environments (authentication, file systems, networks)
• Ability to navigate stack traces and logs effectively
• Strong understanding of OS and application-level bugs
• Ability to learn quickly and handle pressure in customer-facing roles
• Programming fundamentals in any language
• Willingness to travel internationally twice yearly for company events

**Nice-to-haves:**
• Prior customer support experience in SaaS or tech environments
• Experience with Ubuntu specifically
• Background in Linux system administration
• Familiarity with cloud platforms

**What we offer:**
• Distributed work environment—remote since 2004
• Personal learning and development budget of $2,000 USD annually
• Annual compensation review with performance-driven bonus
• Recognition rewards and career advancement
• Annual holiday leave and parental leave
• Employee Assistance Programme
• Opportunity to meet colleagues at company sprints
• Priority Pass and travel benefits for company events
• Weekend rotation allowance`,

  'Ubuntu Package Management - Engineering Manager': `Canonical is hiring an Engineering Manager to lead the Ubuntu Foundations Package Management team. This technical leadership role combines people management with hands-on engineering—you'll shape the future of Ubuntu's software, driver, firmware, and system lifecycle management.

**What you'll do:**
• Define technical vision and roadmap for Ubuntu's package management platform
• Participate in design reviews and key technical decisions
• Lead and mentor a team of experienced engineers
• Coach engineers on technical growth and organizational impact
• Foster a culture of ownership, collaboration, and continuous improvement
• Plan and deliver improvements across multiple Ubuntu release cycles
• Balance innovation with stability and long-term maintainability
• Build strong partnerships across Ubuntu Engineering teams
• Collaborate with Debian and upstream open source communities
• Improve test automation, release quality, and operational reliability

**What we're looking for:**
• Exceptional academic track record from high school and university
• Undergraduate degree in Computer Science/STEM or compelling alternative path
• Strong software engineering and system design background
• Proven experience leading engineering teams with people management responsibility
• Experience developing or operating Linux distribution technologies
• Deep understanding of systems software and operating system architecture
• Excellent written and verbal communication in English
• Ability to work effectively in globally distributed teams
• Commitment to traveling twice yearly for company events (up to 2 weeks)
• Track record of technical excellence and delivering results

**Nice-to-haves:**
• Familiarity with package repositories, archives, or release engineering
• Contributions to Debian, Ubuntu, or open source infrastructure
• Performance or security engineering background
• Experience building and operating large-scale package management systems

**What we offer:**
• Distributed work environment with twice-yearly team sprints
• Personal learning and development budget of $2,000 USD annually
• Annual compensation review with performance-driven bonus
• Recognition rewards and career advancement opportunities
• Generous annual holiday leave and parental leave
• Employee Assistance Programme and wellness platform
• Opportunity to travel and meet colleagues globally
• Priority Pass and travel upgrades for company events
• Leadership development and mentorship support`
}

async function updateDescriptions() {
  try {
    console.log('Expanding descriptions for 23 jobs...\n')

    const titles = Object.keys(expandedDescriptions)
    let successCount = 0

    for (const title of titles) {
      const { error } = await supabase
        .from('jobs')
        .update({ description: expandedDescriptions[title] })
        .eq('title', title)

      if (error) {
        console.log(`✗ ${title}: ${error.message}`)
      } else {
        successCount++
        console.log(`✓ ${title}`)
      }
    }

    console.log(`\n✓ Expanded ${successCount}/${titles.length} job descriptions`)
  } catch (error) {
    console.error('Error updating descriptions:', error)
  }
}

updateDescriptions()
