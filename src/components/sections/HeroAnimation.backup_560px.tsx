"use client";

import { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";

type NodeId =
  | "pill-1"
  | "label-1"
  | "dot-1"
  | "label-2"
  | "dot-2"
  | "pill-2"
  | "label-3"
  | "dot-3"
  | "label-4"
  | "dot-4"
  | "label-5"
  | "dot-5"
  | "flag";

type NodeMeta = {
  id: NodeId;
  at: number; // normalized progress 0..1;
};

const DURATION_MS = 9000;
const START_DELAY_MS = 500;

// Canvas is 660 wide × 560 tall.
// 5 horizontal rows at y = 40, 160, 280, 400, 520 (120 px apart).
// Each row-to-row transition = arc-down (r=40, 40px) + straight (40px) + arc-level (r=40, 40px) = 120px total.
const CANVAS_W = 660;
const CANVAS_H = 560;

const nodes: NodeMeta[] = [
  { id: "pill-1",  at: 0.00 },
  { id: "label-1", at: 0.10 },
  { id: "dot-1",   at: 0.17 },

  { id: "label-2", at: 0.34 },
  { id: "dot-2",   at: 0.38 },

  { id: "pill-2",  at: 0.50 },
  { id: "label-3", at: 0.58 },
  { id: "dot-3",   at: 0.62 },

  { id: "label-4", at: 0.73 },
  { id: "dot-4",   at: 0.77 },

  { id: "label-5", at: 0.88 },
  { id: "dot-5",   at: 0.92 },

  { id: "flag",    at: 0.98 },
];

export default function HeroAnimation() {
  const pathRef    = useRef<SVGPathElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement  | null>(null);
  const [progress,    setProgress]    = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [scale,       setScale]       = useState(1);

  const useSafeLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // Measure outer wrapper width and keep inner canvas scaled to fill it.
  useSafeLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      setScale(el.clientWidth / CANVAS_W);
    });
    observer.observe(el);
    setScale(el.clientWidth / CANVAS_W);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!pathRef.current) return;
    setTotalLength(pathRef.current.getTotalLength());
  }, []);

  useEffect(() => {
    let raf = 0;
    const startAt = performance.now() + START_DELAY_MS;
    const tick = (now: number) => {
      const next = Math.min(1, Math.max(0, (now - startAt) / DURATION_MS));
      setProgress(next);
      if (next < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const active = (id: NodeId) =>
    progress >= nodes.find((n) => n.id === id)!.at;

  // 5 rows: y = 40, 160, 280, 400, 520
  // Right turns: x=560 → arc to x=600, arriving 40px lower → V down 40px → arc back to x=560, arriving 40px lower
  // Left turns:  x=60  → arc to x=20,  arriving 40px lower → V down 40px → arc back to x=60,  arriving 40px lower
  const pathD = useMemo(
    () => `
      M 60 40
      H 560
      A 40 40 0 0 1 600 80
      V 120
      A 40 40 0 0 1 560 160
      H 60
      A 40 40 0 0 0 20 200
      V 240
      A 40 40 0 0 0 60 280
      H 560
      A 40 40 0 0 1 600 320
      V 360
      A 40 40 0 0 1 560 400
      H 60
      A 40 40 0 0 0 20 440
      V 480
      A 40 40 0 0 0 60 520
      H 560
    `,
    []
  );

  const currentPoint =
    pathRef.current && totalLength > 0
      ? pathRef.current.getPointAtLength(totalLength * progress)
      : { x: 60, y: 40 };

  const drawLength = totalLength * progress;
  const dotActive  = (id: NodeId) => (active(id) ? 1 : 0);

  return (
    /* Outer wrapper: fills the grid column */
    <div
      ref={wrapperRef}
      className="w-full overflow-visible"
      style={{ height: CANVAS_H * scale }}
    >
      {/* Inner canvas: fixed 660×560, scaled via CSS transform */}
      <div
        className="relative origin-top-left"
        style={{
          width:  CANVAS_W,
          height: CANVAS_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <style>{`
        .hero-track {
          fill: none;
          stroke: rgba(255, 255, 255, 0.22);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
        }

        .hero-progress {
          fill: none;
          stroke: rgba(244, 220, 170, 0.95);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          vector-effect: non-scaling-stroke;
          filter: drop-shadow(0 0 6px rgba(244, 220, 170, 0.28));
        }

        .anim-pill {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 10px;
          height: 54px;
          padding: 8px 18px 8px 8px;
          border-radius: 999px;
          background: rgba(235, 238, 235, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.35);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
          opacity: 0.55;
          transform: translateY(0) scale(0.985);
          transition:
            opacity 320ms ease,
            background 320ms ease,
            box-shadow 320ms ease,
            border-color 320ms ease,
            transform 320ms ease;
          z-index: 10;
          white-space: nowrap;
          backdrop-filter: blur(6px);
        }

        .anim-pill.active {
          opacity: 1;
          background: rgba(240, 244, 238, 0.98);
          border-color: rgba(244, 220, 170, 0.65);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.11);
          transform: translateY(-1px) scale(1);
        }

        .pill-icon {
          width: 38px;
          height: 38px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          background: rgba(196, 163, 90, 0.12);
          color: #7f6530;
          transition: background 320ms ease, color 320ms ease, transform 320ms ease;
          font-size: 16px;
        }

        .anim-pill.active .pill-icon {
          background: rgba(196, 163, 90, 0.95);
          color: white;
          transform: scale(1.01);
        }

        .pill-text {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: rgba(33, 63, 69, 0.78);
          transition: color 320ms ease;
        }

        .anim-pill.active .pill-text {
          color: rgba(33, 63, 69, 0.98);
        }

        .anim-label {
          position: absolute;
          font-size: 13px;
          line-height: 1.45;
          font-weight: 600;
          color: rgba(33, 63, 69, 0.28);
          opacity: 0.95;
          transform: translateY(6px);
          transition:
            color 360ms ease,
            transform 360ms ease,
            opacity 360ms ease;
          z-index: 10;
          pointer-events: none;
          letter-spacing: -0.01em;
        }

        .anim-label.active {
          color: rgba(33, 63, 69, 0.95);
          transform: translateY(0);
        }

        .anim-dot {
          opacity: 0;
          transform: scale(0.6);
          transform-origin: center;
          transition:
            opacity 260ms ease,
            transform 260ms ease;
          filter: drop-shadow(0 0 7px rgba(244, 220, 170, 0.4));
        }

        .anim-dot.active {
          opacity: 1;
          transform: scale(1);
        }

        /* Shield: large, glowing, with a pulse ring when active */
        .shield-wrap {
          position: absolute;
          opacity: 0;
          transform: translateY(10px) scale(0.85);
          transition:
            opacity 400ms ease,
            transform 400ms ease;
          z-index: 10;
        }

        .shield-wrap.active {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .shield-glow {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,220,170,0.22) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 400ms ease 200ms;
        }

        .shield-wrap.active .shield-glow {
          opacity: 1;
          animation: shieldPulse 2.4s ease-in-out infinite;
        }

        @keyframes shieldPulse {
          0%, 100% { transform: scale(1);   opacity: 0.55; }
          50%       { transform: scale(1.25); opacity: 0.20; }
        }
      `}</style>

        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
          aria-hidden="true"
        >
          <path className="hero-track" d={pathD} />

          <path
            ref={pathRef}
            className="hero-progress"
            d={pathD}
            strokeDasharray={totalLength || 1}
            strokeDashoffset={Math.max(0, totalLength - drawLength)}
          />

          {/* Moving head dot */}
          <circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r={7}
            fill="rgba(244, 220, 170, 0.98)"
            style={{ filter: "drop-shadow(0 0 10px rgba(244,220,170,0.6))" }}
          />
          <circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r={2.8}
            fill="rgba(25, 48, 52, 0.92)"
          />

          {/* Station dots — sit exactly on the path */}
          <circle className={`anim-dot ${dotActive("dot-1") ? "active" : ""}`} cx="460" cy="40"  r="6" fill="rgba(244,220,170,0.98)" />
          <circle className={`anim-dot ${dotActive("dot-2") ? "active" : ""}`} cx="160" cy="160" r="6" fill="rgba(244,220,170,0.98)" />
          <circle className={`anim-dot ${dotActive("dot-3") ? "active" : ""}`} cx="460" cy="280" r="6" fill="rgba(244,220,170,0.98)" />
          <circle className={`anim-dot ${dotActive("dot-4") ? "active" : ""}`} cx="160" cy="400" r="6" fill="rgba(244,220,170,0.98)" />
          <circle className={`anim-dot ${dotActive("dot-5") ? "active" : ""}`} cx="360" cy="520" r="6" fill="rgba(244,220,170,0.98)" />
        </svg>

        {/* ── Pill 1 — Website Audit (row 1, left-aligned) ── */}
        <div className={`anim-pill ${active("pill-1") ? "active" : ""}`} style={{ top: 13, left: 26 }}>
          <div className="pill-icon">🔍</div>
          <span className="pill-text">Website Audit</span>
        </div>

        {/* ── Pill 2 — Speed & Growth (row 3, centred) ── */}
        <div className={`anim-pill ${active("pill-2") ? "active" : ""}`} style={{ top: 253, left: 190 }}>
          <div className="pill-icon">⚡</div>
          <span className="pill-text">Speed, UX &amp; Growth</span>
        </div>

        {/* ── Labels ── */}
        {/* Row 1 dot at (460, 40) */}
        <div
          className={`anim-label ${active("label-1") ? "active" : ""}`}
          style={{ top: 28, left: 460, textAlign: "center", whiteSpace: "nowrap",
            transform: active("label-1") ? "translate(-50%,-100%)" : "translate(-50%,calc(-100% + 6px))" }}
        >
          Find What&apos;s Slowing<br />Your Business Down
        </div>

        {/* Row 2 dot at (160, 160) */}
        <div
          className={`anim-label ${active("label-2") ? "active" : ""}`}
          style={{ top: 148, left: 160, textAlign: "center", whiteSpace: "nowrap",
            transform: active("label-2") ? "translate(-50%,-100%)" : "translate(-50%,calc(-100% + 6px))" }}
        >
          Fix Broken Pages,<br />Errors &amp; Security Risks
        </div>

        {/* Row 3 dot at (460, 280) */}
        <div
          className={`anim-label ${active("label-3") ? "active" : ""}`}
          style={{ top: 268, left: 460, textAlign: "center", whiteSpace: "nowrap",
            transform: active("label-3") ? "translate(-50%,-100%)" : "translate(-50%,calc(-100% + 6px))" }}
        >
          Faster Load Times<br />Across Mobile &amp; Desktop
        </div>

        {/* Row 4 dot at (160, 400) */}
        <div
          className={`anim-label ${active("label-4") ? "active" : ""}`}
          style={{ top: 388, left: 160, textAlign: "center", whiteSpace: "nowrap",
            transform: active("label-4") ? "translate(-50%,-100%)" : "translate(-50%,calc(-100% + 6px))" }}
        >
          Custom Features<br />Tailored To Your Business
        </div>

        {/* Row 5 dot at (360, 520) */}
        <div
          className={`anim-label ${active("label-5") ? "active" : ""}`}
          style={{ top: 508, left: 360, textAlign: "center", whiteSpace: "nowrap",
            transform: active("label-5") ? "translate(-50%,-100%)" : "translate(-50%,calc(-100% + 6px))" }}
        >
          Reliable Hosting, Maintenance<br />&amp; Ongoing Support
        </div>

        {/* ── Shield — at path end (560, 520) ── */}
        <div
          className={`shield-wrap ${active("flag") ? "active" : ""}`}
          style={{ top: 498, left: 536 }}
        >
          <div className="shield-glow" />
          <svg width="48" height="58" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{ filter: "drop-shadow(0 0 14px rgba(244,220,170,0.75)) drop-shadow(0 0 4px rgba(244,220,170,0.5))" }}>
            <path
              d="M16 0L32 7.125V17.8125C32 27.2887 25.136 36.1475 16 38C6.864 36.1475 0 27.2887 0 17.8125V7.125L16 0Z"
              fill="rgba(244, 220, 170, 0.18)"
              stroke="rgba(244, 220, 170, 0.98)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M10 19L14 23L22 13"
              stroke="rgba(244, 220, 170, 0.98)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
