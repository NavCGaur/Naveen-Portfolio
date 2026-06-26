"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types (minimal subset of AuditReport) ───────────────────────────────────
interface AuditMetrics {
  performance: number;
  seo: number;
  bestPractices: number;
  accessibility: number;
}

interface AuditReport {
  id: string;
  url: string;
  name?: string;
  email?: string;
  status: "pending" | "completed" | "failed";
  timestamp: string;
  metrics?: AuditMetrics;
  businessCategory?: string;
  executiveSummary?: string;
  pageSpeedUnavailable?: boolean;
  error?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function scoreColor(score: number): string {
  if (score >= 90) return "#00C9A7";
  if (score >= 50) return "#F59E0B";
  return "#EF4444";
}

function scoreBg(score: number): string {
  if (score >= 90) return "rgba(0,201,167,0.12)";
  if (score >= 50) return "rgba(245,158,11,0.12)";
  return "rgba(239,68,68,0.12)";
}

function ScorePill({ score }: { score: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 700,
        color: scoreColor(score),
        background: scoreBg(score),
        minWidth: 34,
        textAlign: "center",
      }}
    >
      {score}
    </span>
  );
}

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: "#00C9A7",
    failed: "#EF4444",
    pending: "#F59E0B",
  };
  const bgs: Record<string, string> = {
    completed: "rgba(0,201,167,0.1)",
    failed: "rgba(239,68,68,0.1)",
    pending: "rgba(245,158,11,0.1)",
  };
  const c = colors[status] ?? "#9ca3af";
  const bg = bgs[status] ?? "rgba(156,163,175,0.1)";
  return (
    <span
      style={{
        padding: "2px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        color: c,
        background: bg,
        border: `1px solid ${c}30`,
        textTransform: "capitalize",
      }}
    >
      {status}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 12,
        padding: "18px 20px",
        flex: 1,
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 800, color, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{sub}</div>}
    </motion.div>
  );
}

