"use client";

import React, { useState } from "react";

interface AuditEmailFormProps {
  url: string;
  reportLink: string;
}

export default function AuditEmailForm({ url, reportLink }: AuditEmailFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/audit/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, url, reportLink }),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to send email. Please try again.");
      } else {
        setStatus("success");
        setMessage("Success! The report link has been sent to your email.");
        setEmail("");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-[#FAFAF8] border border-[#E2E8F0] p-6 rounded-xl text-left max-w-[450px] w-full shadow-xs print:hidden">
      <h4 className="text-[15px] font-bold text-[#0D0D0D] mb-1 font-serif">Email Me This Report</h4>
      <p className="text-[13px] text-[#475569] mb-4 leading-[1.5]">
        Want to save this report for reference? Send a direct link to your inbox to access these findings later.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="flex-1 px-4 py-2 text-[14px] bg-white border border-[#E2E8F0] rounded-sm focus:outline-none focus:border-[#C4A35A] text-[#0D0D0D] transition-colors"
            disabled={status === "loading" || status === "success"}
            required
          />
          <button
            type="submit"
            className={`px-4 py-2 text-[13px] font-bold tracking-[0.05em] uppercase rounded-sm transition-colors cursor-pointer ${
              status === "success"
                ? "bg-emerald-600 text-white"
                : "bg-[#0D0D0D] text-white hover:bg-slate-800"
            }`}
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" ? "Sending..." : status === "success" ? "Sent ✓" : "Email Link"}
          </button>
        </div>

        {message && (
          <p
            className={`text-[12px] leading-snug mt-2 ${
              status === "success" ? "text-emerald-700 font-medium" : "text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
