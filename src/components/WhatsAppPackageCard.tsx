"use client";

import { trackOutboundClick } from "@/lib/ga";

// ─────────────────────────────────────────────────────────────────────────────
// PACKAGE CONFIG — edit all values here, not in the JSX below
// ─────────────────────────────────────────────────────────────────────────────
const PACKAGE = {
  packageName: "Starter WhatsApp Bot",
  price: 29,
  regularPrice: 99,
  currency: "$",
  deliveryText: "3–5 days",
  supportText: "30 days of support included",
  careRate: 9,
  packageWhatsAppNumber: "916396137981",
  // Set demoEnabled to true once the demo bot has run stably
  demoEnabled: false,
  demoWhatsAppNumber: "916396137981",
};

const WHAT_IS_INCLUDED = [
  "Menu and keyword replies (hours, location, services, FAQs)",
  "Collects customer name and need, sent straight to you",
  "\"Talk to a human\" option when someone needs you",
  `Set up and tested in ${PACKAGE.deliveryText}`,
  PACKAGE.supportText,
];

interface Props {
  /** The slug of the current article — used to prefill the WhatsApp message */
  articleSlug: string;
}

export default function WhatsAppPackageCard({ articleSlug }: Props) {
  const packageMessage = encodeURIComponent(
    `Hi Naveen, I'm interested in the ${PACKAGE.packageName} (${PACKAGE.currency}${PACKAGE.price}). Can we get started?`
  );
  const demoMessage = encodeURIComponent(
    `Hi Naveen, I'd like to try the WhatsApp bot demo I saw on your article.`
  );
  const customMessage = encodeURIComponent(
    `Hi Naveen, I read your article and need something more custom than the starter package.`
  );

  const packageUrl = `https://wa.me/${PACKAGE.packageWhatsAppNumber}?text=${packageMessage}`;
  const demoUrl = `https://wa.me/${PACKAGE.demoWhatsAppNumber}?text=${demoMessage}`;
  const customUrl = `https://wa.me/${PACKAGE.packageWhatsAppNumber}?text=${customMessage}`;

  return (
    <div
      className="blog-card border blog-border rounded-xl my-12 overflow-hidden shadow-lg"
      id="whatsapp-package"
    >
      {/* Header band */}
      <div
        style={{
          background: "var(--color-gold, #C4A35A)",
          padding: "10px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: "12px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#0D0D0D",
          }}
        >
          WhatsApp Bot Package
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: 600,
            color: "#0D0D0D",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#25D366",
              boxShadow: "0 0 6px rgba(37,211,102,0.7)",
              display: "inline-block",
            }}
          />
          Ready in {PACKAGE.deliveryText}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "28px 28px 24px" }}>
        {/* Heading */}
        <h3
          className="blog-heading font-serif"
          style={{
            fontSize: "clamp(20px, 3vw, 26px)",
            fontWeight: 700,
            lineHeight: 1.25,
            marginBottom: "10px",
          }}
        >
          Need a simple WhatsApp bot for your business?
        </h3>
        <p
          className="blog-text-muted"
          style={{ fontSize: "15px", lineHeight: 1.65, marginBottom: "20px" }}
        >
          Answers your customers&apos; common questions automatically, 24/7, and
          passes real enquiries to you.
        </p>

        {/* Included list */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "0 0 24px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {WHAT_IS_INCLUDED.map((item) => (
            <li
              key={item}
              className="blog-text-muted"
              style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", lineHeight: 1.55 }}
            >
              <span style={{ color: "#25D366", marginTop: "2px", flexShrink: 0 }}>✓</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "10px",
            marginBottom: "6px",
            flexWrap: "wrap",
          }}
        >
          <span
            className="blog-heading"
            style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1 }}
          >
            {PACKAGE.currency}{PACKAGE.price}
          </span>
          <span
            className="blog-text-muted"
            style={{
              fontSize: "15px",
              textDecoration: "line-through",
              opacity: 0.55,
            }}
          >
            {PACKAGE.currency}{PACKAGE.regularPrice}
          </span>
          <span className="blog-text-muted" style={{ fontSize: "14px" }}>
            one-time
          </span>
        </div>
        <p
          className="blog-text-muted"
          style={{ fontSize: "13px", marginBottom: "20px", lineHeight: 1.5 }}
        >
          Optional care plan:{" "}
          <strong>
            {PACKAGE.currency}{PACKAGE.careRate}/month
          </strong>{" "}
          (hosting, monitoring, small edits)
          <br />
          <span style={{ opacity: 0.7 }}>
            Good for: small businesses with steady, low-to-moderate message volume.
          </span>
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Primary — Get this package */}
          <a
            href={packageUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundClick("whatsapp_package_cta", articleSlug)}
            id="whatsapp-package-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "#25D366",
              color: "#0D0D0D",
              padding: "13px 20px",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.15s",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#20ba5a";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.01)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#25D366";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "18px", height: "18px", flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Get this package — {PACKAGE.currency}{PACKAGE.price}
          </a>

          {/* Secondary — Try live demo (hidden until demoEnabled) */}
          {PACKAGE.demoEnabled && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutboundClick("whatsapp_demo_cta", articleSlug)}
              id="whatsapp-demo-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                background: "transparent",
                color: "var(--bt-heading)",
                padding: "12px 20px",
                borderRadius: "6px",
                border: "1.5px solid var(--bt-border)",
                fontWeight: 600,
                fontSize: "14px",
                textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#25D366";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--bt-border)";
              }}
            >
              Try the live demo →
            </a>
          )}
        </div>

        {/* Custom build text link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "16px",
            fontSize: "13px",
          }}
          className="blog-text-muted"
        >
          Something more complex?{" "}
          <a
            href={customUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundClick("whatsapp_custom_cta", articleSlug)}
            style={{ color: "var(--color-gold, #C4A35A)", fontWeight: 600, textDecoration: "underline" }}
          >
            Talk to me about a custom build
          </a>
        </p>
      </div>
    </div>
  );
}
