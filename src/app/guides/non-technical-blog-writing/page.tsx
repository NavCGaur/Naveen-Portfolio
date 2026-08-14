"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

function GuideContent() {
  const searchParams = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Only unlock if arriving directly via verified email link with access=granted token
    const access = searchParams?.get("access");
    if (access === "granted") {
      setUnlocked(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // 1. Submit lead to API (sends access email to recipient)
      const res = await fetch("/api/guide-optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process opt-in");
      }

      // 2. Fire custom event on site analytics pipeline
      if (typeof window !== "undefined") {
        if ((window as any).gtag) {
          (window as any).gtag("event", "guide_optin_requested", {
            event_category: "lead_generation",
            event_label: "non_technical_blog_writing_guide",
            email_domain: email.split("@")[1] || "unknown",
          });
        }

        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "guide_optin_requested",
            page: "/guides/non-technical-blog-writing",
            data: { emailDomain: email.split("@")[1] || "unknown" },
          }),
        }).catch(() => {});
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header Badge & Title */}
      <div className="mb-10 text-center md:text-left">
        <span className="inline-block bg-[#C4A35A]/15 text-[#C4A35A] border border-[#C4A35A]/30 text-[12px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
          Client Content Framework
        </span>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
          The Blog Writing Guide
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/70 font-light leading-relaxed">
          A simple way to write content that gets found on Google — without losing your voice.
        </p>
      </div>

      {/* Lock Gate vs Email Sent Confirmation vs Unlocked Content */}
      {!unlocked ? (
        <div className="bg-[#171717] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden my-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C4A35A]/10 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div className="relative z-10 max-w-[560px] mx-auto text-center">
            {!submitted ? (
              <>
                <div className="w-14 h-14 bg-[#C4A35A]/20 border border-[#C4A35A]/40 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                  ✉️
                </div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
                  Receive the Guide via Email
                </h2>
                <p className="text-white/70 text-base leading-relaxed mb-8">
                  Enter your email address below to receive a direct access link to the full 11-step Blog Writing Guide in your inbox.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-wider text-white/60 mb-2 font-medium">
                      Your Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-[#0D0D0D] border border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-[#C4A35A] transition-colors"
                    />
                  </div>

                  {errorMsg && (
                    <p className="text-red-400 text-sm font-medium">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C4A35A] text-[#0D0D0D] font-bold py-3.5 px-6 rounded-xl hover:bg-[#d6b76e] transition-all transform active:scale-[0.99] disabled:opacity-50 text-sm uppercase tracking-wider mt-2 shadow-lg shadow-[#C4A35A]/20"
                  >
                    {loading ? "Sending Access Link..." : "Send Me the Guide →"}
                  </button>
                </form>

                <p className="text-xs text-white/40 mt-6">
                  No spam ever. We only send the direct guide link to your email.
                </p>
              </>
            ) : (
              <div className="py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-3xl text-emerald-400">
                  ✓
                </div>
                <h2 className="text-2xl font-serif font-bold text-white">
                  Check Your Inbox!
                </h2>
                <p className="text-white/80 text-base leading-relaxed max-w-[460px] mx-auto">
                  We've sent a direct access link to <strong>{email}</strong>. Click the link inside the email to view the complete guide.
                </p>
                <p className="text-xs text-white/40 pt-2">
                  (If you don't see it within a minute, check your spam or promotions folder.)
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-fadeIn">
          <div className="bg-[#C4A35A]/15 border border-[#C4A35A]/30 text-[#C4A35A] p-4 rounded-xl text-sm flex items-center justify-between">
            <span>✓ Verified Email Access — Full Guide Unlocked</span>
          </div>

          <div className="bg-[#171717] border border-white/10 rounded-2xl p-6 md:p-10 text-white/90 space-y-8 leading-relaxed">
            <div className="border-b border-white/10 pb-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#C4A35A] mb-1">
                Core Principle
              </p>
              <h2 className="text-2xl font-serif font-bold text-white">
                Your topics. Your words. Your voice.
              </h2>
              <p className="mt-3 text-white/70">
                The most important part of your content is that it sounds like you. Your experiences, perspective, insights, and the subjects you feel called to write about should always come first.
              </p>
              <p className="mt-3 text-white/70">
                SEO is simply the layer that helps the right people find that content through Google. You do not need to become an SEO expert or learn keyword research to benefit from it.
              </p>
            </div>

            {/* 11 Steps List */}
            <div className="space-y-8">
              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  1. Start with what you genuinely want to say
                </h3>
                <p className="text-white/80 mb-3">
                  You don't need to start with Google. If there is something you have experienced, something you have been thinking about, something you see repeatedly in your work, or something you feel your audience needs to hear — that can be the starting point.
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-white/70 text-sm pl-2">
                  <li>Something you have noticed in your work with clients</li>
                  <li>A question people often ask you</li>
                  <li>Something you have personally experienced</li>
                  <li>A misunderstanding you would like to clarify</li>
                  <li>A subject you feel strongly about</li>
                  <li>Something you wish someone had explained to you earlier</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  2. You don't need to know the keywords
                </h3>
                <p className="text-white/80">
                  A keyword is simply the words or phrases someone might type into Google when looking for information. You don't need to know which keywords to use before you write, and you don't need to repeat a particular phrase throughout your article. That's the technical consultant's job on the other side of this process.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  3. You can send an idea first — or write first
                </h3>
                <p className="text-white/80 mb-3">
                  <strong>Option 1 (Idea First):</strong> If you have an idea but haven't started writing: a quick search of your own site (e.g. <code>site:yoursite.com topic</code>) can confirm it's a new piece. Send the idea along. Research can reveal a stronger angle on the subject or confirm it's worth writing as originally planned.
                </p>
                <p className="text-white/80">
                  <strong>Option 2 (Write First):</strong> If you already know what you want to say, just write it. Don't stop mid-sentence to wonder which keyword belongs where — say what you actually want to say, and send it once it's finished.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  4. Don't worry about using a phrase a certain number of times
                </h3>
                <p className="text-white/80">
                  You may have heard advice like "use your keyword 10 times." You don't need to. If your article is genuinely about a subject, the related words will show up naturally as you write about it. Don't force a phrase into a sentence where it doesn't belong. Always write for the person reading first.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  5. Your title can stay personal
                </h3>
                <p className="text-white/80 mb-3">
                  Your title doesn't need to sound like a textbook. Sometimes a very open or poetic title may not immediately tell a new reader what the article is about — in those cases, a small variation can add context without replacing your original idea.
                </p>
                <div className="bg-[#0D0D0D] p-4 rounded-xl border border-white/10 text-sm space-y-2">
                  <p className="text-red-400/90"><strong>Original:</strong> "When the Body Finally Says Enough"</p>
                  <p className="text-emerald-400"><strong>SEO Context Variation:</strong> "When Your Body Says Enough: Understanding Emotional and Nervous System Overload"</p>
                </div>
                <p className="text-xs text-white/60 mt-2">
                  Neither version is "better." The second simply gives a new reader searching on Google a little more context. You always decide what feels right.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  6. Think about what your reader is actually wondering
                </h3>
                <p className="text-white/80">
                  A useful way to shape an article is to ask: what might someone experiencing this actually be wondering? You don't need to turn the piece into a list of Q&As — but answering a few real questions makes an article genuinely more useful, and far easier to find.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  7. Make the subject clear fairly early
                </h3>
                <p className="text-white/80">
                  You can still open with a story, a reflection, or a personal experience. But somewhere near the beginning, help the reader understand what the article is actually about, so they don't have to read the whole piece just to find out if it's relevant to them.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  8. There's no fixed word count
                </h3>
                <p className="text-white/80">
                  Some subjects need 600 words. Others need 2,000. Write what the subject actually needs — useful and complete matters significantly more than raw length.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  9. Your personal experience is the part that can't be copied
                </h3>
                <p className="text-white/80">
                  When relevant, include something you personally experienced, observed, or learned — a perspective that changed, or an example from your own work. That's the part of the article no AI or competitor can copy, and usually the part readers remember.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  10. Your existing content can support new articles
                </h3>
                <p className="text-white/80">
                  A new article doesn't need to stand completely alone. If it connects naturally to something you've already published — another article, a service page, or your About page — those connections help a reader discover more of your work instead of leaving after one piece.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-bold text-[#C4A35A] mb-2">
                  11. The technical side isn't yours to worry about
                </h3>
                <p className="text-white/80">
                  Once an article is finished and approved, the SEO title, meta description, internal links, image SEO, heading structure, and schema markup are technical implementation work — separate from the writing itself, and should never change the heart of what was written.
                </p>
              </section>
            </div>

            {/* Summary Workflow Box */}
            <div className="bg-[#0D0D0D] border border-[#C4A35A]/30 rounded-xl p-6 mt-8 space-y-4">
              <h4 className="text-lg font-bold text-[#C4A35A]">
                The Simple Rule to Remember
              </h4>
              <p className="text-white/90 text-sm leading-relaxed">
                You bring the experience, insight, and voice. The research and the technical side are someone else's job to carry. Your topics remain your topics. Your words remain your words. Your voice remains your voice. SEO simply helps more of the right people find them.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function NonTechnicalBlogWritingGuidePage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans">
      <Nav />
      <main className="flex-1 max-w-[860px] mx-auto w-full px-6 pt-32 pb-24">
        <Suspense fallback={
          <div className="text-center py-24 text-white/50">
            Loading guide...
          </div>
        }>
          <GuideContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
