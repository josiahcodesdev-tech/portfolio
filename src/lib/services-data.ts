export interface ServiceFeature {
  title: string;
  description: string;
  link?: string;
}

export interface ServiceDetail {
  slug: string;
  num: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  image: string;
  features: ServiceFeature[];
  whoItsFor: string[];
  process: { title: string; description: string }[];
}

export const servicesData: ServiceDetail[] = [
  {
    slug: "web-development",
    num: "01",
    title: "Web Development",
    tagline: "Custom websites & applications",
    description:
      "End-to-end design and development of professional websites tailored to business needs. Includes responsive layouts, UI/UX design, and modern technology stacks.",
    longDescription:
      "We build websites that don't just look good — they perform. Every project starts with understanding your business goals, audience, and brand identity. From there, we craft responsive, SEO-ready websites using modern frameworks like React, Next.js, and TypeScript. Whether you need a portfolio, landing page, or full-stack application, we deliver clean code and pixel-perfect design on time and on budget.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
    features: [
      {
        title: "Responsive Design",
        description:
          "Fully responsive layouts that look great on mobile, tablet, and desktop devices.",
      },
      {
        title: "UI/UX Design",
        description:
          "User-centered design with intuitive navigation and modern visual aesthetics.",
      },
      {
        title: "SEO Optimization",
        description:
          "Built-in SEO best practices to help your website rank higher on search engines.",
      },
      {
        title: "Performance Tuning",
        description:
          "Fast-loading pages with optimized images, code splitting, and caching strategies.",
      },
      {
        title: "CMS Integration",
        description:
          "Content management systems so you can update your website without touching code.",
      },
      {
        title: "Ongoing Support",
        description:
          "Post-launch maintenance, updates, and technical support to keep things running smoothly.",
      },
    ],
    whoItsFor: [
      "Small businesses needing a professional web presence",
      "Startups launching their first product or brand",
      "Established companies looking for a website redesign",
      "Freelancers and consultants building personal portfolios",
    ],
    process: [
      {
        title: "Free Consultation",
        description:
          "We discuss your goals, target audience, and project requirements.",
      },
      {
        title: "Design & Prototype",
        description:
          "We create wireframes and a visual prototype for your review and feedback.",
      },
      {
        title: "Development & Launch",
        description:
          "We build, test, and deploy your website with full documentation and support.",
      },
    ],
  },
  {
    slug: "proposal-writing",
    num: "02",
    title: "Proposal Writing & Grants",
    tagline: "Documents that make decision-makers say yes",
    description:
      "Professional proposal and grant writing services for NGOs, businesses, and individuals. Crafting compelling, well-researched documents that win funding and contracts.",
    longDescription:
      "Winning proposals require more than good writing — they need strategy, structure, and a deep understanding of what funders and decision-makers look for. We craft compelling, data-backed proposals tailored to each opportunity. From grant applications and project proposals to business pitches and funding requests, every document is designed to make your case impossible to ignore.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
    features: [
      {
        title: "Grant Proposals",
        description:
          "Compelling grant applications tailored to specific funders and their evaluation criteria.",
        link: "https://www.cognitoforms.com/josiahmwangi/grantwritingclientintakeformjosiahmwangi",
      },
      {
        title: "Project Proposals",
        description:
          "Structured project proposals with clear objectives, timelines, and budget breakdowns.",
      },
      {
        title: "Business Pitches",
        description:
          "Persuasive pitch documents designed to win contracts and partnerships.",
      },
      {
        title: "Funding Applications",
        description:
          "Complete funding application packages including narratives, budgets, and supporting documents.",
      },
      {
        title: "Research & Strategy",
        description:
          "Thorough research to align your proposal with funder priorities and market opportunities.",
      },
      {
        title: "Review & Editing",
        description:
          "Professional editing and quality assurance for existing proposals and documents.",
      },
    ],
    whoItsFor: [
      "NGOs seeking grant funding for programs",
      "Businesses bidding on contracts and tenders",
      "Startups applying for investor funding",
      "Individuals applying for scholarships or fellowships",
    ],
    process: [
      {
        title: "Free Consultation",
        description:
          "We review the opportunity and discuss your objectives and competitive advantage.",
      },
      {
        title: "Research & Drafting",
        description:
          "We research the funder, develop the narrative, and draft the full proposal.",
      },
      {
        title: "Review & Submission",
        description:
          "You review the final draft, we incorporate feedback, and prepare it for submission.",
      },
    ],
  },
  {
    slug: "graphic-design",
    num: "03",
    title: "Graphic Design",
    tagline: "Brand identities people actually remember",
    description:
      "Creative graphic design for digital and print media. Including logos, branding materials, social media graphics, flyers, and marketing collateral.",
    longDescription:
      "Your brand's visual identity is often the first impression you make. We create designs that capture attention, communicate your values, and stick in people's minds. From logo design and brand guidelines to social media templates and print materials, every piece is crafted with intention and consistency to build a brand that stands out in a crowded market.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80",
    features: [
      {
        title: "Logo & Brand Identity",
        description:
          "Distinctive logos and comprehensive brand guidelines that define your visual identity.",
      },
      {
        title: "Social Media Graphics",
        description:
          "Scroll-stopping visuals optimized for every platform — Instagram, LinkedIn, Twitter, and more.",
      },
      {
        title: "Print Design",
        description:
          "Business cards, flyers, brochures, and posters designed for professional print production.",
      },
      {
        title: "Marketing Collateral",
        description:
          "Presentations, infographics, and promotional materials that communicate your message clearly.",
      },
      {
        title: "Packaging Design",
        description:
          "Product packaging that attracts attention on shelves and communicates brand quality.",
      },
      {
        title: "Brand Guidelines",
        description:
          "Comprehensive style guides ensuring visual consistency across all touchpoints.",
      },
    ],
    whoItsFor: [
      "New businesses establishing their brand identity",
      "Companies rebranding or refreshing their visual identity",
      "Marketing teams needing consistent design assets",
      "Event organizers needing promotional materials",
    ],
    process: [
      {
        title: "Free Consultation",
        description:
          "We discuss your brand vision, target audience, and design preferences.",
      },
      {
        title: "Concept Development",
        description:
          "We create multiple design concepts and mood boards for your review.",
      },
      {
        title: "Refinement & Delivery",
        description:
          "We refine the chosen direction and deliver final files in all required formats.",
      },
    ],
  },
  {
    slug: "cv-cover-letters",
    num: "04",
    title: "CV & Cover Letters",
    tagline: "Experience told in a way that gets callbacks",
    description:
      "Expert CV and cover letter crafting tailored to industry and role. Optimized for ATS and designed to stand out to hiring managers.",
    longDescription:
      "Your CV is your career's first impression — and it needs to work hard in the 6 seconds a recruiter spends scanning it. We craft ATS-optimized CVs and compelling cover letters that highlight your strengths, quantify your achievements, and tell your professional story in a way that gets you shortlisted. Every document is tailored to your target role and industry.",
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80",
    features: [
      {
        title: "ATS Optimization",
        description:
          "CVs structured and formatted to pass Applicant Tracking Systems used by major employers.",
      },
      {
        title: "Professional Formatting",
        description:
          "Clean, modern layouts that are visually appealing while remaining recruiter-friendly.",
      },
      {
        title: "Role-Specific Tailoring",
        description:
          "Content customized for your target role, industry, and career level.",
      },
      {
        title: "Cover Letter Writing",
        description:
          "Persuasive cover letters that complement your CV and address the specific role.",
      },
      {
        title: "LinkedIn Optimization",
        description:
          "Profile optimization to ensure your online presence matches your professional documents.",
      },
      {
        title: "Interview Preparation",
        description:
          "Guidance on how to present the achievements and skills highlighted in your CV.",
      },
    ],
    whoItsFor: [
      "Job seekers at any career stage",
      "Graduates entering the job market",
      "Professionals transitioning to a new industry",
      "Executives seeking senior-level positions",
    ],
    process: [
      {
        title: "Free Consultation",
        description:
          "We discuss your career goals, experience, and target roles.",
      },
      {
        title: "Personalised Draft",
        description:
          "We craft your CV and cover letter with role-specific keywords and formatting.",
      },
      {
        title: "Review & Finalization",
        description:
          "You review the documents, we make revisions, and deliver final versions.",
      },
    ],
  },
  {
    slug: "job-matching",
    num: "05",
    title: "Job Matching",
    tagline: "Connecting the right people to the right opportunities",
    description:
      "Specialized service to match and tailor existing CVs to specific job descriptions, maximizing the chance of shortlisting with keyword optimization.",
    longDescription:
      "Applying with a generic CV is the fastest way to get overlooked. Our job matching service takes your existing CV and tailors it specifically to each job description you're targeting. We analyze the role requirements, identify critical keywords, and restructure your experience to align perfectly with what employers are looking for — dramatically increasing your shortlisting rate.",
    image:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80",
    features: [
      {
        title: "Job-Specific Tailoring",
        description:
          "Your CV restructured and rewritten to match each specific job description.",
      },
      {
        title: "Keyword Matching",
        description:
          "Strategic placement of role-specific keywords to improve ATS scoring.",
      },
      {
        title: "ATS Scoring Analysis",
        description:
          "Analysis of how your CV scores against ATS systems used by target employers.",
      },
      {
        title: "LinkedIn Optimization",
        description:
          "Profile updates to align with your target roles and improve recruiter visibility.",
      },
      {
        title: "Application Strategy",
        description:
          "Guidance on which roles to target and how to prioritize applications.",
      },
      {
        title: "Before/After Comparison",
        description:
          "Clear demonstration of improvements with side-by-side comparisons.",
      },
    ],
    whoItsFor: [
      "Active job seekers applying to multiple roles",
      "Professionals targeting competitive positions",
      "Career changers adapting their experience",
      "International applicants navigating local job markets",
    ],
    process: [
      {
        title: "Free Consultation",
        description:
          "We review your current CV and the job descriptions you're targeting.",
      },
      {
        title: "Personalised Plan",
        description:
          "We analyze each role and create a tailored version of your CV for maximum impact.",
      },
      {
        title: "Optimized Delivery",
        description:
          "You receive role-ready CVs with keyword reports and application tips.",
      },
    ],
  },
  {
    slug: "data-services",
    num: "06",
    title: "Data Services",
    tagline: "Messy spreadsheets in, clean decisions out",
    description:
      "Accurate and efficient data entry services for businesses of all sizes. Including database management, spreadsheet population, and CRM data input.",
    longDescription:
      "Bad data costs time, money, and opportunities. We provide meticulous data entry, cleaning, and management services that transform chaotic spreadsheets and databases into organized, actionable information. Whether you need to populate a CRM, process forms, migrate records, or clean up years of accumulated data — we deliver accuracy, speed, and confidentiality.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    features: [
      {
        title: "Data Entry",
        description:
          "Fast and accurate data entry into spreadsheets, databases, CRMs, and custom systems.",
      },
      {
        title: "Database Management",
        description:
          "Organization, maintenance, and optimization of your databases for better performance.",
      },
      {
        title: "Data Cleaning",
        description:
          "Identification and correction of errors, duplicates, and inconsistencies in your data.",
      },
      {
        title: "CRM Population",
        description:
          "Accurate population of customer data into CRM platforms like Salesforce and HubSpot.",
      },
      {
        title: "Form Processing",
        description:
          "Digitization and processing of paper forms, surveys, and handwritten records.",
      },
      {
        title: "Data Migration",
        description:
          "Safe migration of data between platforms and systems with zero loss or corruption.",
      },
    ],
    whoItsFor: [
      "Businesses with large volumes of unprocessed data",
      "Companies migrating to new CRM or database systems",
      "Organizations digitizing paper-based records",
      "Teams needing regular data maintenance and updates",
    ],
    process: [
      {
        title: "Free Consultation",
        description:
          "We assess your data needs, volume, and required turnaround time.",
      },
      {
        title: "Personalised Plan",
        description:
          "We design a structured approach with quality checkpoints and timelines.",
      },
      {
        title: "Execution & Delivery",
        description:
          "We process your data with high accuracy and deliver clean, organized results.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return servicesData.find((s) => s.slug === slug);
}
