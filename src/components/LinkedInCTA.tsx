"use client";

import { trackOutboundClick } from "@/lib/ga";

interface Props {
  slug: string;
}

export default function LinkedInCTA({ slug }: Props) {
  return (
    <a
      href="https://www.linkedin.com/in/naveen-gaur-dev/"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackOutboundClick("linkedin_connect", slug)}
      className="text-[#C4A35A] hover:text-[#d4b46a] font-bold underline transition-colors"
    >
      LinkedIn
    </a>
  );
}
