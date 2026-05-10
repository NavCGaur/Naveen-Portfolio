"use client";

import Link from "next/link";
import { trackOutboundClick } from "@/lib/ga";

export default function ArticleCTALink({ slug }: { slug: string }) {
  return (
    <Link
      href={`/?utm_source=article&utm_medium=blog&utm_campaign=${slug}#contact`}
      onClick={() => trackOutboundClick("cta_get_in_touch", slug)}
      className="inline-block bg-[#C4A35A] text-[#0D0D0D] px-8 py-3.5 rounded-sm text-[15px] font-medium tracking-[0.02em] hover:bg-[#d4b46a] transition-colors duration-200"
    >
      Get in Touch →
    </Link>
  );
}
