"use client";

import { useState, useCallback } from "react";

type Status = "idle" | "loading" | "found" | "not_found" | "error";

export default function LlmsTxtChecker() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<string>("");
  const [checkedUrl, setCheckedUrl] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleCheck = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setStatus("loading");
    setPreview("");
    setErrorMsg("");

    try {
      const res = await fetch(
        `/api/check-llms?site=${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();

      setCheckedUrl(data.url ?? trimmed);

      if (data.found) {
        setStatus("found");
        setPreview(data.preview ?? "");
      } else if (data.error) {
        setStatus("error");
        setErrorMsg(data.error);
      } else {
        setStatus("not_found");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }, [url]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCheck();
  };

  return (
    <div
      style={{
        border: "1px solid var(--bt-border)",
        borderRadius: "12px",
        padding: "28px 28px 24px",
        background: "var(--bt-card-bg)",
        boxShadow: "var(--bt-shadow)",
        margin: "36px 0",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "18px" }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "17px",
            lineHeight: 1.35,
            marginBottom: "6px",
          }}
          className="blog-heading"
        >
          🔍 Check Your Site Right Here
        </p>
        <p
          style={{ fontSize: "14px", lineHeight: 1.6, margin: 0 }}
          className="blog-text-muted"
        >
          Enter your website address below — no tech knowledge needed.
        </p>
      </div>

      {/* Input row */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          onKeyDown={handleKeyDown}
          placeholder="yourbusiness.com"
          disabled={status === "loading"}
          style={{
            flex: "1 1 220px",
            padding: "11px 14px",
            borderRadius: "6px",
            border: "1px solid var(--bt-border)",
            background: "var(--bt-bg)",
            color: "var(--bt-heading)",
            fontSize: "15px",
            outline: "none",
            minWidth: 0,
            fontFamily: "inherit",
          }}
          aria-label="Website URL to check"
          id="llms-checker-input"
        />
        <button
          onClick={handleCheck}
          disabled={status === "loading" || !url.trim()}
          style={{
            padding: "11px 22px",
            borderRadius: "6px",
            border: "none",
            background:
              status === "loading" || !url.trim()
                ? "var(--bt-border)"
                : "var(--color-gold, #C4A35A)",
            color:
              status === "loading" || !url.trim() ? "var(--bt-text-muted)" : "#fff",
            fontWeight: 600,
            fontSize: "15px",
            cursor:
              status === "loading" || !url.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            fontFamily: "inherit",
            whiteSpace: "nowrap",
          }}
          id="llms-checker-btn"
        >
          {status === "loading" ? "Checking…" : "Check →"}
        </button>
      </div>

      {/* Results */}
      {status === "found" && (
        <div
          style={{
            marginTop: "18px",
            padding: "14px 16px",
            borderRadius: "8px",
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}
        >
          <p style={{ fontWeight: 700, color: "#16a34a", margin: "0 0 6px", fontSize: "15px" }}>
            ✅ Your site has an llms.txt file
          </p>
          <p style={{ margin: "0 0 6px", fontSize: "13px", color: "var(--bt-text-muted)" }}>
            Found at:{" "}
            <a
              href={checkedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#16a34a", wordBreak: "break-all" }}
            >
              {checkedUrl}
            </a>
          </p>
          {preview && (
            <details style={{ marginTop: "8px" }}>
              <summary
                style={{
                  fontSize: "12px",
                  cursor: "pointer",
                  color: "var(--bt-text-muted)",
                  userSelect: "none",
                }}
              >
                Preview first 500 characters
              </summary>
              <pre
                style={{
                  marginTop: "8px",
                  padding: "10px",
                  borderRadius: "6px",
                  background: "rgba(0,0,0,0.05)",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: "var(--bt-heading)",
                  fontFamily: "monospace",
                }}
              >
                {preview}
              </pre>
            </details>
          )}
        </div>
      )}

      {status === "not_found" && (
        <div
          style={{
            marginTop: "18px",
            padding: "14px 16px",
            borderRadius: "8px",
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
        >
          <p style={{ fontWeight: 700, color: "#dc2626", margin: "0 0 6px", fontSize: "15px" }}>
            ❌ No llms.txt file found
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--bt-text-muted)", lineHeight: 1.6 }}>
            AI tools have to guess what your business does.{" "}
            <a
              href="/llms-txt"
              style={{ color: "#dc2626", fontWeight: 600 }}
            >
              Fix this for $10 →
            </a>
          </p>
        </div>
      )}

      {status === "error" && (
        <div
          style={{
            marginTop: "18px",
            padding: "14px 16px",
            borderRadius: "8px",
            background: "rgba(251,191,36,0.07)",
            border: "1px solid rgba(251,191,36,0.3)",
          }}
        >
          <p style={{ fontWeight: 700, color: "#b45309", margin: "0 0 4px", fontSize: "15px" }}>
            ⚠️ Could not reach that site
          </p>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--bt-text-muted)" }}>
            {errorMsg || "Try again, or open a new tab and check manually."}
          </p>
        </div>
      )}

      <p
        style={{
          marginTop: "14px",
          fontSize: "11px",
          color: "var(--bt-text-faint, #aaa)",
          margin: "14px 0 0",
          lineHeight: 1.5,
        }}
      >
        Your URL is not stored. This check runs instantly and privately.
      </p>
    </div>
  );
}
