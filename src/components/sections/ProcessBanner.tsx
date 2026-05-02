import Link from "next/link";

export default function ProcessBanner() {
  return (
    <section className="pt-0 pb-16 md:pb-24 px-6 md:px-10">
      <div className="max-w-[1100px] mx-auto text-center">
        <Link 
          href="/how-it-works"
          className="group inline-block bg-[#FAFAF8] border border-black/[0.08] hover:border-black/[0.15] hover:bg-white hover:shadow-sm rounded-2xl md:rounded-full py-8 md:py-6 px-8 md:px-12 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
            <h3 className="font-serif text-[22px] md:text-[26px] text-ink italic tracking-[-0.01em]">
              Wondering how this actually works?
            </h3>
            <div className="hidden md:block w-[1px] h-8 bg-black/[0.1]"></div>
            <span className="inline-flex items-center gap-2 text-[12px] font-medium tracking-[0.1em] uppercase text-ink-muted group-hover:text-gold-dark transition-colors duration-300 mt-2 md:mt-0">
              Read how a typical project goes <span className="text-[16px] leading-none mb-[2px] transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
