import Link from "next/link";

export default function ProcessBanner() {
  return (
    <section className="bg-ink py-16 px-6 md:px-10 border-y border-white/[0.08]">
      <div className="max-w-[1100px] mx-auto text-center">
        <Link 
          href="/how-it-works"
          className="group inline-flex flex-col items-center gap-2"
        >
          <h3 className="font-serif text-[clamp(24px,3vw,32px)] text-white/90 italic tracking-[-0.01em] group-hover:text-gold transition-colors duration-300">
            Wondering how this actually works?
          </h3>
          <span className="text-[13px] font-medium tracking-[0.1em] uppercase text-white/40 group-hover:text-gold-light transition-colors duration-300 flex items-center gap-2">
            Read how a typical project goes <span className="text-[16px] leading-none mb-[2px] transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
