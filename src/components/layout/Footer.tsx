export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink border-t border-white/[0.08] py-8 px-6 md:px-10 text-center md:text-left">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[13px] text-white/60">
          &copy; {currentYear} Naveen Gaur. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
