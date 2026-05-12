"use client";

import Link from "next/link";
import { trackOutboundClick } from "@/lib/ga";

export default function ArticleCTALink({ slug }: { slug: string }) {
  return (
    <div className="flex justify-center my-10">
      <Link
        href={`/?utm_source=article&utm_medium=blog&utm_campaign=${slug}#contact`}
        onClick={() => trackOutboundClick("cta_get_in_touch", slug)}
        className="w-full max-w-[480px] text-center bg-[#C4A35A] text-[#0D0D0D] py-4 rounded-sm text-[16px] font-bold uppercase tracking-[0.1em] hover:bg-[#d4b46a] transition-all duration-300 shadow-xl hover:scale-[1.02]"
      >
        Get in Touch →
      </Link>
    </div>
  );
}
