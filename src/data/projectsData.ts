import { Project } from "@/hooks/use-project-modal"

export const projectsData: Project[] = [
  {
    slug: "robyn-usa",
    title: "Robyn USA — WordPress Stabilisation",
    date: "2026-04-12",
    description:
      "Diagnosed and resolved severe server resource abuse issues for a US-based motivational speaker's WordPress site, transitioning to a stable monthly retainer.",
    cover: "/images/projects/robyn_usa.png",
    client: "Robyn Stimac",
    industry: "Personal Branding / Wellness",
    liveUrl: "https://wanderingtowardthelight.com",
    repoUrl: "",
    role: "WordPress Developer & SEO Consultant",
    techStack: ["WordPress", "SEO Optimization", "Google Analytics 4", "Query Monitor", "Schema Markup"],
    images: [
      "/images/projects/robyn_usa.png"
    ],
    overview:
      "Stabilised a WordPress site experiencing repeated hosting suspensions due to extreme server resource overuse. Removed conflicting plugins and established technical SEO foundations.",
    challenge:
      "The site was returning 403 errors and was repeatedly suspended by the hosting provider. Jetpack and multiple conflicting plugins were causing severe CPU spikes.",
    solution:
      "Removed Jetpack, restructured the entire plugin stack with lightweight alternatives, deployed a custom child theme, and established proper SEO foundations with Schema markup and GA4 tracking.",
    results:
      "The site remained perfectly stable with no further suspensions. CPU usage dropped by 85%, load time improved from 7.4s to 1.8s, and the client converted to an ongoing monthly retainer.",
  },
  {
    slug: "centered-ceo",
    title: "The Centered CEO — Authority SEO",
    date: "2026-04-01",
    description:
      "Technical SEO, Authority Mapping, and Archive Architecture for a UK executive consultant. Optimised for NED-specific keywords and implemented advanced Schema.",
    cover: "/images/projects/centered_ceo.png",
    client: "The Centered CEO",
    industry: "Consulting / Executive Coaching",
    liveUrl: "https://thecenteredceo.com",
    repoUrl: "",
    role: "Technical SEO Specialist",
    techStack: ["WordPress", "Elementor", "Schema Markup", "Technical SEO", "Google Search Console"],
    images: [
      "/images/projects/centered_ceo.png"
    ],
    overview:
      "Transitioned a generic business site into a high-authority thought leadership hub targeting Non-Executive Director (NED) headhunters and event organisers.",
    challenge:
      "The client needed to dominate personal brand searches for executive roles. The mobile PageSpeed was struggling at 65, and the content structure lacked a focused authority mapping.",
    solution:
      "Implemented 'Person' and 'Video Object' Schema markup, built a filterable Resource Hub using Elementor, restructured taxonomy, and resolved render-blocking scripts.",
    results:
      "Achieved a desktop PageSpeed of 94, improved mobile performance toward 85+, established a strong Entity SEO foundation, and successfully deployed a filterable content hub.",
  },
  {
    slug: "moda-wellness",
    title: "Moda Wellness — Aesthetic Site",
    date: "2026-01-20",
    description:
      "Local SEO Optimization for WordPress Website. Improved speed scores, fixed loading issues, and enhanced Core Web Vitals for a wellness clinic in Bath, UK.",
    cover: "/images/projects/moda_01.png",
    client: "Moda Wellness",
    industry: "Health & Wellness",
    liveUrl: "https://www.modawellness.co.uk",
    repoUrl: "",
    role: "Web Developer & SEO Specialist",
    techStack: ["WordPress", "SEO Optimization", "Google Maps API", "Core Web Vitals", "Speed Optimization"],
    images: [
      "/images/projects/moda_01.png",
      "/images/projects/moda_02.png",
      "/images/projects/moda_03.png",
    ],
    overview:
      "Optimized Moda Wellness website for local SEO, improved performance scores, and enhanced user experience with interactive features.",
    challenge:
      "The website had slow performance scores, redundant plugins, and low visibility in local search results for the Bath area.",
    solution:
      "Compressed images, removed redundant plugins, updated metadata for every page, and implemented an interactive Google Map. Added a testimonials carousel and optimized for Core Web Vitals.",
    results:
      "Improved mobile PageSpeed score from 34 to 92 and desktop from 65 to 99, strengthened local search visibility in Bath, and delivered a detailed SEO growth plan.",
  },
  {
    slug: "ghost-cms-management",
    title: "Ghost CMS Management — Political Blog",
    date: "2026-01-15",
    description:
      "Frontend improvements for Ghost Blog – TheSinic. Applied HTML & CSS fixes, added author boxes, and integrated sidebar layouts for a modern look.",
    cover: "/images/projects/thesinicfirst.png",
    client: "TheSinic",
    industry: "Blogging / Publishing",
    liveUrl: "https://www.thesinic.com",
    repoUrl: "",
    role: "Frontend Developer — HTML & CSS Fixes, UI Customization, Ghost CMS Theme Tweaks",
    techStack: ["Ghost CMS", "HTML", "CSS", "Handlebars", "Code Injection"],
    images: [
      "/images/projects/thesinicfirst.png",
      "/images/projects/thesinicsecond.png",
      "/images/projects/thesinicthird.png",
    ],
    overview:
      "Applied HTML & CSS fixes to improve layout, spacing, and color hierarchy using Inter and Helvetica fonts for TheSinic blog.",
    challenge:
      "The blog needed UI customization and layout improvements to enhance user experience and readability, specifically around the author representation and content structure.",
    solution:
      "Integrated a sidebar layout, added an Author Box, and used Ghost Code Injection for flexible style overrides in header/footer. Updated content structure via post.hbs template.",
    results:
      "Delivered a responsive, clean, and modern blog layout that improved overall UX with better spacing, clear typography, and a professional aesthetic.",
  },
  {
    slug: "real-estate-crm",
    title: "Custom Real Estate CRM SaaS",
    date: "2025-10-15",
    description:
      "Custom CRM SaaS for real estate deal and contact management. Transformed Lovable AI mockups into secure, scalable dashboards with full backend logic and interactive UI.",
    cover: "/images/projects/closalty01.jpg",
    client: "Closalty (Real Estate)",
    industry: "Real Estate",
    liveUrl: "https://www.closalty.com",
    repoUrl: "",
    role: "Full Stack Developer",
    techStack: ["Next.js", "Supabase", "Gmail API", "RBAC", "GitHub CI/CD", "Vercel"],
    images: [
      "/images/projects/closalty01.jpg",
      "/images/projects/closalty02.jpg",
      "/images/projects/closalty03.jpg",
      "/images/projects/closalty04.jpg",
    ],
    overview:
      "Custom CRM SaaS for real estate deal and contact management. Transformed Lovable AI mockups into secure, scalable dashboards with full backend logic, frontend UI, and automated deployment.",
    challenge:
      "Transforming high-fidelity mockups from Lovable AI into a production-ready system with secure authentication, multi-role dashboards, and integrated communication tools.",
    solution:
      "Rebuilt AI mockups into real, interactive dashboards. Integrated Supabase for authentication and RBAC. Built multi-role dashboards for Superadmin, Admin, Agents, and Assistants. Added in-app Gmail API integration for direct client communication.",
    results:
      "Successfully deployed to a custom GoDaddy domain via GitHub CI/CD and Vercel. Delivered a high-performance system for managing deals, contacts, and emails securely.",
  },
  {
    slug: "neurolingva",
    title: "AI-Powered Language Learning App",
    date: "2024-01-01",
    description:
      "AI-driven language learning platform with real-time speech feedback, spaced repetition (SRS), and adaptive learning paths.",
    cover: "/images/projects/neu_01_v1.jpg",
    client: "Neurolingva",
    industry: "EdTech / AI",
    liveUrl: "",
    repoUrl: "",
    role: "Full Stack Developer",
    techStack: ["Next.js", "TypeScript", "Firebase", "Microsoft Azure", "Stripe", "Google APIs", "Tailwind CSS"],
    images: [
      "/images/projects/neu_01_v1.jpg",
      "/images/projects/neu_02_v1.jpg",
      "/images/projects/neu_03_v1.jpg",
      "/images/projects/neu_04_v1.jpg",
    ],
    overview:
      "Developed Neurolingva, an AI-driven language learning platform that helps users improve pronunciation, vocabulary retention, and fluency through advanced technology.",
    challenge:
      "Creating a seamless experience for real-time speech analysis and adaptive learning while maintaining high performance and user engagement in a complex web environment.",
    solution:
      "Integrated Microsoft Speech API for real-time pronunciation feedback, implemented SuperMemo-style SRS for vocabulary retention, and added adaptive learning paths with Firebase-backed personalization.",
    results:
      "Delivered a feature-rich platform with real-time pronunciation feedback, personalized learning paths, Stripe subscriptions, and secure Firebase authentication.",
  },
]
