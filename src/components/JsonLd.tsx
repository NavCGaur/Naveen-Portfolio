export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Naveen Gaur",
    url: "https://naveengaur.com",
    email: "naveencg070@gmail.com",
    telephone: "+919920899845",
    jobTitle: "WordPress Developer & Full-Stack Web Developer",
    description:
      "I build, fix, and maintain WordPress websites for small businesses and founders who are tired of slow pages, surprise downtime, and developers who disappear.",
    knowsAbout: [
      "WordPress",
      "WooCommerce",
      "PHP",
      "MySQL",
      "JavaScript",
      "SEO",
      "Web Performance",
      "Website Security",
    ],
    sameAs: ["https://www.upwork.com/freelancers/naveengaur"],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Person",
      name: "Naveen Gaur",
      url: "https://naveengaur.com",
    },
    serviceType: "WordPress Development & Maintenance",
    name: "WordPress Website Services",
    description:
      "Emergency fixes, performance audits, custom development, and monthly maintenance retainers for WordPress websites.",
    offers: [
      {
        "@type": "Offer",
        name: "Emergency Fix & Recovery",
        description:
          "Site down, hacked, or host suspended — I find the cause, fix it, and prevent it from happening again.",
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
        name: "Site Growth & Performance Audit",
        description:
          "Speed, SEO health, security posture, and plugin architecture review with a prioritized action plan.",
        price: "150",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Essential Maintenance Retainer",
        description:
          "Weekly backups, supervised updates, uptime monitoring, and monthly health reports.",
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
        name: "Growth & Performance Retainer",
        description:
          "Everything in Essential plus speed tuning, SEO monitoring, priority support, and 1 hour of development per month.",
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
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does a WordPress maintenance plan include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "My Essential plan includes weekly off-site backups, supervised theme and plugin updates, 24/7 uptime monitoring, security scanning, and a monthly plain-English health report. The Growth plan adds continuous speed optimisation, SEO monitoring, priority support, and 1 hour of custom development per month.",
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
          text: "Most WordPress developers work exclusively inside the WordPress dashboard using plugins. As a full-stack developer, I can also work at the server level, in the database, and with custom code. This means I can solve problems others can't, and build leaner, faster solutions without relying on bloated plugins.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer WordPress SEO services?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. My Site Growth & Performance Audit includes a full SEO health review covering search rankings, meta configuration, Core Web Vitals, and structured data. My Growth retainer includes ongoing SEO monitoring and monthly insights.",
        },
      },
      {
        "@type": "Question",
        name: "How do I contact you to start a project?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can reach me by filling out the contact form on this page, emailing me at naveencg070@gmail.com, or chatting directly on WhatsApp at +91 9920899845.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
