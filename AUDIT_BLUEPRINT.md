# Reusable Client Website Audit Blueprint & Design System
### A Permanent Guide for High-Trust, Non-Technical Web Audits — Naveen Gaur

This blueprint serves as a permanent reference for generating and styling premium, private, unlisted website audit reports. Any future audit generated should strictly adhere to this exact visual layout, copywriting tone, and Next.js server-side framework architecture.

---

## 🎨 Part 1: Private Portal Theme & CSS Specifications

All web audit pages render inside your Next.js dynamic routing path `/audits/[slug]` on top of a custom, highly optimized warm light theme.

### 1. Global Visual Tokens
* **Background Surface**: `#FAFAF8` (Warm Off-White) — creates a gentle, welcoming, premium space.
* **Accent Primary**: `#C4A35A` (Sophisticated Gold) — used for badges, borders, and bullet points.
* **Accent Secondary**: `#725921` (Rich Dark Gold) — used for executive briefings and main titles.
* **High-Contrast Text**: `#0D0D0D` (Pure Ink Black) — used for all standard copy to guarantee extreme legibility.
* **Muted Contrast Text**: `#1E293B` (Slate Gray) — used for metadata labels and secondary captions.

### 2. Custom Layout Selector Guide
The following class structures should be used inside the compiled MDX/HTML templates:

```css
/* 1. Lead Paragraph: Greets the client warmly in rich gold */
.lead-paragraph {
  font-size: 18px !important;
  color: #725921 !important;
  font-weight: 700 !important;
  line-height: 1.6 !important;
  margin-bottom: 24px;
}

/* 2. Executive Callout Box: Highlight the core financial/business leak */
.callout-box {
  background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
  color: #0D0D0D;
  padding: 30px;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  border-left: 6px solid #C4A35A;
  margin: 35px 0;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02);
}
.callout-box h3 {
  color: #725921 !important;
  margin-top: 0 !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  margin-bottom: 10px !important;
}

/* 3. Business Impact Highlight: High-contrast, left-accent border, large text */
.business-impact-box {
  border-left: 4px solid #C4A35A;
  padding: 8px 0 8px 24px;
  margin: 36px 0 48px 0;
  font-size: 18.5px !important;
  line-height: 1.8 !important;
  color: #0D0D0D !important;
  font-weight: 600 !important;
}

/* 4. Diagnostic Metrics Footnote: Prominent Slate text under the PageSpeed circles */
p.footnote-sim {
  font-size: 14px !important;
  color: #334155 !important; /* text-slate-700 */
  text-align: center;
  margin-top: 24px;
  font-style: italic;
  font-weight: 600 !important;
}

/* 5. Prose Gapping: Ensures clean paragraph and bullet spacing */
article.prose p {
  color: #0D0D0D !important;
  font-weight: 500 !important;
  margin-bottom: 24px !important;
  line-height: 1.8 !important;
}
article.prose ul {
  margin-bottom: 24px !important;
  padding-left: 24px !important;
}
article.prose li {
  color: #0D0D0D !important;
  font-weight: 500 !important;
  margin-bottom: 16px !important;
  line-height: 1.8 !important;
  list-style-type: disc !important;
}
article.prose li::marker {
  color: #C4A35A !important; /* Premium gold list bullets */
}

/* 6. Contact Signature: Bold footer closing block */
.contact-details {
  font-size: 17px !important;
  color: #1E293B !important;
  margin-top: 30px;
  line-height: 1.8 !important;
  font-weight: 600 !important;
}
.contact-details strong {
  font-size: 20px !important;
  color: #0D0D0D !important;
  display: inline-block;
  margin-bottom: 6px;
}
```

---

## ✍️ Part 2: Non-Technical outcome-Oriented Copywriting Strategy

Trauma recovery coaches, somatic healers, medical doctors, and independent business owners are highly skilled clinical professionals but **rarely technical experts**. All reports must translate tech stats into commercial and brand-image values:

