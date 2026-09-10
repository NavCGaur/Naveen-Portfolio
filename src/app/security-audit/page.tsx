"use client";

import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import * as ga from "@/lib/ga";

export default function SecurityAuditPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#FAFAF8] text-[#0D0D0D] font-sans antialiased pt-[120px] pb-24">
        
        {/* Header Hero Section */}
        <section className="px-6 max-w-[900px] mx-auto text-center mb-16 animate-fade-up">
          <span className="inline-flex items-center text-[12px] font-semibold tracking-[0.12em] uppercase text-gold-dark mb-5 px-3.5 py-1.5 border border-gold bg-gold-light rounded-full">
            WordPress &amp; Ghost CMS Security Audit
          </span>
          <h1 className="font-serif text-[clamp(36px,5vw,56px)] tracking-[-0.025em] leading-[1.1] text-ink mb-6">
            Full Website Security Audit — <span className="text-gold-dark">$29</span>
          </h1>
          <p className="text-[18px] text-[#334155] leading-[1.7] max-w-[760px] mx-auto font-normal mb-4">
            Most &quot;free security scanners&quot; only check if your plugins are up to date. They don&apos;t read your actual code, they don&apos;t check where your form data goes, and they don&apos;t verify who still has hidden access to your site.
          </p>
          <p className="text-[15.5px] text-[#475569] leading-[1.65] max-w-[740px] mx-auto font-medium">
            With a background as a Full-Stack Developer specializing in server management, hosting architecture, and deep CMS security (WordPress &amp; Ghost CMS), I inspect your web ecosystem at both the application and infrastructure level.
          </p>
        </section>

        {/* What's Included vs Standard Scanners */}
        <section className="px-6 max-w-[960px] mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Standard Scanners */}
            <div className="bg-white border border-[#E2E8F0] p-8 rounded-xl shadow-xs">
              <span className="text-[12px] font-bold tracking-[0.1em] text-red-600 uppercase block mb-3">
                Automated Plugins &amp; Free Scanners
              </span>
              <h2 className="text-[20px] font-semibold text-ink mb-4">What They Miss</h2>
              <ul className="space-y-3.5 text-[15px] text-[#475569] leading-relaxed">
                <li className="flex gap-2.5 items-start">
                  <span className="text-red-500 font-bold shrink-0">✗</span>
                  <span>Only scan for known malware signatures from a public database.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-red-500 font-bold shrink-0">✗</span>
                  <span>Cannot read custom PHP snippets to detect unauthorized data forwarding.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-red-500 font-bold shrink-0">✗</span>
                  <span>Ignore hardcoded email copies in form submission handlers.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-red-500 font-bold shrink-0">✗</span>
                  <span>Cannot detect unoffboarded admin accounts or server-level keys.</span>
                </li>
              </ul>
            </div>

            {/* Manual Human Line-by-Line Audit */}
            <div className="bg-white border-2 border-gold/40 p-8 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold via-gold-dark to-gold" />
              <span className="text-[12px] font-bold tracking-[0.1em] text-gold-dark uppercase block mb-3">
                Manual Line-By-Line Audit
              </span>
              <h2 className="text-[20px] font-semibold text-ink mb-4">What I Check Personally</h2>
              <ul className="space-y-3.5 text-[15px] text-[#1E293B] leading-relaxed">
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Form Data Destinations:</strong> Where your form submissions actually go and who can view them.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Custom Code Review:</strong> Every snippet and theme file checked for backdoors or suspicious logic.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>User &amp; Privilege Audit:</strong> Inspecting admin accounts, API keys, and lingering developer permissions.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Server &amp; Hosting Checks:</strong> Checking file permissions, cron jobs, and database access logs.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Deliverables Section */}
        <section className="px-6 max-w-[960px] mx-auto mb-16">
          <div className="bg-white border border-[#E2E8F0] p-8 md:p-10 rounded-xl shadow-xs">
            <h3 className="text-[22px] font-serif font-bold text-ink mb-3">What You Get</h3>
            <p className="text-[16px] text-[#334155] leading-[1.7]">
              A clear, plain-English report — <strong>no jargon</strong> — telling you exactly what&apos;s safe, what&apos;s exposed, and what to fix first. If I find something critical (like active data leaks or unauthenticated triggers), I flag it immediately rather than waiting for the full report.
            </p>
          </div>
        </section>

        {/* CTA Container */}
        <section className="px-6 max-w-[960px] mx-auto text-center">
          <div className="bg-white border border-[#E2E8F0] p-10 rounded-2xl shadow-sm">
            <h2 className="font-serif text-[28px] text-ink mb-3">
              Ready to find out what&apos;s really running on your site?
            </h2>
            <p className="text-[16px] text-[#475569] mb-8 max-w-[500px] mx-auto">
              Message me directly on WhatsApp with your website URL. I will confirm receipt and send payment details and next steps within 2 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://wa.me/919920899845?text=Hi%20Naveen,%20I'd%20like%20to%20get%20the%20$29%20Security%20Audit%20for%20my%20website:"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => ga.event({ action: "click", category: "conversion", label: "Security Audit WhatsApp" })}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] text-white font-semibold px-8 py-4 rounded-md text-[16px] hover:bg-[#20ba5a] transition-all shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Message on WhatsApp →
              </a>

              <a
                href="/#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-black/20 text-ink bg-transparent px-7 py-4 rounded-md text-[15.5px] font-medium hover:bg-black/5 transition-all"
              >
                Prefer Email / Form Instead?
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
