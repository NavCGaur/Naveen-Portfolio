"use client";

import { useMemo } from "react";
import { X, Clock, Globe, Monitor, Smartphone, Tablet, HelpCircle } from "lucide-react";
import type { VisitorSession } from "./types";
import { normalizePages } from "./types";

interface VisitorJourneyProps {
  session: VisitorSession | null;
  onClose: () => void;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function formatClockTime(iso: string) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return null;
  }
}

export default function VisitorJourney({ session, onClose }: VisitorJourneyProps) {
  const steps = useMemo(() => {
    if (!session) return [];
    const pages = normalizePages(session.pages);
    return pages.map((p, i) => ({
      ...p,
      stepNum: i + 1,
      isLast: i === pages.length - 1,
      clockTime: formatClockTime(p.enteredAt),
      hasTiming: !!p.enteredAt,
    }));
  }, [session]);

  const maxDuration = useMemo(() => {
    const durations = steps.map((s) => s.duration).filter((d): d is number => typeof d === "number");
    return durations.length > 0 ? Math.max(...durations) : 0;
  }, [steps]);

  const anyTimingAvailable = steps.some((s) => s.hasTiming);

  if (!session) return null;

  const DeviceIcon = session.device === "Mobile" ? Smartphone : session.device === "Tablet" ? Tablet : Monitor;

  return (
    <div
      className="vj-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="vj-panel">
        {/* ── Header ── */}
        <div className="vj-header">
          <div>
            <div className="vj-header-top">
              <code className="vj-ip">{session.ip}</code>
              {session.countryCode && session.countryCode !== "XX" && (
                <img
                  src={`https://flagcdn.com/16x12/${session.countryCode.toLowerCase()}.png`}
                  alt={session.countryCode}
                  width={16}
                  height={12}
                  style={{ borderRadius: 2 }}
                />
              )}
              <span className="vj-location">
                {[session.city, session.country].filter(Boolean).join(", ") || "Unknown location"}
              </span>
            </div>
            <div className="vj-header-sub">
              <span className="vj-meta-chip">
                <DeviceIcon size={11} />
                {session.device}
              </span>
              {session.browser && <span className="vj-meta-chip">{session.browser}</span>}
              <span className="vj-meta-chip">
                <Clock size={11} />
                {formatDuration(session.duration)} total
              </span>
              {session.isp && <span className="vj-meta-chip vj-isp">{session.isp}</span>}
            </div>
          </div>
          <button className="vj-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {!anyTimingAvailable && (
          <div className="vj-timing-notice">
            <HelpCircle size={13} />
            <span>
              Per-page timing isn&apos;t available for this session (older data format). Showing page sequence only.
            </span>
          </div>
        )}

        {/* ── Timeline ── */}
        <div className="vj-timeline">
          {steps.map((step) => (
            <div key={step.stepNum} className="vj-step">
              <div className="vj-step-rail">
                <div className="vj-step-dot">{step.stepNum}</div>
                {!step.isLast && <div className="vj-step-line" />}
              </div>

              <div className="vj-step-body">
                <div className="vj-step-top">
                  <span className="vj-step-path">{step.path}</span>
                  {step.clockTime && <span className="vj-step-clock">{step.clockTime}</span>}
                </div>

                {step.hasTiming ? (
                  typeof step.duration === "number" ? (
                    <div className="vj-step-duration-row">
                      <div className="vj-step-bar-bg">
                        <div
                          className="vj-step-bar-fill"
                          style={{
                            width: maxDuration > 0 ? `${Math.max((step.duration / maxDuration) * 100, 4)}%` : "4%",
                          }}
                        />
                      </div>
                      <span className="vj-step-duration-label">{formatDuration(step.duration)}</span>
                    </div>
                  ) : (
                    <span className="vj-step-active">
                      {step.isLast ? "Still on this page (or session ended here)" : "Duration unknown"}
                    </span>
                  )
                ) : (
                  <span className="vj-step-no-timing">No timing data</span>
                )}
              </div>
            </div>
          ))}

          {steps.length === 0 && (
            <div className="vj-empty">
              <Globe size={24} style={{ opacity: 0.3 }} />
              <p>No page data for this session.</p>
            </div>
          )}
        </div>
      </div>

      <style>{vjStyles}</style>
    </div>
  );
}

const vjStyles = `
  .vj-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 24px;
  }

  .vj-panel {
    background: #141418;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    width: 100%;
    max-width: 560px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }

  .vj-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 20px 22px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    position: sticky;
    top: 0;
    background: #141418;
    z-index: 1;
  }

  .vj-header-top {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .vj-ip {
    font-family: 'Courier New', monospace;
    font-size: 13px;
    background: rgba(255,255,255,0.06);
    padding: 3px 8px;
    border-radius: 6px;
    color: #C4A35A;
  }

  .vj-location {
    font-size: 13px;
    color: #e5e7eb;
    font-weight: 600;
  }

  .vj-header-sub {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 10px;
  }

  .vj-meta-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #9ca3af;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 3px 8px;
    border-radius: 99px;
  }

  .vj-isp {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vj-close {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: #9ca3af;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition: all 0.15s;
  }

  .vj-close:hover {
    color: #e5e7eb;
    border-color: rgba(255,255,255,0.2);
  }

  .vj-timing-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #fbbf24;
    background: rgba(245,158,11,0.08);
    border-bottom: 1px solid rgba(245,158,11,0.15);
    padding: 10px 22px;
  }

  .vj-timeline {
    padding: 20px 22px 26px;
    display: flex;
    flex-direction: column;
  }

  .vj-step {
    display: flex;
    gap: 14px;
  }

  .vj-step-rail {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  .vj-step-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: rgba(196, 163, 90, 0.15);
    border: 1px solid rgba(196, 163, 90, 0.35);
    color: #C4A35A;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .vj-step-line {
    width: 2px;
    flex: 1;
    min-height: 28px;
    background: linear-gradient(to bottom, rgba(196, 163, 90, 0.3), rgba(255,255,255,0.08));
    margin: 2px 0;
  }

  .vj-step-body {
    flex: 1;
    padding-bottom: 22px;
    min-width: 0;
  }

  .vj-step-top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 6px;
  }

  .vj-step-path {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    color: #e5e7eb;
    word-break: break-all;
  }

  .vj-step-clock {
    font-size: 11px;
    color: #6b7280;
    white-space: nowrap;
    flex-shrink: 0;
  }

  .vj-step-duration-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .vj-step-bar-bg {
    flex: 1;
    height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    overflow: hidden;
    max-width: 220px;
  }

  .vj-step-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #C4A35A, #7B5CF0);
    border-radius: 3px;
  }

  .vj-step-duration-label {
    font-size: 12px;
    color: #00C9A7;
    font-weight: 600;
    white-space: nowrap;
  }

  .vj-step-active {
    font-size: 12px;
    color: #fbbf24;
    font-style: italic;
  }

  .vj-step-no-timing {
    font-size: 12px;
    color: #4b5563;
    font-style: italic;
  }

  .vj-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 40px 0;
    color: #6b7280;
    font-size: 13px;
  }
`;
