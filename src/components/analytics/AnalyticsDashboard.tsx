"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Users, Eye, MousePointer,
  Clock, Globe, Smartphone, Monitor, Tablet,
  Upload, Download, Filter, ChevronDown, X,
  Activity, BarChart2, Zap, RefreshCw,
  ExternalLink, Check, Copy, Loader, Wifi, WifiOff,
} from "lucide-react";
import { AnalyticsData, VisitorSession } from "./types";
import { mockData, SITE_OPTIONS } from "./mockData";
import SankeyFlow from "./SankeyFlow";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const TABS = ["Overview", "Sources", "Devices", "Top Pages", "Events", "Visitors", "User Flows"] as const;
type Tab = typeof TABS[number];

const TIME_RANGES = ["24h", "7d", "30d", "Custom"] as const;
type TimeRange = typeof TIME_RANGES[number];

const ACCENT = "#FF007A";
const ACCENT_2 = "#7B5CF0";
const ACCENT_3 = "#00C9A7";
const ACCENT_4 = "#F59E0B";

const PIE_COLORS = [ACCENT, ACCENT_2, ACCENT_3, ACCENT_4, "#3B82F6", "#EC4899", "#14B8A6"];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function pctChange(current: number, prev: number) {
  if (prev === 0) return 0;
  return ((current - prev) / prev) * 100;
}

function formatPct(n: number) {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string;
  prev: number;
  current: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
  invertGood?: boolean;
}

function MetricCard({ label, value, prev, current, icon, color, invertGood }: MetricCardProps) {
  const change = pctChange(current, prev);
  const isPositive = invertGood ? change < 0 : change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="dash-card group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="dash-icon-wrap" style={{ background: `${color}18`, color }}>
          {icon}
        </div>
        <span className={`dash-badge ${isPositive ? "badge-pos" : "badge-neg"}`}>
          {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {formatPct(Math.abs(change))}
        </span>
      </div>
      <p className="dash-metric-value">{value}</p>
      <p className="dash-metric-label">{label}</p>
    </motion.div>
  );
}

