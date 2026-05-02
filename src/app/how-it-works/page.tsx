"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/sections/Contact";

const processSteps = [
  { step: "01", title: "You describe the problem", desc: "No tech jargon needed. Just tell me what's broken, slow, or frustrating you." },
  { step: "02", title: "I review & quote", desc: "I look under the hood and give you a flat-rate quote and a firm deadline. No hourly surprises." },
  { step: "03", title: "50% deposit & start", desc: "Secure payment via Wise or Upwork Escrow. Once paid, I start fixing immediately." },
  { step: "04", title: "Staging review", desc: "You review the fixes on a private staging link. Your live site remains untouched." },
  { step: "05", title: "Final payment & Launch", desc: "You approve, pay the balance, and I push the fixed code live. 30-day support included." }
];

const faqs = [
  {
    category: "Getting Started",
    questions: [
      { q: "How do I know which service I need?", a: "You don't need to. Just use the contact form to explain your symptoms (e.g., 'site is slow' or 'checkout is broken'). I'll diagnose the root cause and recommend the exact fix." },
      { q: "Do I need to prepare anything before we begin?", a: "Just have your WordPress admin credentials and your hosting login (e.g., GoDaddy, Hostinger, SiteGround) ready. I'll need those to do the actual work." },
      { q: "How do I share access securely?", a: "Once we agree on the scope, I will provide a secure, encrypted link where you can drop your credentials. They automatically self-destruct after I view them." }
    ]
  },
  {
    category: "Communication & Timeline",
    questions: [
      { q: "How will we communicate during the project?", a: "I prefer WhatsApp for quick updates and email for official scope/file sharing. You will never be left guessing what I am currently working on." },
      { q: "What counts as a 24-hour emergency?", a: "A site crash, a malware infection, or a broken checkout preventing sales. If your business is actively losing money, you jump to the front of the queue." },
    ]
  },
  {
    category: "The Work Itself",
    questions: [
      { q: "Will my site go down while you're working on it?", a: "Never. I clone your site to a secure staging environment. I do all the messy fixing there. Your live site stays up and running until the exact moment we push the final, tested code." },
      { q: "What if something breaks after you've finished?", a: "I include 30 days of bug-fix support on all project work. If the specific issue I fixed breaks again within a month, I fix it for free. No arguments." }
    ]
  },
  {
    category: "Payment",
    questions: [
      { q: "When do I pay — before or after the work?", a: "I take 50% upfront to schedule the work, and 50% on completion. This means you are never paying in full for work you haven't seen and approved on staging." },
      { q: "What payment methods do you accept?", a: "I accept payments via Wise (formerly TransferWise) for direct bank transfers. I also work via Upwork Escrow if you prefer the security of a platform holding the funds." },
      { q: "Do you offer refunds?", a: "If I cannot fix the problem I quoted you for, I refund your deposit 100%. I only get paid for solved problems." }
    ]
  }
];

function AccordionItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.08] last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-[16px] text-white/90 font-medium pr-8 group-hover:text-gold transition-colors">{q}</span>
        <span className="text-gold text-[20px] leading-none shrink-0 group-hover:text-gold-light transition-colors">{isOpen ? "−" : "+"}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-[15px] text-white/60 leading-[1.6]">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      <Nav />
      <main className="bg-[#0D0D0D] min-h-screen">
        
        {/* Header Section */}
        <section className="pt-[160px] pb-20 px-6 md:px-10">
          <div className="max-w-[800px] mx-auto text-center">
            <span className="block text-[11px] font-medium tracking-[0.14em] uppercase text-gold mb-4">
              The Process
            </span>
            <h1 className="font-serif text-[clamp(40px,6vw,64px)] tracking-[-0.025em] leading-[1.05] text-white mb-6">
              How a typical <br className="hidden sm:block" />
              project goes.
            </h1>
            <p className="text-[18px] text-white/50 leading-[1.7] font-light max-w-[500px] mx-auto">
              No guesswork. No vanishing developers. Just a clean, predictable workflow from diagnosis to launch.
            </p>
          </div>
        </section>

        {/* Visual Process Flow */}
        <section className="py-16 px-6 md:px-10 border-y border-white/[0.05] bg-[#111]">
          <div className="max-w-[1100px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
              {/* Desktop connecting line */}
              <div className="hidden md:block absolute top-[24px] left-[10%] right-[10%] h-[1px] bg-white/[0.1] z-0" />
              
              {processSteps.map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col md:items-center text-left md:text-center">
                  <div className="w-12 h-12 rounded-full bg-ink border border-gold/30 flex items-center justify-center text-gold font-serif text-[18px] mb-6 shadow-[0_0_15px_rgba(196,163,90,0.1)]">
                    {step.step}
                  </div>
                  <h3 className="text-white text-[16px] font-medium mb-2">{step.title}</h3>
                  <p className="text-[14px] text-white/50 leading-[1.6] max-w-[250px]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-[800px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-[clamp(32px,4vw,40px)] text-white mb-4">Common Questions</h2>
              <p className="text-white/50 text-[16px]">Everything else you need to know before we start.</p>
            </div>

            <div className="space-y-12">
              {faqs.map((category, idx) => (
                <div key={idx}>
                  <h3 className="text-[12px] font-medium tracking-[0.1em] uppercase text-gold/80 mb-4 pl-2 border-l-2 border-gold/30">
                    {category.category}
                  </h3>
                  <div className="bg-[#141414] border border-white/[0.05] rounded-lg px-6">
                    {category.questions.map((q, i) => (
                      <AccordionItem key={i} q={q.q} a={q.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
