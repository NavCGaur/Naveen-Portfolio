export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Naveen Gaur",
    url: "https://naveengaur.com",
    email: "hello@naveengaur.com",
    telephone: "+919920899845",
    jobTitle: "Freelance WordPress Developer & Full-Stack Web Developer",
    description:
      "Freelance WordPress developer specializing in emergency fixes, speed optimization, malware removal, and ongoing maintenance for small businesses and founders globally.",
    knowsAbout: [
      "WordPress Development",
      "WordPress Speed Optimization",
      "WordPress Malware Removal",
      "WordPress Crash Recovery",
      "WooCommerce Development",
      "PHP",
      "MySQL",
      "JavaScript",
      "Next.js",
      "On-Page SEO",
      "Core Web Vitals",
      "Web Performance",
      "Website Security",
      "SSL Configuration",
    ],
    sameAs: [
      "https://www.upwork.com/freelancers/naveengaur",
      "https://linkedin.com/in/naveengaur",
      "https://wa.me/919920899845",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dehradun",
      addressRegion: "Uttarakhand",
      addressCountry: "IN",
    },
    workLocation: {
      "@type": "VirtualLocation",
      description: "Remote — serving clients globally in US, UK, and worldwide",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Naveen Gaur — Freelance WordPress Developer",
    url: "https://naveengaur.com",
    description:
      "Hire a freelance WordPress developer for emergency fixes, speed optimization, malware removal, and monthly maintenance retainers.",
    author: {
      "@type": "Person",
      name: "Naveen Gaur",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://naveengaur.com/blog?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Naveen Gaur — Freelance WordPress Developer & Speed Expert",
    url: "https://naveengaur.com",
    description:
      "Portfolio and services page for Naveen Gaur, a freelance WordPress developer offering emergency fixes, performance audits, and maintenance retainers for small businesses.",
    author: {
      "@type": "Person",
      name: "Naveen Gaur",
    },
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      url: "https://naveengaur.com",
    },
    about: {
      "@type": "Service",
      name: "Freelance WordPress Development & Maintenance",
    },
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Naveen Gaur — Freelance WordPress Developer",
    url: "https://naveengaur.com",
    telephone: "+919920899845",
    email: "hello@naveengaur.com",
    description:
      "Freelance WordPress developer offering emergency crash recovery, speed optimization, malware removal, and monthly maintenance retainers for small business websites globally.",
    provider: {
      "@type": "Person",
      name: "Naveen Gaur",
    },
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "United Kingdom" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Australia" },
      { "@type": "Country", name: "India" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "WordPress Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WordPress Emergency Fix & Crash Recovery",
            description:
              "Site down, hacked, or host suspended — I diagnose the root cause, restore your site, and prevent it from happening again. Starts from $60.",
          },
          price: "60",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "60",
            priceCurrency: "USD",
            unitText: "starting from",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WordPress Speed Optimization & Performance Audit",
            description:
              "Full speed, SEO health, security posture, and plugin architecture review. Core Web Vitals improvement with a prioritized action plan.",
          },
          price: "150",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WordPress Malware Removal & Security Hardening",
            description:
              "Clean malware infections, remove backdoors, fix blacklisted domains, and harden your WordPress site so it does not get hacked again.",
          },
          price: "60",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "60",
            priceCurrency: "USD",
            unitText: "starting from",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WordPress Essential Maintenance Retainer",
            description:
              "Weekly off-site backups, supervised plugin and theme updates, 24/7 uptime monitoring, and a monthly plain-English health report.",
          },
          price: "29",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "29",
            priceCurrency: "USD",
            unitText: "per month",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "WordPress Growth & Performance Retainer",
            description:
              "Everything in Essential plus continuous speed tuning, SEO monitoring, priority support, and 1 hour of custom development per month.",
          },
          price: "99",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "99",
            priceCurrency: "USD",
            unitText: "per month",
          },
        },
      ],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why did my WordPress site crash after a plugin update?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WordPress site crashes after plugin updates are most often caused by a PHP version conflict, a theme-plugin incompatibility, or a corrupt database table triggered by the update. The fix involves identifying the conflicting plugin via error logs or safe mode, rolling back the update, and patching the conflict at the code level. I diagnose and resolve these typically within a few hours.",
        },
      },
      {
        "@type": "Question",
        name: "How do I speed up a slow WordPress website?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Speeding up a WordPress site requires fixing the root cause — not just installing a caching plugin. Key improvements include: server-level caching (Redis/Memcached), image optimization and lazy loading, eliminating render-blocking scripts, database query optimization, choosing a proper hosting plan, and implementing a CDN. My performance audit covers all of these and delivers a prioritized action plan.",
        },
      },
      {
        "@type": "Question",
        name: "How do I recover a hacked WordPress website?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WordPress malware recovery involves: scanning all files and the database for infected code, removing malware and backdoors manually, updating all credentials and secret keys, patching the vulnerability that allowed the hack (often an outdated plugin, theme, or PHP version), and submitting a reconsideration request if the domain was blacklisted by Google. I also add firewall rules and harden file permissions to prevent re-infection.",
        },
      },
      {
        "@type": "Question",
        name: "What does a WordPress maintenance plan include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "My Essential plan ($29/month) includes weekly off-site backups, supervised theme and plugin updates, 24/7 uptime monitoring, security scanning, and a monthly plain-English health report. The Growth plan ($99/month) adds continuous speed optimisation, SEO monitoring, priority support, and 1 hour of custom development per month.",
        },
      },
      {
        "@type": "Question",
        name: "How quickly can you fix a crashed or hacked WordPress site?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most emergency fixes are resolved within 24–48 hours. Simple issues like plugin conflicts or host suspensions are often resolved the same day. Emergency work starts from $60 depending on the complexity.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a WordPress developer and a full-stack developer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most WordPress developers work exclusively inside the WordPress dashboard using plugins. As a full-stack developer, I also work at the server level, in the database, and with custom code. This means I can solve problems others cannot, and build leaner, faster solutions without relying on bloated plugins.",
        },
      },
      {
        "@type": "Question",
        name: "Why is no one finding my WordPress site on Google?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Poor Google rankings for a WordPress site are typically caused by: missing or incorrect meta titles and descriptions, slow Core Web Vitals scores (especially LCP and CLS), lack of structured data markup, thin or duplicate content, and missing internal linking. My SEO audit identifies exactly which issues are hurting your visibility and provides a clear, prioritized fix list.",
        },
      },
      {
        "@type": "Question",
        name: "How does the Free 5-Minute Video Audit work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You submit your URL and biggest website frustration. I personally record a 5-minute Loom video where I look under the hood of your site, identify performance bottlenecks, and give you 3 actionable fixes. No generic automated scores, just real human expertise.",
        },
      },
      {
        "@type": "Question",
        name: "What are the benefits of a white-label Agency Partnership?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Agency partnerships allow design and marketing firms to outsource their technical WordPress heavy-lifting. I provide white-label support, 24/7 monitoring, and priority emergency fixes for your clients, allowing you to focus on design and strategy while I handle the code and servers.",
        },
      },
      {
        "@type": "Question",
        name: "Why should I hire a professional for a WordPress migration?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Automated migration plugins often fail on large sites, corrupt databases, or break SEO permalinks. I perform manual migrations with zero downtime, ensuring all data, images, and SEO rankings are preserved perfectly during the move to a new host.",
        },
      },
      {
        "@type": "Question",
        name: "How do I contact you to start a project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can reach me by filling out the contact form on this page, emailing me at hello@naveengaur.com, or messaging me on WhatsApp at +91 9920899845. I respond within 24 hours.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