1. **Empathy First**: Begin the report by framing the website as the client's **digital room** or **virtual clinic**. It should be warm, inviting, and trigger instantaneous trust.
2. **Translate Acronyms Immediately**:
   * **Do NOT write**: *"Your LCP is 16.7s which triggers high CLS and blocks dynamic thread rendering."*
   * **DO write**: *"Your high-resolution homepage graphics are unoptimized, taking 16.7 seconds to load visually on mobile phones. Under standard Google benchmarks, this forces over 50% of visitors to bounce before reading about your expertise."*
3. **Outcome-Driven Terminology**:
   * *Largest Contentful Paint (LCP)* $\rightarrow$ **Mobile Visual Load Time**
   * *Total Blocking Time (TBT)* $\rightarrow$ **Page Loading Freeze (Background script delay)**
   * *Cumulative Layout Shift (CLS)* $\rightarrow$ **Visual Layout Shifting (Heavy assets popping on screen)**
   * *Caching headers* $\rightarrow$ **Returning Visitor Memory Settings**
4. **Use Structured Bullets**: Break complex technical points into lists with clear, bold, highlighted headers (e.g. `**1.3 MB Hero Banner Leak:**`) so they can scan and understand everything in under 1 minute.

---

## ⚙️ Part 3: MDX Formatting & React Hydration Safety

To prevent Next.js Server-Side Rendering (SSR) compilation warnings and client-side hydration mismatches:

1. **Avoid DOM Nesting Violations**:
   * *Invalid Nesting*: Standard MDX auto-wraps inline blocks in `<p>` tags. Writing `<p className="lead-paragraph"><strong>Dear Katie,</strong></p>` translates to `<p><p>...</p></p>` in React, throwing a critical hydration error.
   * *Correct Pattern*: Use `div` containers for custom styled elements! Always write:
     `<div className="lead-paragraph"><strong>Dear Katie,</strong></div>`
2. **HTML Block Encapsulation**: Keep block elements (like callout boxes, finding lists, pricing sections, and footer closings) neatly wrapped in standard, self-contained HTML `<div>` tags. Do not put empty markdown newlines inside these HTML blocks; use raw HTML formatting inside them (e.g. `<strong>` instead of `**`, and `<ul>`/`<li>` tags).

---

## 🚀 Part 4: 100% Automated PageSpeed API Queries

You do **NOT** need to provide any scores manually when generating new client audits! Our tooling has already automated this.

### 1. How It Works
Your local Python auditing tool `site_audit.py` reads a single configuration file (`audit_brief.json`), links to the Google PageSpeed API, and fetches the complete data.
* **Free API Key**: Fully pre-configured in `config.json` (free tier allows up to 25,000 queries per day).
* **Automated Data Retrieval**: The script queries Google PageSpeed for **both mobile and desktop devices**, retrieving:
  * Categories: Performance, Accessibility, Best Practices, SEO.
  * Audit speed parameters: FCP, LCP, TBT, CLS, Speed Index.
  * Specific speed opportunities (like image compression savings or script block freezes).
* **One-Click MDX Export**: Instantly exports the compiled data as a beautifully formatted `.mdx` content file directly into your portfolio repository folder (`naveengaur-portfolio/src/content/audits/[slug].mdx`), making it immediately viewable in the web portal!

### 2. How to Launch a New Report
1. Open [audit_brief.json](file:///C:/Users/verti/Robyn%20USA%20project/audit-tool/audit_brief.json) and set the client's URL and brand name:
   ```json
   {
     "url": "https://newclient.com",
     "client_name": "New Client Practice"
   }
   ```
2. Run the automated bat file inside the `audit-tool` folder:
   `RUN_AUDIT.bat`
   *(This launches `python site_audit.py` which fetches the PageSpeed scores, writes the HTML and PDF reports under `reports/`, compiles the raw data into an unlisted `.mdx` file, and saves it in your portfolio content folder!)*
3. Verify the final unlisted production URL:
   `https://naveengaur.com/audits/[slug]`