// ─── Run Audit Panel ──────────────────────────────────────────────────────────
function RunAuditPanel({ onComplete }: { onComplete: () => void }) {
  const [url, setUrl] = useState("");
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState<{ success: boolean; id?: string; error?: string } | null>(null);

  const runAudit = async () => {
    if (!url.trim()) return;
    setRunning(true);
    setLog(["🚀 Starting audit for " + url]);
    setResult(null);

    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = ((Date.now() - start) / 1000).toFixed(0);
      setLog(prev => {
        const filtered = prev.filter(l => !l.startsWith("⏱"));
        return [...filtered, `⏱ Running… ${elapsed}s elapsed`];
      });
    }, 1000);

    try {
      setLog(prev => [...prev, "📡 Connecting to audit engine…"]);
      const res = await fetch("/api/private/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      clearInterval(timer);
      const data = await res.json();

      if (res.ok && data.success) {
        setLog(prev => [...prev, `✅ Audit complete! ID: ${data.id}`]);
        setResult({ success: true, id: data.id });
        onComplete();
      } else {
        setLog(prev => [...prev, `❌ Error: ${data.error || "Unknown error"}`]);
        setResult({ success: false, error: data.error });
      }
    } catch (err) {
      clearInterval(timer);
      const msg = err instanceof Error ? err.message : "Request failed";
      setLog(prev => [...prev, `❌ ${msg}`]);
      setResult({ success: false, error: msg });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div style={{
      background: "rgba(255,0,122,0.04)",
      border: "1px solid rgba(255,0,122,0.15)",
      borderRadius: 14,
      padding: "20px 24px",
      marginBottom: 24,
    }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f9fafb", marginBottom: 14 }}>
        ⚡ Run New Audit
      </h3>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !running && runAudit()}
          disabled={running}
          style={{
            flex: 1,
            minWidth: 200,
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "#f9fafb",
            fontSize: 14,
            outline: "none",
          }}
        />
        <button
          onClick={runAudit}
          disabled={running || !url.trim()}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: running ? "rgba(255,0,122,0.3)" : "#FF007A",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: running || !url.trim() ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.2s",
          }}
        >
          {running ? "Running…" : "Run Audit"}
        </button>
      </div>

      <AnimatePresence>
        {log.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: 14,
              fontFamily: "monospace",
              fontSize: 12,
              color: "#9ca3af",
              background: "rgba(0,0,0,0.25)",
              borderRadius: 8,
              padding: "12px 14px",
              maxHeight: 140,
              overflowY: "auto",
              lineHeight: 1.7,
            }}
          >
            {log.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            {result?.success && result.id && (
              <a
                href={`/audits/${result.id}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#FF007A", fontWeight: 700 }}
              >
                → View Report
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AuditAdminDashboard() {
  const [audits, setAudits] = useState<AuditReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchAudits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/private/audits");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAudits(data.audits || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAudits(); }, [fetchAudits]);

  // Derived stats
  const completed = audits.filter(a => a.status === "completed");
  const failed = audits.filter(a => a.status === "failed");
  const today = audits.filter(a => {
    const d = new Date(a.timestamp);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });
  const avgPerf = completed.length > 0
    ? Math.round(completed.reduce((s, a) => s + (a.metrics?.performance ?? 0), 0) / completed.length)
    : 0;

  // Filters
  const categories = ["All", ...Array.from(new Set(audits.map(a => a.businessCategory).filter(Boolean)))];
  const statuses = ["All", "completed", "failed", "pending"];

  const filtered = audits.filter(a => {
    const matchSearch = !search || a.url.toLowerCase().includes(search.toLowerCase()) ||
      (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || a.businessCategory === catFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const copyLink = (id: string) => {
    const link = `${window.location.origin}/audits/${id}`;
    navigator.clipboard.writeText(link);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="adm-root">
        {/* Header */}
        <header className="adm-header">
          <div className="adm-header-inner">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="adm-logo">🔍</div>
              <div>
                <h1 className="adm-title">Audit Admin</h1>
                <p className="adm-subtitle">naveengaur.com · private</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="adm-count-badge">{audits.length} total reports</span>
              <button className="adm-refresh-btn" onClick={fetchAudits} disabled={loading}>
                {loading ? "Loading…" : "↻ Refresh"}
              </button>
            </div>
          </div>
        </header>

        <div className="adm-body">
          {/* Stats Row */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <StatCard label="Total Audits" value={audits.length} color="#f9fafb" />
            <StatCard label="Today" value={today.length} sub={new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })} color="#FF007A" />
            <StatCard label="Completed" value={completed.length} color="#00C9A7" />
            <StatCard label="Failed" value={failed.length} color="#EF4444" />
            <StatCard label="Avg Performance" value={avgPerf ? `${avgPerf}` : "—"} sub="across completed" color="#7B5CF0" />
          </div>

          {/* Run Audit Panel */}
          <RunAuditPanel onComplete={fetchAudits} />

          {/* Error State */}
          {error && (
            <div style={{ padding: "14px 18px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, color: "#f87171", marginBottom: 20, fontSize: 13 }}>
              ❌ {error}
            </div>
          )}

          {/* Filters */}
          <div className="adm-filters">
            <input
              className="adm-search"
              placeholder="Search by URL, name, email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select className="adm-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="adm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="adm-filter-count">{filtered.length} shown</span>
          </div>

          {/* Table */}
          {loading ? (
            <div className="adm-loading">
              <div className="adm-spinner" />
              <p>Loading all audit reports from GitHub…</p>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>This may take 10–20s for many reports</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="adm-empty">No audits found.</div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Website</th>
                    <th>Requester</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Perf</th>
                    <th>SEO</th>
                    <th>BP</th>
                    <th>A11y</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((audit, idx) => (
                    <>
                      <motion.tr
                        key={audit.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.015 }}
                        className={expandedId === audit.id ? "adm-row adm-row-expanded" : "adm-row"}
                        onClick={() => setExpandedId(expandedId === audit.id ? null : audit.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="adm-rank">{idx + 1}</td>
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <a
                              href={audit.url}
                              target="_blank"
                              rel="noreferrer"
                              className="adm-url"
                              onClick={e => e.stopPropagation()}
                            >
                              {audit.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                            </a>
                            <span style={{ fontSize: 10, color: "#6b7280", fontFamily: "monospace" }}>{audit.id.slice(0, 8)}…</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 12, color: "#e5e7eb" }}>{audit.name || "—"}</div>
                          {audit.email && <div style={{ fontSize: 11, color: "#6b7280" }}>{audit.email}</div>}
                        </td>
                        <td>
                          {audit.businessCategory ? (
                            <span className="adm-cat-badge">{audit.businessCategory.replace("-", " ")}</span>
                          ) : "—"}
                        </td>
                        <td><StatusBadge status={audit.status} /></td>
                        <td>{audit.metrics ? <ScorePill score={audit.metrics.performance} /> : <span style={{ color: "#6b7280" }}>—</span>}</td>
                        <td>{audit.metrics ? <ScorePill score={audit.metrics.seo} /> : "—"}</td>
                        <td>{audit.metrics ? <ScorePill score={audit.metrics.bestPractices} /> : "—"}</td>
                        <td>{audit.metrics ? <ScorePill score={audit.metrics.accessibility} /> : "—"}</td>
                        <td>
                          <span style={{ fontSize: 11, color: "#9ca3af", whiteSpace: "nowrap" }}>
                            {timeAgo(audit.timestamp)}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <a
                              href={`/audits/${audit.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="adm-action-btn"
                              onClick={e => e.stopPropagation()}
                              title="View Report"
                            >
                              View
                            </a>
                            <button
                              className="adm-action-btn adm-action-copy"
                              onClick={e => { e.stopPropagation(); copyLink(audit.id); }}
                              title="Copy report link"
                            >
                              {copied === audit.id ? "✓" : "Copy"}
                            </button>
                          </div>
                        </td>
                      </motion.tr>

                      {/* Expanded row — executive summary */}
                      <AnimatePresence>
                        {expandedId === audit.id && (
                          <tr key={`${audit.id}-expand`} className="adm-expand-row">
                            <td colSpan={11}>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ padding: "14px 16px" }}
                              >
                                {audit.executiveSummary ? (
                                  <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.6, margin: 0 }}>
                                    <strong style={{ color: "#FF007A" }}>AI Summary: </strong>
                                    {audit.executiveSummary}
                                  </p>
                                ) : audit.error ? (
                                  <p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>
                                    <strong>Error: </strong>{audit.error}
                                  </p>
                                ) : (
                                  <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>No summary available.</p>
                                )}
                                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                                  <a
                                    href={`/audits/${audit.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: 12, color: "#FF007A", textDecoration: "none", fontWeight: 600 }}
                                  >
                                    Full Report →
                                  </a>
                                  <span style={{ color: "#374151" }}>·</span>
                                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                                    {new Date(audit.timestamp).toLocaleString("en-US", {
                                      month: "short", day: "numeric", year: "numeric",
                                      hour: "2-digit", minute: "2-digit"
                                    })}
                                  </span>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <footer className="adm-footer">
          Private · naveengaur.com/private/audit
        </footer>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
  .adm-root {
    min-height: 100vh;
    background: #0d0d0f;
    color: #e5e7eb;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .adm-header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(13,13,15,0.9);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .adm-header-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .adm-logo {
    width: 36px;
    height: 36px;
    background: rgba(255,0,122,0.08);
    border: 1px solid rgba(255,0,122,0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
  }

  .adm-title {
    font-size: 16px;
    font-weight: 700;
    color: #f9fafb;
    margin: 0;
  }

  .adm-subtitle {
    font-size: 11px;
    color: #6b7280;
    margin: 0;
  }

  .adm-count-badge {
    font-size: 11px;
    padding: 4px 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 99px;
    color: #9ca3af;
  }

  .adm-refresh-btn {
    padding: 7px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: #e5e7eb;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .adm-refresh-btn:hover { background: rgba(255,255,255,0.09); }
  .adm-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .adm-body {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px 24px 40px;
  }

  .adm-filters {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 16px;
  }

  .adm-search {
    flex: 1;
    min-width: 180px;
    padding: 9px 14px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: #f9fafb;
    font-size: 13px;
    outline: none;
  }
  .adm-search::placeholder { color: #6b7280; }

  .adm-select {
    padding: 9px 12px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    color: #e5e7eb;
    font-size: 13px;
    cursor: pointer;
    outline: none;
  }
  .adm-select option { background: #1a1a1f; }

  .adm-filter-count {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
  }

  .adm-table-wrap {
    overflow-x: auto;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.07);
  }

  .adm-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 900px;
  }

  .adm-table thead tr {
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .adm-table th {
    padding: 10px 14px;
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .adm-row {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.1s;
  }
  .adm-row:hover { background: rgba(255,255,255,0.03); }
  .adm-row-expanded { background: rgba(255,0,122,0.03) !important; }

  .adm-table td {
    padding: 12px 14px;
    font-size: 13px;
    vertical-align: middle;
  }

  .adm-rank {
    color: #6b7280;
    font-size: 12px;
    font-weight: 600;
    width: 32px;
  }

  .adm-url {
    font-size: 13px;
    color: #e5e7eb;
    text-decoration: none;
    font-weight: 500;
    max-width: 220px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .adm-url:hover { color: #FF007A; }

  .adm-cat-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 99px;
    background: rgba(123,92,240,0.1);
    color: #a78bfa;
    border: 1px solid rgba(123,92,240,0.2);
    text-transform: capitalize;
    white-space: nowrap;
  }

  .adm-action-btn {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e5e7eb;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
  }
  .adm-action-btn:hover { background: rgba(255,255,255,0.1); }

  .adm-action-copy {
    background: rgba(0,201,167,0.06);
    border-color: rgba(0,201,167,0.15);
    color: #00C9A7;
  }
  .adm-action-copy:hover { background: rgba(0,201,167,0.12); }

  .adm-expand-row {
    background: rgba(0,0,0,0.15);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .adm-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 60px 20px;
    color: #6b7280;
    text-align: center;
    font-size: 14px;
  }

  .adm-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(255,0,122,0.2);
    border-top-color: #FF007A;
    border-radius: 50%;
    animation: adm-spin 0.8s linear infinite;
  }

  @keyframes adm-spin {
    to { transform: rotate(360deg); }
  }

  .adm-empty {
    text-align: center;
    padding: 60px 20px;
    color: #6b7280;
    font-size: 14px;
  }

  .adm-footer {
    text-align: center;
    padding: 16px;
    font-size: 11px;
    color: #374151;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
`;