// ─── Custom Tooltip ───
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="dash-tooltip">
      <p className="dash-tooltip-label">{label}</p>
      {payload.map((p: { color: string; name: string; value: number }, i: number) => (
        <div key={i} className="dash-tooltip-row">
          <span className="dash-tooltip-dot" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <strong>{formatNumber(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

// ─── Bar spark for top pages ───
function MiniBar({ value, max, color = ACCENT }: { value: number; max: number; color?: string }) {
  return (
    <div className="mini-bar-bg">
      <motion.div
        className="mini-bar-fill"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────
export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>(mockData);
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [activeSite, setActiveSite] = useState(SITE_OPTIONS[0]);
  const [sourceFilter, setSourceFilter] = useState<string>("All");
  const [deviceFilter, setDeviceFilter] = useState<string>("All");
  const [eventSearch, setEventSearch] = useState("");
  const [copiedExport, setCopiedExport] = useState(false);
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Live data state ──────────────────────────────────────────
  const [isLive, setIsLive] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const fetchLiveData = useCallback(async (site: string, period: string) => {
    setIsFetching(true);
    setLiveError(null);
    try {
      const res = await fetch(
        `/api/analytics?site=${encodeURIComponent(site)}&period=${encodeURIComponent(period)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.detail || json.error || `Server error ${res.status}`);
      }
      setData(json as AnalyticsData);
      setIsLive(true);
      setLastFetched(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setLiveError(msg);
    } finally {
      setIsFetching(false);
    }
  }, []);

  // Filter traffic data by time range
  const filteredTraffic = (() => {
    const days = timeRange === "24h" ? 1 : timeRange === "7d" ? 7 : 30;
    return data.trafficOverTime.slice(-Math.min(days, data.trafficOverTime.length));
  })();

  // Export handler
  const handleExport = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopiedExport(true);
      setTimeout(() => setCopiedExport(false), 2000);
    });
  }, [data]);

  // JSON import handler
  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        setData(parsed as AnalyticsData);
        setJsonError(null);
      } catch {
        setJsonError("Invalid JSON file. Please upload a valid analytics export.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  // Filtered events
  const filteredEvents = data.events.filter(ev =>
    eventSearch === "" || ev.name.toLowerCase().includes(eventSearch.toLowerCase()) || ev.page.toLowerCase().includes(eventSearch.toLowerCase())
  );

  const maxPageviews = Math.max(...data.topPages.map(p => p.pageviews));

  return (
    <>
      <style>{dashStyles}</style>
      <div className="dash-root">
        {/* ─── Header ─── */}
        <header className="dash-header">
          <div className="dash-header-inner">
            <div className="flex items-center gap-3">
              <div className="dash-logo">
                <Activity size={18} color={ACCENT} />
              </div>
              <div>
                <h1 className="dash-title">Traffic Analytics</h1>
                <div className="flex items-center gap-2">
                  <p className="dash-subtitle">Oracle VPS</p>
                  {isLive ? (
                    <span className="dash-live-badge">
                      <span className="dash-live-dot" />
                      Live
                    </span>
                  ) : (
                    <span className="dash-demo-badge">Demo</span>
                  )}
                  {lastFetched && (
                    <span className="dash-fetched-time">Updated {lastFetched}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="dash-header-actions">
              {/* Site selector */}
              <div className="dash-select-wrap">
                <Globe size={14} className="dash-select-icon" />
                <select
                  className="dash-select"
                  value={activeSite}
                  onChange={e => {
                    setActiveSite(e.target.value);
                    if (isLive) fetchLiveData(e.target.value, timeRange);
                  }}
                >
                  {SITE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown size={13} className="dash-select-chevron" />
              </div>

              {/* Time range */}
              <div className="dash-time-pills">
                {TIME_RANGES.filter(r => r !== "Custom").map(r => (
                  <button
                    key={r}
                    className={`dash-time-pill ${timeRange === r ? "active" : ""}`}
                    onClick={() => {
                      setTimeRange(r as TimeRange);
                      if (isLive) fetchLiveData(activeSite, r);
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Compare toggle */}
              <button
                className={`dash-icon-btn ${compareMode ? "active" : ""}`}
                onClick={() => setCompareMode(!compareMode)}
                title="Compare periods"
              >
                <BarChart2 size={15} />
              </button>

              {/* Import JSON */}
              <button
                className="dash-icon-btn"
                onClick={() => fileRef.current?.click()}
                title="Import JSON"
              >
                <Upload size={15} />
              </button>
              <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

              {/* ── LOAD LIVE DATA button ── */}
              <button
                id="load-live-btn"
                className={`dash-btn-live ${isFetching ? "loading" : ""}`}
                onClick={() => fetchLiveData(activeSite, timeRange)}
                disabled={isFetching}
                title="Fetch live data from Oracle VPS"
              >
                {isFetching ? (
                  <Loader size={14} className="dash-spin" />
                ) : isLive ? (
                  <Wifi size={14} />
                ) : (
                  <WifiOff size={14} />
                )}
                {isFetching ? "Fetching…" : isLive ? "Refresh Live" : "Load Live Data"}
              </button>

              {/* Export */}
              <button
                className="dash-btn-accent"
                onClick={handleExport}
              >
                {copiedExport ? <Check size={14} /> : <Download size={14} />}
                {copiedExport ? "Copied!" : "Export JSON"}
              </button>
            </div>
          </div>

          {/* Error banners */}
          <AnimatePresence>
            {jsonError && (
              <motion.div
                className="dash-error-banner"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <span>{jsonError}</span>
                <button onClick={() => setJsonError(null)}><X size={14} /></button>
              </motion.div>
            )}
            {liveError && (
              <motion.div
                className="dash-error-banner dash-error-vps"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="dash-error-vps-inner">
                  <WifiOff size={14} />
                  <div>
                    <strong>VPS unreachable:</strong> {liveError}
                    <span className="dash-error-hint">&nbsp;— Check .env.local or VPS server status. Showing demo data.</span>
                  </div>
                </div>
                <button onClick={() => setLiveError(null)}><X size={14} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <div className="dash-body">
          {/* ─── Tabs ─── */}
          <div className="dash-tabs">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`dash-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div className="dash-tab-underline" layoutId="tab-underline" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >

              {/* ════════ OVERVIEW ════════ */}
              {activeTab === "Overview" && (
                <div className="dash-section">
                  {/* KPI Row */}
                  <div className="dash-kpi-grid">
                    <MetricCard
                      label="Total Visits"
                      value={formatNumber(data.overview.totalVisits)}
                      current={data.overview.totalVisits}
                      prev={data.overview.prevTotalVisits}
                      icon={<Users size={16} />}
                      color={ACCENT}
                    />
                    <MetricCard
                      label="Unique Visitors"
                      value={formatNumber(data.overview.uniqueVisitors)}
                      current={data.overview.uniqueVisitors}
                      prev={data.overview.prevUniqueVisitors}
                      icon={<MousePointer size={16} />}
                      color={ACCENT_2}
                    />
                    <MetricCard
                      label="Pageviews"
                      value={formatNumber(data.overview.pageviews)}
                      current={data.overview.pageviews}
                      prev={data.overview.prevPageviews}
                      icon={<Eye size={16} />}
                      color={ACCENT_3}
                    />
                    <MetricCard
                      label="Bounce Rate"
                      value={`${data.overview.bounceRate}%`}
                      current={data.overview.bounceRate}
                      prev={data.overview.prevBounceRate}
                      icon={<RefreshCw size={16} />}
                      color={ACCENT_4}
                      invertGood
                    />
                    <MetricCard
                      label="Avg. Session"
                      value={formatDuration(data.overview.avgSessionDuration)}
                      current={data.overview.avgSessionDuration}
                      prev={data.overview.prevAvgSessionDuration}
                      icon={<Clock size={16} />}
                      color="#3B82F6"
                    />
                  </div>

                  {/* Traffic over time */}
                  <div className="dash-chart-card">
                    <div className="dash-chart-header">
                      <div>
                        <h3 className="dash-chart-title">Traffic Over Time</h3>
                        <p className="dash-chart-sub">{activeSite} · {timeRange}</p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <AreaChart data={filteredTraffic} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
                        <defs>
                          <linearGradient id="gVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.35} />
                            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="gPageviews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={ACCENT_2} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={ACCENT_2} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 11, fill: "#9ca3af" }}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(d) => {
                            const dt = new Date(d);
                            return `${dt.getMonth() + 1}/${dt.getDate()}`;
                          }}
                        />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
                        <Area type="monotone" dataKey="visits" name="Visits" stroke={ACCENT} strokeWidth={2} fill="url(#gVisits)" dot={false} activeDot={{ r: 4, fill: ACCENT }} />
                        <Area type="monotone" dataKey="pageviews" name="Pageviews" stroke={ACCENT_2} strokeWidth={2} fill="url(#gPageviews)" dot={false} activeDot={{ r: 4, fill: ACCENT_2 }} />
                        {compareMode && <Area type="monotone" dataKey="uniqueVisitors" name="Unique Visitors" stroke={ACCENT_3} strokeWidth={2} fill="none" dot={false} activeDot={{ r: 4, fill: ACCENT_3 }} />}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Bottom row: geo + referrers mini */}
                  <div className="dash-two-col">
                    {/* Geo */}
                    <div className="dash-chart-card">
                      <h3 className="dash-chart-title mb-4">Top Countries</h3>
                      <div className="dash-geo-list">
                        {data.geolocations.slice(0, 6).map((geo, i) => (
                          <div key={geo.countryCode} className="dash-geo-row">
                            <span className="dash-geo-rank">{i + 1}</span>
                            <span className="dash-geo-country">{geo.country}</span>
                            <MiniBar value={geo.visits} max={data.geolocations[0].visits} />
                            <span className="dash-geo-val">{formatNumber(geo.visits)}</span>
                            <span className="dash-geo-pct">{geo.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Referrers pie */}
                    <div className="dash-chart-card">
                      <h3 className="dash-chart-title mb-4">Traffic Sources</h3>
                      <div className="flex gap-4 items-center">
                        <ResponsiveContainer width={160} height={160}>
                          <PieChart>
                            <Pie
                              data={data.referrers}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={72}
                              dataKey="visits"
                              nameKey="source"
                              paddingAngle={3}
                            >
                              {data.referrers.map((_, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v) => [formatNumber(v as number), '']} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="dash-legend-list">
                          {data.referrers.map((r, i) => (
                            <div key={r.source} className="dash-legend-row">
                              <span className="dash-legend-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                              <span className="dash-legend-label">{r.source}</span>
                              <span className="dash-legend-val">{r.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ════════ SOURCES ════════ */}
              {activeTab === "Sources" && (
                <div className="dash-section">
                  <div className="dash-two-col">
                    {/* Referrers bar chart */}
                    <div className="dash-chart-card">
                      <div className="dash-chart-header">
                        <h3 className="dash-chart-title">Referrer Sources</h3>
                        <div className="dash-select-wrap">
                          <Filter size={12} className="dash-select-icon" />
                          <select className="dash-select" value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
                            <option>All</option>
                            {data.referrers.map(r => <option key={r.source}>{r.source}</option>)}
                          </select>
                          <ChevronDown size={12} className="dash-select-chevron" />
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={data.referrers.filter(r => sourceFilter === "All" || r.source === sourceFilter)} layout="vertical" margin={{ left: 10, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                          <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: "#e5e7eb" }} tickLine={false} axisLine={false} width={110} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="visits" name="Visits" radius={[0, 4, 4, 0]}>
                            {data.referrers.map((_, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Sources table */}
                    <div className="dash-chart-card">
                      <h3 className="dash-chart-title mb-4">Source Breakdown</h3>
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Source</th>
                            <th>Visits</th>
                            <th>Share</th>
                            <th>Bar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.referrers.map((r, i) => (
                            <tr key={r.source}>
                              <td>
                                <div className="flex items-center gap-2">
                                  <span className="dash-legend-dot" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                                  {r.source}
                                </div>
                              </td>
                              <td>{formatNumber(r.visits)}</td>
                              <td>{r.percentage}%</td>
                              <td style={{ width: 100 }}>
                                <MiniBar value={r.visits} max={data.referrers[0].visits} color={PIE_COLORS[i % PIE_COLORS.length]} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Traffic line by source over time */}
                  <div className="dash-chart-card">
                    <h3 className="dash-chart-title mb-1">Visits Over Time</h3>
                    <p className="dash-chart-sub mb-4">{activeSite} · {timeRange}</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={filteredTraffic} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                          tickFormatter={(d) => { const dt = new Date(d); return `${dt.getMonth() + 1}/${dt.getDate()}`; }} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 12, color: "#9ca3af" }} />
                        <Line type="monotone" dataKey="visits" name="Visits" stroke={ACCENT} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="uniqueVisitors" name="Unique" stroke={ACCENT_2} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* ════════ DEVICES ════════ */}
              {activeTab === "Devices" && (
                <div className="dash-section">
                  <div className="dash-three-col">
                    {/* Devices */}
                    <div className="dash-chart-card">
                      <h3 className="dash-chart-title mb-4">Device Type</h3>
                      <div className="flex flex-col items-center gap-6">
                        <ResponsiveContainer width="100%" height={180}>
                          <PieChart>
                            <Pie data={data.devices} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="visits" nameKey="device" paddingAngle={4}>
                              {data.devices.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                            </Pie>
                             <Tooltip formatter={(v) => [formatNumber(v as number), '']} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="dash-device-list">
                          {data.devices.map((d, i) => (
                            <div key={d.device} className="dash-device-row">
                              <div className="dash-device-icon-wrap" style={{ color: PIE_COLORS[i] }}>
                                {d.device === "Desktop" ? <Monitor size={16} /> : d.device === "Mobile" ? <Smartphone size={16} /> : <Tablet size={16} />}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                  <span style={{ color: "#e5e7eb" }}>{d.device}</span>
                                  <span style={{ color: PIE_COLORS[i], fontWeight: 600 }}>{d.percentage}%</span>
                                </div>
                                <MiniBar value={d.visits} max={data.devices[0].visits} color={PIE_COLORS[i]} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Browsers */}
                    <div className="dash-chart-card">
                      <h3 className="dash-chart-title mb-4">Browsers</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data.browsers} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="browser" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
                          <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="visits" name="Visits" radius={[4, 4, 0, 0]}>
                            {data.browsers.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="dash-legend-list mt-3">
                        {data.browsers.map((b, i) => (
                          <div key={b.browser} className="dash-legend-row">
                            <span className="dash-legend-dot" style={{ background: PIE_COLORS[i] }} />
                            <span className="dash-legend-label">{b.browser}</span>
                            <span className="dash-legend-val">{b.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Geo */}
                    <div className="dash-chart-card">
                      <h3 className="dash-chart-title mb-4">Top Countries</h3>
                      <div className="dash-geo-list">
                        {data.geolocations.map((geo, i) => (
                          <div key={geo.countryCode} className="dash-geo-row">
                            <span className="dash-geo-rank">{i + 1}</span>
                            <span className="dash-geo-country">{geo.country}</span>
                            <MiniBar value={geo.visits} max={data.geolocations[0].visits} color={PIE_COLORS[i % PIE_COLORS.length]} />
                            <span className="dash-geo-val">{formatNumber(geo.visits)}</span>
                            <span className="dash-geo-pct">{geo.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Device filter bar chart over time */}
                  <div className="dash-chart-card">
                    <div className="dash-chart-header">
                      <div>
                        <h3 className="dash-chart-title">Visits by Device Over Time</h3>
                        <p className="dash-chart-sub">{timeRange}</p>
                      </div>
                      <div className="dash-select-wrap">
                        <Filter size={12} className="dash-select-icon" />
                        <select className="dash-select" value={deviceFilter} onChange={e => setDeviceFilter(e.target.value)}>
                          <option>All</option>
                          {data.devices.map(d => <option key={d.device}>{d.device}</option>)}
                        </select>
                        <ChevronDown size={12} className="dash-select-chevron" />
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={filteredTraffic} margin={{ top: 4, right: 8, bottom: 0, left: -10 }}>
                        <defs>
                          <linearGradient id="gV2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={ACCENT_2} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={ACCENT_2} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false}
                          tickFormatter={(d) => { const dt = new Date(d); return `${dt.getMonth() + 1}/${dt.getDate()}`; }} />
                        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="visits" name="Visits" stroke={ACCENT_2} strokeWidth={2} fill="url(#gV2)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* ════════ TOP PAGES ════════ */}
              {activeTab === "Top Pages" && (
                <div className="dash-section">
                  <div className="dash-chart-card">
                    <div className="dash-chart-header">
                      <h3 className="dash-chart-title">Most Visited Pages</h3>
                      <p className="dash-chart-sub">{activeSite} · {timeRange}</p>
                    </div>
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Page</th>
                          <th>Pageviews</th>
                          <th>Avg Duration</th>
                          <th>Bounce Rate</th>
                          <th>Traffic</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topPages.map((page, i) => (
                          <motion.tr
                            key={page.path}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                          >
                            <td className="dash-rank-num">{i + 1}</td>
                            <td>
                              <div className="flex items-center gap-2">
                                <span className="dash-page-path">{page.path}</span>
                                <a href={`https://${activeSite}${page.path}`} target="_blank" rel="noreferrer" className="dash-ext-link">
                                  <ExternalLink size={11} />
                                </a>
                              </div>
                            </td>
                            <td>
                              <span className="dash-metric-inline">{formatNumber(page.pageviews)}</span>
                            </td>
                            <td>{formatDuration(page.avgDuration)}</td>
                            <td>
                              <span className={`dash-bounce-badge ${page.bounceRate < 40 ? "good" : page.bounceRate < 55 ? "mid" : "bad"}`}>
                                {page.bounceRate}%
                              </span>
                            </td>
                            <td style={{ width: 120 }}>
                              <MiniBar value={page.pageviews} max={maxPageviews} />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pageviews bar */}
                  <div className="dash-chart-card">
                    <h3 className="dash-chart-title mb-4">Pageviews by Page</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data.topPages} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                        <YAxis type="category" dataKey="path" tick={{ fontSize: 10, fill: "#e5e7eb" }} tickLine={false} axisLine={false} width={190} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="pageviews" name="Pageviews" radius={[0, 4, 4, 0]} fill={ACCENT} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* ════════ EVENTS ════════ */}
              {activeTab === "Events" && (
                <div className="dash-section">
                  {/* Search + filter row */}
                  <div className="dash-events-toolbar">
                    <div className="dash-search-wrap">
                      <Zap size={14} className="dash-search-icon" />
                      <input
                        className="dash-search"
                        placeholder="Search events or pages…"
                        value={eventSearch}
                        onChange={e => setEventSearch(e.target.value)}
                      />
                      {eventSearch && (
                        <button className="dash-search-clear" onClick={() => setEventSearch("")}>
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <span className="dash-events-count">{filteredEvents.length} events</span>
                  </div>

                  {/* Events table */}
                  <div className="dash-chart-card">
                    <table className="dash-table">
                      <thead>
                        <tr>
                          <th>Event Name</th>
                          <th>Count</th>
                          <th>Page</th>
                          <th>Last Seen</th>
                          <th>Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvents.map((ev, i) => (
                          <motion.tr
                            key={ev.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <td>
                              <div className="flex items-center gap-2">
                                <span className="dash-event-dot" />
                                <code className="dash-event-name">{ev.name}</code>
                              </div>
                            </td>
                            <td>
                              <span className="dash-metric-inline">{formatNumber(ev.count)}</span>
                            </td>
                            <td>
                              <span className="dash-page-path">{ev.page}</span>
                            </td>
                            <td>
                              <span className="dash-time-ago">{ev.lastSeen}</span>
                            </td>
                            <td style={{ width: 120 }}>
                              <MiniBar value={ev.count} max={Math.max(...data.events.map(e => e.count))} color={ACCENT_2} />
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Events bar chart */}
                  <div className="dash-chart-card">
                    <h3 className="dash-chart-title mb-4">Event Frequency</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={filteredEvents} layout="vertical" margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} tickLine={false} axisLine={false} tickFormatter={formatNumber} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#e5e7eb" }} tickLine={false} axisLine={false} width={190} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                          {filteredEvents.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Export hint */}
                  <div className="dash-export-hint">
                    <Copy size={14} />
                    <span>Click <strong>Export JSON</strong> in the header to copy all event data for AI analysis.</span>
                  </div>
                </div>
              )}

              {/* ════════ VISITORS ════════ */}
              {activeTab === "Visitors" && (
                <div className="dash-section">
                  <div className="dash-events-header">
                    <h2 className="dash-section-title">Visitor Sessions</h2>
                    <span className="dash-events-count">
                      {(data.sessions ?? []).length} sessions
                    </span>
                  </div>

                  {(!data.sessions || data.sessions.length === 0) ? (
                    <div className="dash-empty-state">
                      <Globe size={32} style={{ opacity: 0.3 }} />
                      <p>No session data yet.</p>
                      <p style={{ fontSize: 13, color: '#6b7280' }}>Click <strong style={{ color: '#FF007A' }}>Load Live Data</strong> to fetch from VPS.</p>
                    </div>
                  ) : (
                    <div className="dash-chart-card" style={{ overflowX: 'auto' }}>
                      <table className="dash-table dash-visitors-table">
                        <thead>
                          <tr>
                            <th>IP (masked)</th>
                            <th>Location</th>
                            <th>ISP</th>
                            <th>Device</th>
                            <th>Browser</th>
                            <th>Pages</th>
                            <th>Duration</th>
                            <th>Last Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(data.sessions as VisitorSession[]).map((s, i) => (
                            <motion.tr
                              key={`${s.ip}-${i}`}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.025 }}
                            >
                              <td>
                                <code className="dash-ip-code">{s.ip}</code>
                              </td>
                              <td>
                                <div className="flex items-center gap-2">
                                  {s.countryCode && s.countryCode !== 'XX' && (
                                    <img
                                      src={`https://flagcdn.com/16x12/${s.countryCode.toLowerCase()}.png`}
                                      alt={s.countryCode}
                                      width={16}
                                      height={12}
                                      style={{ borderRadius: 2, flexShrink: 0 }}
                                    />
                                  )}
                                  <span className="dash-location-text">
                                    {[s.city, s.country].filter(Boolean).join(', ') || 'Unknown'}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className="dash-isp-text" title={s.isp}>{s.isp || '—'}</span>
                              </td>
                              <td>
                                <span className="dash-device-badge">
                                  {s.device === 'Mobile' ? <Smartphone size={11} /> : s.device === 'Tablet' ? <Tablet size={11} /> : <Monitor size={11} />}
                                  {s.device}
                                </span>
                              </td>
                              <td>
                                <span className="dash-browser-tag">{s.browser}</span>
                              </td>
                              <td>
                                <div className="dash-pages-list">
                                  {s.pages.slice(0, 3).map((p, pi) => (
                                    <span key={pi} className="dash-page-chip" title={p}>{p.length > 28 ? p.slice(0, 28) + '…' : p}</span>
                                  ))}
                                  {s.pages.length > 3 && (
                                    <span className="dash-page-chip dash-page-chip-more">+{s.pages.length - 3}</span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className="dash-duration-badge">
                                  <Clock size={11} />
                                  {s.duration > 0 ? formatDuration(s.duration) : '<1m'}
                                </span>
                              </td>
                              <td>
                                <span className="dash-time-ago">
                                  {new Date(s.lastActive).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ════════ USER FLOWS ════════ */}
              {activeTab === "User Flows" && (
                <div className="dash-section">
                  <SankeyFlow sessions={data.sessions ?? []} />
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="dash-footer">
          <span>Analytics Dashboard · Oracle VPS</span>
          <span>·</span>
          <span>Import your <code>.json</code> export to visualize live data</span>
        </footer>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Inline styles (avoids Tailwind purge issues for dynamic classes)
// ─────────────────────────────────────────────
const dashStyles = `
  .dash-root {
    min-height: 100vh;
    background: #0d0d0f;
    color: #e5e7eb;
    font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .dash-header {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(13,13,15,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .dash-header-inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 14px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .dash-logo {
    width: 36px;
    height: 36px;
    background: rgba(255,0,122,0.1);
    border: 1px solid rgba(255,0,122,0.25);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dash-title {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: #f9fafb;
    line-height: 1.2;
  }

  .dash-subtitle {
    font-size: 11px;
    color: #6b7280;
    margin-top: 1px;
  }

  .dash-header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .dash-select-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .dash-select-icon {
    position: absolute;
    left: 10px;
    color: #9ca3af;
    pointer-events: none;
  }

  .dash-select-chevron {
    position: absolute;
    right: 8px;
    color: #9ca3af;
    pointer-events: none;
  }

  .dash-select {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: #e5e7eb;
    font-size: 12px;
    padding: 6px 28px 6px 28px;
    appearance: none;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s;
  }

  .dash-select:hover { border-color: rgba(255,255,255,0.22); }

  .dash-time-pills {
    display: flex;
    gap: 4px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 3px;
  }

  .dash-time-pill {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: all 0.18s;
  }

  .dash-time-pill.active {
    background: rgba(255,0,122,0.15);
    color: #FF007A;
  }

  .dash-icon-btn {
    width: 34px;
    height: 34px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #9ca3af;
    transition: all 0.18s;
  }

  .dash-icon-btn:hover { color: #e5e7eb; border-color: rgba(255,255,255,0.22); }
  .dash-icon-btn.active { background: rgba(255,0,122,0.12); color: #FF007A; border-color: rgba(255,0,122,0.3); }

  .dash-btn-accent {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: linear-gradient(135deg, #FF007A 0%, #c4005e 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
  }

  .dash-btn-accent:hover { opacity: 0.88; transform: translateY(-1px); }

  .dash-error-banner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 8px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(239,68,68,0.12);
    border-top: 1px solid rgba(239,68,68,0.25);
    font-size: 13px;
    color: #fca5a5;
  }

  .dash-error-banner button {
    background: none;
    border: none;
    color: #fca5a5;
    cursor: pointer;
    padding: 2px;
  }

  .dash-body {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
  }

  .dash-tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 24px;
  }

  .dash-tab {
    position: relative;
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s;
  }

  .dash-tab:hover { color: #e5e7eb; }
  .dash-tab.active { color: #f9fafb; }

  .dash-tab-underline {
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: #FF007A;
    border-radius: 2px 2px 0 0;
  }

  .dash-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .dash-kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }

  .dash-card {
    background: #141418;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 18px;
    transition: border-color 0.2s, transform 0.2s;
  }

  .dash-card:hover {
    border-color: rgba(255,255,255,0.14);
    transform: translateY(-2px);
  }

  .dash-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .dash-badge {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 7px;
    border-radius: 20px;
  }

  .badge-pos { background: rgba(16,185,129,0.12); color: #34d399; }
  .badge-neg { background: rgba(239,68,68,0.12); color: #f87171; }

  .dash-metric-value {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: #f9fafb;
    margin-top: 12px;
    line-height: 1;
  }

  .dash-metric-label {
    font-size: 12px;
    color: #6b7280;
    margin-top: 5px;
  }

  .dash-chart-card {
    background: #141418;
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 20px 22px;
    overflow: hidden;
  }

  .dash-chart-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .dash-chart-title {
    font-size: 14px;
    font-weight: 600;
    color: #f9fafb;
    letter-spacing: -0.2px;
  }

  .dash-chart-sub {
    font-size: 11px;
    color: #6b7280;
    margin-top: 2px;
  }

  .dash-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .dash-three-col {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  @media (max-width: 900px) {
    .dash-two-col { grid-template-columns: 1fr; }
    .dash-three-col { grid-template-columns: 1fr; }
    .dash-kpi-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 480px) {
    .dash-kpi-grid { grid-template-columns: 1fr; }
    .dash-body { padding: 16px; }
    .dash-header-inner { padding: 12px 16px; }
  }

  /* Geo list */
  .dash-geo-list { display: flex; flex-direction: column; gap: 10px; }

  .dash-geo-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
  }

  .dash-geo-rank { color: #6b7280; font-size: 11px; min-width: 16px; }
  .dash-geo-country { color: #e5e7eb; min-width: 120px; }
  .dash-geo-val { color: #f9fafb; font-weight: 600; min-width: 36px; text-align: right; font-size: 12px; }
  .dash-geo-pct { color: #6b7280; font-size: 11px; min-width: 36px; text-align: right; }

  /* Mini bar */
  .mini-bar-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; min-width: 40px; }
  .mini-bar-fill { height: 100%; border-radius: 3px; }

  /* Legend */
  .dash-legend-list { display: flex; flex-direction: column; gap: 7px; flex: 1; }

  .dash-legend-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }

  .dash-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .dash-legend-label { flex: 1; color: #d1d5db; }
  .dash-legend-val { color: #9ca3af; }

  /* Table */
  .dash-table { width: 100%; border-collapse: collapse; font-size: 13px; }

  .dash-table th {
    text-align: left;
    padding: 8px 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6b7280;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }

  .dash-table td {
    padding: 11px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: #d1d5db;
    vertical-align: middle;
  }

  .dash-table tr:last-child td { border-bottom: none; }

  .dash-table tr:hover td { background: rgba(255,255,255,0.025); }

  .dash-rank-num { color: #6b7280; font-size: 12px; font-weight: 600; }

  .dash-page-path {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    color: #c4b5fd;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 260px;
    display: inline-block;
  }

  .dash-ext-link {
    color: #6b7280;
    display: inline-flex;
    transition: color 0.15s;
  }

  .dash-ext-link:hover { color: #FF007A; }

  .dash-metric-inline {
    font-weight: 700;
    color: #f9fafb;
  }

  .dash-bounce-badge {
    display: inline-flex;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
  }

  .dash-bounce-badge.good { background: rgba(16,185,129,0.12); color: #34d399; }
  .dash-bounce-badge.mid { background: rgba(245,158,11,0.12); color: #fbbf24; }
  .dash-bounce-badge.bad { background: rgba(239,68,68,0.12); color: #f87171; }

  /* Devices */
  .dash-device-list { display: flex; flex-direction: column; gap: 12px; width: 100%; }
  .dash-device-row { display: flex; align-items: center; gap: 10px; }
  .dash-device-icon-wrap { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

  /* Events */
  .dash-events-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .dash-search-wrap {
    position: relative;
    flex: 1;
    max-width: 380px;
  }

  .dash-search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
  }

  .dash-search {
    width: 100%;
    background: #141418;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    padding: 9px 36px;
    color: #e5e7eb;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }

  .dash-search::placeholder { color: #6b7280; }
  .dash-search:focus { border-color: rgba(255,0,122,0.5); }

  .dash-search-clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 2px;
    display: flex;
  }

  .dash-events-count {
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
  }

  .dash-event-dot {
    width: 7px;
    height: 7px;
    background: #7B5CF0;
    border-radius: 50%;
    flex-shrink: 0;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.3); }
  }

  .dash-event-name {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    color: #a78bfa;
    background: rgba(123,92,240,0.1);
    padding: 2px 7px;
    border-radius: 5px;
  }

  .dash-time-ago { font-size: 12px; color: #6b7280; }

  .dash-export-hint {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #6b7280;
    padding: 12px 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
  }

  .dash-export-hint strong { color: #d1d5db; }

  /* Tooltip */
  .dash-tooltip {
    background: #1e1e25;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 10px 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    font-size: 12px;
    min-width: 130px;
  }

  .dash-tooltip-label {
    font-size: 11px;
    color: #9ca3af;
    margin-bottom: 8px;
    font-weight: 500;
  }

  .dash-tooltip-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 0;
    color: #d1d5db;
  }

  .dash-tooltip-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .dash-tooltip-row strong { margin-left: auto; color: #f9fafb; }

  /* Footer */
  .dash-footer {
    text-align: center;
    padding: 20px;
    font-size: 11px;
    color: #4b5563;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-top: 1px solid rgba(255,255,255,0.05);
    margin-top: 16px;
  }

  .hidden { display: none; }
  .flex { display: flex; }
  .flex-1 { flex: 1; }
  .flex-col { flex-direction: column; }
  .flex-wrap { flex-wrap: wrap; }
  .items-center { align-items: center; }
  .items-start { align-items: flex-start; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .gap-4 { gap: 16px; }
  .gap-6 { gap: 24px; }
  .mt-3 { margin-top: 12px; }
  .mt-4 { margin-top: 16px; }
  .mb-1 { margin-bottom: 4px; }
  .mb-4 { margin-bottom: 16px; }
  .text-sm { font-size: 13px; }
  .font-semibold { font-weight: 600; }
  .font-bold { font-weight: 700; }
  .text-right { text-align: right; }
  .w-full { width: 100%; }

  /* ── Live data button ── */
  .dash-btn-live {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: linear-gradient(135deg, #00C9A7 0%, #007a64 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s;
    white-space: nowrap;
  }

  .dash-btn-live:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
  .dash-btn-live:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
  .dash-btn-live.loading { background: linear-gradient(135deg, #4b5563 0%, #374151 100%); }

  /* ── Spinning loader ── */
  @keyframes dash-spin-kf {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .dash-spin { animation: dash-spin-kf 0.8s linear infinite; }

  /* ── Live / Demo badges in header ── */
  .dash-live-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #34d399;
    background: rgba(52,211,153,0.12);
    border: 1px solid rgba(52,211,153,0.3);
    padding: 2px 7px;
    border-radius: 20px;
  }

  .dash-live-dot {
    width: 6px;
    height: 6px;
    background: #34d399;
    border-radius: 50%;
    animation: pulse-dot 1.6s ease-in-out infinite;
  }

  .dash-demo-badge {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #9ca3af;
    background: rgba(156,163,175,0.1);
    border: 1px solid rgba(156,163,175,0.2);
    padding: 2px 7px;
    border-radius: 20px;
  }

  .dash-fetched-time {
    font-size: 10px;
    color: #6b7280;
  }

  /* ── VPS error banner (amber variant) ── */
  .dash-error-vps {
    background: rgba(245,158,11,0.08) !important;
    border-top: 1px solid rgba(245,158,11,0.25) !important;
    color: #fcd34d !important;
  }

  .dash-error-vps-inner {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    flex: 1;
    font-size: 12px;
    line-height: 1.5;
  }

  .dash-error-hint {
    color: #9ca3af;
    font-size: 11px;
  }

  /* ─── Visitors tab ─── */
  .dash-visitors-table {
    min-width: 900px;
  }

  .dash-ip-code {
    font-family: 'Courier New', monospace;
    font-size: 11px;
    background: rgba(255,255,255,0.06);
    padding: 2px 7px;
    border-radius: 5px;
    color: #FF007A;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }

  .dash-location-text {
    font-size: 12px;
    color: #e5e7eb;
    white-space: nowrap;
  }

  .dash-isp-text {
    font-size: 11px;
    color: #9ca3af;
    max-width: 140px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dash-device-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 99px;
    background: rgba(123,92,240,0.12);
    color: #a78bfa;
    border: 1px solid rgba(123,92,240,0.2);
    white-space: nowrap;
  }

  .dash-browser-tag {
    font-size: 11px;
    color: #6b7280;
    background: rgba(255,255,255,0.04);
    padding: 2px 7px;
    border-radius: 5px;
    border: 1px solid rgba(255,255,255,0.07);
  }

  .dash-pages-list {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    max-width: 220px;
  }

  .dash-page-chip {
    font-size: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    padding: 1px 6px;
    border-radius: 4px;
    color: #9ca3af;
    font-family: monospace;
    white-space: nowrap;
  }

  .dash-page-chip-more {
    background: rgba(255,0,122,0.08);
    border-color: rgba(255,0,122,0.2);
    color: #FF007A;
  }

  .dash-duration-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #00C9A7;
    white-space: nowrap;
  }

  .dash-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 60px 20px;
    color: #6b7280;
    text-align: center;
  }
`;
