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
  at: number;
};

const DURATION_MS = 9000;
const START_DELAY_MS = 500;

// Canvas: 660 × 400
// 5 rows at y = 40, 120, 200, 280, 360  (80 px apart, arc-only transitions, r=40)
const CANVAS_W = 660;
const CANVAS_H = 400;

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

  // 5 rows: y = 40, 120, 200, 280, 360
  // Arc radius = 40 px, no straight vertical segments between arcs
  const pathD = useMemo(
    () => `
      M 60 40
      H 560
      A 40 40 0 0 1 600 80
      V 80
      A 40 40 0 0 1 560 120
      H 60
      A 40 40 0 0 0 20 160
      V 160
      A 40 40 0 0 0 60 200
      H 560
      A 40 40 0 0 1 600 240
      V 240
      A 40 40 0 0 1 560 280
      H 60
      A 40 40 0 0 0 20 320
      V 320
      A 40 40 0 0 0 60 360
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

  // Helper: below-label transform with slide-in from above
  const belowXform = (isActive: boolean) =>
    isActive ? "translate(-50%, 0)" : "translate(-50%, -8px)";
  // Helper: above-label transform (unchanged)
  const aboveXform = (isActive: boolean) =>
    isActive ? "translate(-50%, -100%)" : "translate(-50%, calc(-100% + 6px))";

  return (
    <div
      ref={wrapperRef}
      className="w-full overflow-visible"
      style={{ height: CANVAS_H * scale }}
    >
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

        /* ── Pills ── */
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
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
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
          box-shadow: 0 10px 24px rgba(0,0,0,0.11);
          transform: translateY(-1px) scale(1);
        }
        .pill-icon {
          width: 38px; height: 38px;
          border-radius: 999px;
          display: grid; place-items: center;
          flex: 0 0 auto;
          background: rgba(196,163,90,0.12);
          color: #7f6530;
          transition: background 320ms ease, color 320ms ease, transform 320ms ease;
          font-size: 16px;
        }
        .anim-pill.active .pill-icon {
          background: rgba(196,163,90,0.95);
          color: white;
          transform: scale(1.01);
        }
        .pill-text {
          font-size: 14px; font-weight: 700;
          letter-spacing: -0.01em;
          color: rgba(33,63,69,0.78);
          transition: color 320ms ease;
        }
        .anim-pill.active .pill-text { color: rgba(33,63,69,0.98); }

        /* ── Labels ── */
        .anim-label {
          position: absolute;
          font-size: 12.5px;
          line-height: 1.4;
          font-weight: 600;
          color: rgba(33, 63, 69, 0.28);
          opacity: 0.95;
          transition:
            color 360ms ease,
            transform 360ms ease,
            opacity 360ms ease;
          z-index: 10;
          pointer-events: none;
          letter-spacing: -0.01em;
        }
        .anim-label.active { color: rgba(33, 63, 69, 0.95); }

        /* ── Station dots ── */
        .anim-dot {
          opacity: 0;
          transform: scale(0.6);
          transform-origin: center;
          transition: opacity 260ms ease, transform 260ms ease;
          filter: drop-shadow(0 0 7px rgba(244,220,170,0.45));
        }
        .anim-dot.active { opacity: 1; transform: scale(1); }

        /* ── Shield ── */
        .shield-wrap {
          position: absolute;
          opacity: 0;
          transform: translateY(10px) scale(0.85);
          transition: opacity 400ms ease, transform 400ms ease;
          z-index: 10;
        }
        .shield-wrap.active {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .shield-ring {
          position: absolute;
          inset: -14px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(244,220,170,0.28) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 500ms ease 300ms;
        }
        .shield-wrap.active .shield-ring {
          opacity: 1;
          animation: shieldPulse 2.2s ease-in-out infinite;
        }
        @keyframes shieldPulse {
          0%,100% { transform: scale(1);    opacity: 0.7; }
          50%      { transform: scale(1.35); opacity: 0.18; }
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

          {/* Moving head */}
          <circle cx={currentPoint.x} cy={currentPoint.y} r={7}
            fill="rgba(244,220,170,0.98)"
            style={{ filter: "drop-shadow(0 0 10px rgba(244,220,170,0.6))" }} />
          <circle cx={currentPoint.x} cy={currentPoint.y} r={2.8}
            fill="rgba(25,48,52,0.92)" />

          {/* Station dots */}
          <circle className={`anim-dot ${dotActive("dot-1") ? "active" : ""}`} cx="460" cy="40"  r="6" fill="rgba(244,220,170,0.98)" />
          <circle className={`anim-dot ${dotActive("dot-2") ? "active" : ""}`} cx="160" cy="120" r="6" fill="rgba(244,220,170,0.98)" />
          <circle className={`anim-dot ${dotActive("dot-3") ? "active" : ""}`} cx="460" cy="200" r="6" fill="rgba(244,220,170,0.98)" />
          <circle className={`anim-dot ${dotActive("dot-4") ? "active" : ""}`} cx="160" cy="280" r="6" fill="rgba(244,220,170,0.98)" />
          <circle className={`anim-dot ${dotActive("dot-5") ? "active" : ""}`} cx="360" cy="360" r="6" fill="rgba(244,220,170,0.98)" />
        </svg>

        {/* ── Pill 1 — Website Audit (left, row 1) ── */}
        <div className={`anim-pill ${active("pill-1") ? "active" : ""}`} style={{ top: 13, left: 26 }}>
          <div className="pill-icon">🔍</div>
          <span className="pill-text">Website Audit</span>
        </div>

        {/* ── Pill 2 — Speed & Growth (centred, row 3) ── */}
        <div className={`anim-pill ${active("pill-2") ? "active" : ""}`} style={{ top: 173, left: 190 }}>
          <div className="pill-icon">⚡</div>
          <span className="pill-text">Speed, UX &amp; Growth</span>
        </div>

        {/* ── Label 1 — ABOVE dot at (460, 40) ── */}
        <div
          className={`anim-label ${active("label-1") ? "active" : ""}`}
          style={{ top: 28, left: 460, textAlign: "center", whiteSpace: "nowrap",
            transform: aboveXform(active("label-1")) }}
        >
          Find What&apos;s Slowing<br />Your Business Down
        </div>

        {/* ── Label 2 — BELOW dot at (160, 120) ── */}
        <div
          className={`anim-label ${active("label-2") ? "active" : ""}`}
          style={{ top: 132, left: 160, textAlign: "center", whiteSpace: "nowrap",
            transform: belowXform(active("label-2")) }}
        >
          Fix Broken Pages,<br />Errors &amp; Security Risks
        </div>

        {/* ── Label 3 — BELOW dot at (460, 200) ── */}
        <div
          className={`anim-label ${active("label-3") ? "active" : ""}`}
          style={{ top: 212, left: 460, textAlign: "center", whiteSpace: "nowrap",
            transform: belowXform(active("label-3")) }}
        >
          Faster Load Times<br />Across Mobile &amp; Desktop
        </div>

        {/* ── Label 4 — BELOW dot at (160, 280) ── */}
        <div
          className={`anim-label ${active("label-4") ? "active" : ""}`}
          style={{ top: 292, left: 160, textAlign: "center", whiteSpace: "nowrap",
            transform: belowXform(active("label-4")) }}
        >
          Custom Features<br />Tailored To Your Business
        </div>

        {/* ── Label 5 — BELOW dot at (360, 360) ── */}
        <div
          className={`anim-label ${active("label-5") ? "active" : ""}`}
          style={{ top: 372, left: 360, textAlign: "center", whiteSpace: "nowrap",
            transform: belowXform(active("label-5")) }}
        >
          Reliable Hosting, Maintenance<br />&amp; Ongoing Support
        </div>

        {/* ── Shield — dark body, gold glow, 4-point star ── */}
        <div
          className={`shield-wrap ${active("flag") ? "active" : ""}`}
          style={{ top: 333, left: 534 }}
        >
          <div className="shield-ring" />
          <svg
            width="52" height="62"
            viewBox="0 0 32 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter:
                "drop-shadow(0 0 14px rgba(244,220,170,0.7)) drop-shadow(0 0 5px rgba(244,220,170,0.45))",
            }}
          >
            {/* Dark shield body with gold border */}
            <path
              d="M16 0L32 7.125V17.8125C32 27.2887 25.136 36.1475 16 38C6.864 36.1475 0 27.2887 0 17.8125V7.125L16 0Z"
              fill="rgba(15, 36, 42, 0.94)"
              stroke="rgba(244,220,170,0.95)"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* 4-point star (diamond asterisk) in gold */}
            <path
              d="M16 8 L17.6 14.4 L24 16 L17.6 17.6 L16 24 L14.4 17.6 L8 16 L14.4 14.4 Z"
              fill="rgba(244,220,170,0.98)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
