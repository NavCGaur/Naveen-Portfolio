"use client";

import { useRef, useState } from "react";
import { trackCopyCode } from "@/lib/ga";

interface CopyCodeButtonProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function CopyCodeButton({ children, ...props }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      const slug = window.location.pathname.replace("/blog/", "").replace(/\/$/, "");
      trackCopyCode(slug);
    } catch {
      // clipboard access denied — fail silently
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <pre 
        ref={preRef} 
        {...props}
        style={{ 
          ...((props.style as React.CSSProperties) || {}),
          paddingRight: "80px" 
        }}
      >
        {children}
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copy code to clipboard"
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: copied ? "rgba(34,197,94,0.15)" : "var(--bt-input-bg)",
          border: `1px solid ${copied ? "rgba(34,197,94,0.4)" : "var(--bt-border-md)"}`,
          color: copied ? "#22c55e" : "var(--bt-text-faint)",
          fontSize: "12px",
          fontFamily: "inherit",
          padding: "4px 8px",
          borderRadius: "4px",
          backdropFilter: "blur(8px)",
          zIndex: 10,
          cursor: "pointer",
          transition: "all 0.2s",
          letterSpacing: "0.02em",
        }}
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
