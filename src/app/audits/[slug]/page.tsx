import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

interface Props {
  params: Promise<{ slug: string }>;
}

// Instruct all search engines not to index these private audit pages
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

function getAuditBySlug(slug: string) {
  const auditDirectory = path.join(process.cwd(), "src/content/audits");
  const filePath = path.join(auditDirectory, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) return null;
  
  const fileContent = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContent);
  return {
    meta: data,
    content: content,
  };
}

// Score styling helpers - high legibility in light theme
function getScoreColorClass(score: any) {
  if (score === "N/A" || score === undefined) return "text-amber-600 border-amber-200 bg-amber-50/30";
  const s = Number(score);
  if (s >= 90) return "text-emerald-600 border-emerald-200 bg-emerald-50/30";
  if (s >= 50) return "text-amber-600 border-amber-200 bg-amber-50/30";
  return "text-red-600 border-red-200 bg-red-50/30";
}

function getBadgeColorClass(value: string, key: string) {
  if (!value || value === "N/A") return "bg-amber-50 text-amber-700 border-amber-200";
  const num = parseFloat(value.replace(/[^\d.]/g, ""));
  if (isNaN(num)) return "bg-amber-50 text-amber-700 border-amber-200";

  // Benchmarks
  let status = "good";
  if (key === "fcp") {
    if (num > 3.0) status = "poor";
    else if (num > 1.8) status = "needs-work";
  } else if (key === "lcp") {
    if (num > 4.0) status = "poor";
    else if (num > 2.5) status = "needs-work";
  } else if (key === "tbt") {
    if (num > 600) status = "poor";
    else if (num > 200) status = "needs-work";
  } else if (key === "cls") {
    if (num > 0.25) status = "poor";
    else if (num > 0.1) status = "needs-work";
  } else if (key === "speed_index") {
    if (num > 5.8) status = "poor";
    else if (num > 3.4) status = "needs-work";
  }

  if (status === "good") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "poor") return "bg-red-50 text-red-700 border-red-200";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

function getBadgeText(value: string, key: string) {
  const badgeClass = getBadgeColorClass(value, key);
  if (badgeClass.includes("emerald")) return "Good";
  if (badgeClass.includes("red")) return "Critical";
  return "Needs Work";
}

const mdxComponents = {
  table: (props: any) => (
    <div className="table-wrapper my-8 overflow-x-auto w-full rounded-xl border border-slate-200 bg-white shadow-sm">
      <table {...props} className="w-full border-collapse text-left text-[14px]" />
    </div>
  ),
  a: (props: any) => {
    const isExternal = props.href?.startsWith("http");
    return (
      <a 
        {...props} 
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-[#C4A35A] hover:text-[#d4b46a] font-bold underline transition-colors" 
      />
    );
  },
};

export default async function AuditPage({ params }: Props) {
  const { slug } = await params;
  const audit = getAuditBySlug(slug);
  
  if (!audit) notFound();
  
  const { meta, content } = audit;

  // Premium LIGHT THEME CSS for client-specific components like .callout-box, .stat-grid, .finding-item etc.
  const customStyles = `
    :root {
      --accent: #C4A35A;
      --text-dark: #0D0D0D;
      --text-muted: #1E293B;
      --text-paragraph: #0D0D0D; /* Set all paragraph copy to pure dark text for maximum legibility */
    }
    
    .lead-paragraph {
      font-size: 18px !important;
      color: #725921 !important; /* Rich premium dark gold */
      font-weight: 700 !important;
      line-height: 1.6 !important;
      margin-bottom: 24px;
    }

    .business-impact-box {
      border-left: 4px solid #C4A35A;
      padding: 8px 0 8px 24px;
      margin: 36px 0 48px 0;
      font-size: 18.5px !important;
      line-height: 1.8 !important;
      color: #0D0D0D !important;
      font-weight: 600 !important;
    }

    .callout-box {
      background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
      color: #0D0D0D;
      padding: 30px;
      border-radius: 12px;
      border: 1px solid #E2E8F0;
      border-left: 6px solid #C4A35A;
      margin: 35px 0;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 2px 4px -1px rgba(0,0,0,0.01);
    }

    .callout-box h3 {
      color: #725921 !important;
      margin-top: 0 !important;
      font-size: 18px !important;
      font-weight: 700 !important;
      margin-bottom: 10px !important;
    }

    .callout-box p {
      color: #0D0D0D !important;
      margin-bottom: 0 !important;
      font-size: 15px !important;
      font-weight: 500 !important;
      line-height: 1.6 !important;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin: 30px 0;
    }

    .stat-card {
      background: #FFFFFF;
      border-top: 4px solid #C4A35A;
      border-radius: 8px;
      padding: 20px 25px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.02);
      border-left: 1px solid #E2E8F0;
      border-right: 1px solid #E2E8F0;
      border-bottom: 1px solid #E2E8F0;
    }

    .stat-card.negative {
      border-top-color: #EF4444;
    }

    .stat-card.positive {
      border-top-color: #10B981;
    }

    .stat-value {
      font-family: var(--font-serif), serif;
      font-size: 40px;
      font-weight: 700;
      display: block;
      margin-bottom: 5px;
    }

    .stat-value.red-text { color: #DC2626; }
    .stat-value.green-text { color: #059669; }

    .stat-label {
      font-size: 11px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 700;
    }

    .finding-item {
      display: flex;
      align-items: flex-start;
      margin-bottom: 25px;
      padding: 20px;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      background: #FFFFFF;
      box-shadow: 0 1px 3px rgba(0,0,0,0.01);
    }

    .finding-icon {
      font-size: 24px;
      margin-right: 20px;
      background: #F8FAFC;
      padding: 10px;
      border-radius: 8px;
      min-width: 64px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #E2E8F0;
    }

    .finding-content h3 {
      margin: 0 0 8px 0 !important;
      font-size: 16px;
      color: #0D0D0D !important;
      font-weight: 700;
    }

    .finding-content p {
      margin: 0 !important;
      font-size: 14.5px !important;
      color: #0D0D0D !important; /* Pure dark text */
      line-height: 1.6 !important;
      font-weight: 500 !important;
    }

    .footer-closing {
      text-align: center;
      margin-top: 60px;
      padding-top: 40px;
      border-top: 1px solid #E2E8F0;
    }

    .footer-quote {
      font-family: var(--font-serif), serif;
      font-size: 20px;
      font-style: italic;
      color: #0D0D0D;
      max-width: 600px;
      margin: 0 auto 20px auto;
      line-height: 1.5;
      font-weight: 600;
    }

    .contact-details {
      font-size: 17px !important; /* Premium prominent footer details */
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

    /* Strict high-contrast text color overlays for standard prose classes with perfect spacing */
    article.prose p {
      color: #0D0D0D !important;
      font-weight: 500 !important;
      margin-bottom: 24px !important;
      line-height: 1.8 !important;
    }
    
    article.prose ul, article.prose ol {
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
      color: #C4A35A !important; /* Premium gold list bullet color */
    }

    article.prose strong {
      color: #0D0D0D !important;
      font-weight: 700 !important;
    }

    article.prose h2, article.prose h3 {
      color: #0D0D0D !important;
      font-weight: 700 !important;
      margin-top: 40px !important;
      margin-bottom: 16px !important;
    }

    /* Print styling overrides - pure black text and high contrast */
    @media print {
      body {
        background: white !important;
        color: black !important;
      }
      header, main, section, div, p, span, td, th, h1, h2, h3, a, li, ul, strong {
        color: black !important;
        background: none !important;
        text-shadow: none !important;
        box-shadow: none !important;
      }
      .print\\:hidden {
        display: none !important;
      }
      .print\\:bg-none {
        background: none !important;
      }
      .print\\:border-none {
        border: none !important;
      }
      .print\\:text-black {
        color: black !important;
      }
      .print\\:border-b-2 {
        border-bottom-width: 2px !important;
        border-color: #000000 !important;
      }
      .print\\:border-black\\/10 {
        border-color: #000000 !important;
      }
      .print\\:prose-black {
        color: black !important;
      }
      .page-break {
        page-break-before: always;
        break-before: always;
      }
      h2, h3 { 
        page-break-after: avoid; 
        break-after: avoid; 
      }
      .finding-item, .stat-card, .callout-box, table, tr { 
        page-break-inside: avoid; 
        break-inside: avoid; 
        border: 2px solid #000000 !important;
        background: #ffffff !important;
      }
      .callout-box {
        border-left: 8px solid #000000 !important;
      }
      .stat-card.negative, .stat-card.positive {
        border-top: 6px solid #000000 !important;
      }
      th {
        border-bottom: 2px solid #000000 !important;
        font-weight: bold !important;
      }
    }
  `;

  return (
    <>
      <Nav />
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Fixed top unlisted alert bar with Confidential Analysis Pill */}
      <div className="fixed top-20 left-0 w-full z-45 bg-[#FAFAF8]/95 backdrop-blur-md border-b border-slate-200 py-3 px-6 md:px-10 flex justify-between items-center print:hidden shadow-sm">
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#C4A35A] animate-pulse"></span>
          <span className="text-[12px] font-mono tracking-widest text-[#725921] uppercase font-bold">
            Private Client Portal
          </span>
        </div>
        
        {/* Moved Confidential Analysis Pill here */}
        <span className="px-3.5 py-1 bg-[#C4A35A]/10 border border-[#C4A35A]/20 text-[#725921] rounded-full text-[10.5px] font-bold tracking-widest uppercase shadow-sm">
          Confidential Analysis
        </span>
      </div>

      <main className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] pt-36 pb-24 px-6 md:px-10 selection:bg-[#C4A35A] selection:text-[#0D0D0D]">
        <div className="max-w-[860px] mx-auto">
          
          {/* Header Area */}
          <header className="text-center mb-16 border-b border-slate-200 pb-12 print:border-b-2 print:border-black">
            <h1 className="font-serif text-[clamp(32px,5vw,48px)] text-[#0D0D0D] tracking-[0.01em] leading-[1.2] mb-6">
              {meta.clientName}: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#725921] via-[#C4A35A] to-[#0D0D0D] print:text-black print:bg-none">
                Executive Visibility &amp; Growth Audit
              </span>
            </h1>
            
            {/* Expanded highly legible client metadata block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-[680px] mx-auto mt-10 p-7 bg-white border border-slate-200 rounded-xl text-left print:bg-none print:border-none print:text-black shadow-sm">
              <div>
                <span className="block text-slate-500 uppercase tracking-widest font-bold text-[14px] mb-2 print:text-black/60">Client Site</span>
                <a href={meta.url} target="_blank" rel="noopener noreferrer" className="text-[19px] font-bold text-[#0D0D0D] hover:text-[#C4A35A] transition-colors print:text-black underline block">
                  {meta.url.replace("https://", "").replace("www.", "")}
                </a>
              </div>
              <div>
                <span className="block text-slate-500 uppercase tracking-widest font-bold text-[14px] mb-2 print:text-black/60">Prepared By</span>
                <span className="text-[19px] font-bold text-[#0D0D0D] print:text-black block">Naveen Gaur</span>
              </div>
              <div>
                <span className="block text-slate-500 uppercase tracking-widest font-bold text-[14px] mb-2 print:text-black/60">Date of Audit</span>
                <span className="text-[19px] font-bold text-[#0D0D0D] print:text-black block">{meta.auditDate}</span>
              </div>
            </div>
          </header>

          {/* Performance Dashboard Circles */}
          <section className="mb-14 print:break-inside-avoid">
            <h2 className="font-serif text-[20px] text-slate-500 tracking-wider uppercase mb-6 text-center print:text-black/80 font-bold">
              Google PageSpeed Diagnostics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Performance", score: meta.mobileScore },
                { label: "Accessibility", score: meta.mobileAccessibility },
                { label: "Best Practices", score: meta.mobileBestPractices },
                { label: "SEO", score: meta.mobileSeo },
              ].map((card, idx) => (
                <div key={idx} className="p-6 bg-white border border-slate-200 rounded-xl text-center print:border-none print:bg-none print:text-black shadow-sm">
                  <span className={`block font-serif text-[44px] font-bold mb-2 leading-none ${getScoreColorClass(card.score).split(" ")[0]} print:text-black`}>
                    {card.score}
                  </span>
                  <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider print:text-black/60">
                    {card.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[14px] text-slate-700 text-center mt-6 italic print:text-black/50 font-semibold">
              * Scores reflect Google mobile simulation (the primary basis for ranking organic searches).
            </p>
          </section>

          {/* Core Web Vitals Comparisons */}
          <section className="mb-16 print:break-inside-avoid">
            <h2 className="font-serif text-[20px] text-slate-500 tracking-wider uppercase mb-6 text-center print:text-black/80 font-bold">
              The Five Core Speed Measurements
            </h2>
            <div className="table-wrapper overflow-x-auto rounded-xl border border-slate-200 bg-white print:border-none print:bg-none print:text-black shadow-sm">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 print:border-b-2 print:border-black">
                    <th className="p-4 text-[#1E293B] font-bold uppercase tracking-wider text-[11px] print:text-black">Measurement</th>
                    <th className="p-4 text-[#1E293B] font-bold uppercase tracking-wider text-[11px] print:text-black">🖥️ Desktop</th>
                    <th className="p-4 text-[#1E293B] font-bold uppercase tracking-wider text-[11px] print:text-black">📱 Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "First Contentful Paint (FCP)", key: "fcp", desktop: meta.desktopFcp, mobile: meta.mobileFcp },
                    { name: "Largest Contentful Paint (LCP)", key: "lcp", desktop: meta.desktopLcp, mobile: meta.mobileLcp },
                    { name: "Total Blocking Time (TBT)", key: "tbt", desktop: meta.desktopTbt, mobile: meta.mobileTbt },
                    { name: "Cumulative Layout Shift (CLS)", key: "cls", desktop: meta.desktopCls, mobile: meta.mobileCls },
                    { name: "Speed Index", key: "speed_index", desktop: meta.desktopSpeedIndex, mobile: meta.mobileSpeedIndex },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-slate-100 last:border-0 print:border-b print:border-black/10">
                      <td className="p-4 font-semibold text-[#0D0D0D] print:text-black">{row.name}</td>
                      <td className="p-4">
                        <span className="font-semibold mr-2 print:text-black text-[#0D0D0D]">{row.desktop}</span>
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[9px] font-bold uppercase ${getBadgeColorClass(row.desktop, row.key)} print:text-black print:border-black`}>
                          {getBadgeText(row.desktop, row.key)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold mr-2 print:text-black text-[#0D0D0D]">{row.mobile}</span>
                        <span className={`inline-block px-2.5 py-0.5 border rounded-full text-[9px] font-bold uppercase ${getBadgeColorClass(row.mobile, row.key)} print:text-black print:border-black`}>
                          {getBadgeText(row.mobile, row.key)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Master Written Audit & Copy (MDX rendering) */}
          <article className="prose max-w-none print:prose-black">
            <MDXRemote 
              source={content} 
              components={mdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                }
              }}
            />
          </article>

        </div>
      </main>
      
      <Footer />
    </>
  );
}
