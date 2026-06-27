"use client";

import { useMemo, useState } from "react";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import type { SankeyNodeMinimal, SankeyLinkMinimal } from "d3-sankey";
import type { VisitorSession } from "./types";
import { normalizePages } from "./types";
import { Filter, GitCommit, Info } from "lucide-react";

interface SankeyFlowProps {
  sessions: VisitorSession[];
}

// ─── d3-sankey node/link shapes ───
interface FlowNode extends SankeyNodeMinimal<FlowNode, FlowLink> {
  name: string;
}
interface FlowLink extends SankeyLinkMinimal<FlowNode, FlowLink> {
  value: number;
}

// ─── Color palette matching our dark modern theme ───
const PALETTE = {
  accent: "#FF007A",
  accent2: "#7B5CF0",
  accent3: "#00C9A7",
  accent4: "#F59E0B",
  blue: "#3B82F6",
  slate: "#6B7280",
};

const PAGE_COLORS: Record<string, string> = {
  "/": PALETTE.accent,
  "/blog": PALETTE.accent2,
  "/free-audit": PALETTE.accent3,
  "/hosting-automation": PALETTE.accent4,
  "/whatsapp-automation": PALETTE.blue,
  "/how-it-works": "#14B8A6",
  "/migration": "#EC4899",
  exit: "#374151",
};

// Pastel/neon palette specifically for light curves on dark backgrounds
const LINK_COLORS: Record<string, string> = {
  "/": "#FF79B0",                // Pastel neon pink
  "/blog": "#A78BFA",            // Pastel purple
  "/free-audit": "#34D399",      // Bright green/teal
  "/hosting-automation": "#FBBF24", // Bright gold
  "/whatsapp-automation": "#60A5FA", // Light blue
  "/how-it-works": "#2DD4BF",
  "/migration": "#F472B6",
  "exit": "#9CA3AF"
};

const FALLBACK_COLORS = [
  "#FF007A", "#7B5CF0", "#00C9A7", "#F59E0B", "#3B82F6",
  "#EC4899", "#14B8A6", "#A78BFA", "#34D399", "#FBBF24",
  "#60A5FA", "#F472B6", "#2DD4BF", "#FB923C", "#818CF8",
];

const stripStepPrefix = (name: string) => {
  const dot = name.indexOf(". ");
  return dot !== -1 ? name.slice(dot + 2).trim() : name.trim();
};

/**
 * Builds a stable color map for the set of distinct page paths present in
 * the current graph. Cycles fallback colors for unknown pages.
 */
function buildColorMap(paths: string[]): Map<string, string> {
  const map = new Map<string, string>();
  let cycleIdx = 0;
  const usedColors = new Set<string>(Object.values(PAGE_COLORS));

  paths.forEach((path) => {
    if (map.has(path)) return;
    if (path.toLowerCase().includes("exit")) {
      map.set(path, PALETTE.slate);
      return;
    }
    if (PAGE_COLORS[path]) {
      map.set(path, PAGE_COLORS[path]);
      return;
    }
    let attempts = 0;
    while (usedColors.has(FALLBACK_COLORS[cycleIdx % FALLBACK_COLORS.length]) && attempts < FALLBACK_COLORS.length) {
      cycleIdx++;
      attempts++;
    }
    const color = FALLBACK_COLORS[cycleIdx % FALLBACK_COLORS.length];
    usedColors.add(color);
    map.set(path, color);
    cycleIdx++;
  });

  return map;
}

const getLinkColor = (name: string) => {
  const path = stripStepPrefix(name);
  if (path.toLowerCase().includes("exit")) return "#4B5563"; // slate gray
  return LINK_COLORS[path] || "#9CA3AF";
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function SankeyFlow({ sessions = [] }: SankeyFlowProps) {
  const [maxSteps, setMaxSteps] = useState<number>(4);
  const [deviceFilter, setDeviceFilter] = useState<string>("All");
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    kind: "node" | "link";
    title: string;
    sub?: string;
    value: number;
    color: string;
  } | null>(null);

  const devices = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s) => {
      if (s.device) set.add(s.device);
    });
    return Array.from(set);
  }, [sessions]);

  // ── Build raw node/link graph ──
  const graph = useMemo(() => {
    const filtered = sessions.filter((s) => deviceFilter === "All" || s.device === deviceFilter);
    if (filtered.length === 0) return { nodes: [] as FlowNode[], links: [] as FlowLink[] };

    const rawCounts = new Map<string, number>();
    filtered.forEach((session) => {
      const path = normalizePages(session.pages).map((p) => p.path);
      const stepsCount = Math.min(path.length, maxSteps);
      for (let i = 0; i < stepsCount; i++) {
        const label = `${i + 1}. ${path[i]}`;
        rawCounts.set(label, (rawCounts.get(label) || 0) + 1);
      }
    });

    const MIN_VISITS_TO_SHOW = Math.max(2, Math.floor(filtered.length * 0.04));
    const resolveLabel = (stepNum: number, rawPath: string) => {
      const label = `${stepNum}. ${rawPath}`;
      const count = rawCounts.get(label) || 0;
      return count < MIN_VISITS_TO_SHOW ? `${stepNum}. Other pages` : label;
    };

    const nodeNames: string[] = [];
    const nodeIndex = new Map<string, number>();
    const linkMap = new Map<string, number>();

    const addNode = (name: string): number => {
      let idx = nodeIndex.get(name);
      if (idx === undefined) {
        idx = nodeNames.length;
        nodeNames.push(name);
        nodeIndex.set(name, idx);
      }
      return idx;
    };

    filtered.forEach((session) => {
      const path = normalizePages(session.pages).map((p) => p.path);
      if (path.length === 0) return;
      const stepsCount = Math.min(path.length, maxSteps);

      for (let i = 0; i < stepsCount; i++) {
        const stepNum = i + 1;
        const currentNodeName = resolveLabel(stepNum, path[i]);
        const sourceIdx = addNode(currentNodeName);

        if (i < stepsCount - 1 && path[i + 1]) {
          const targetIdx = addNode(resolveLabel(stepNum + 1, path[i + 1]));
          const key = `${sourceIdx}->${targetIdx}`;
          linkMap.set(key, (linkMap.get(key) || 0) + 1);
        } else {
          const targetIdx = addNode(`Exit (Step ${stepNum})`);
          const key = `${sourceIdx}->${targetIdx}`;
          linkMap.set(key, (linkMap.get(key) || 0) + 1);
        }
      }
    });

    const nodes: FlowNode[] = nodeNames.map((name) => ({ name } as FlowNode));
    const links: FlowLink[] = [];
    linkMap.forEach((val, key) => {
      const [s, t] = key.split("->").map(Number);
      if (s === t || s < 0 || t < 0 || s >= nodes.length || t >= nodes.length) return;
      links.push({ source: s, target: t, value: val } as FlowLink);
    });

    return { nodes, links };
  }, [sessions, maxSteps, deviceFilter]);

  const hasData = graph.nodes.length > 0 && graph.links.length > 0;

  // Distinct colors per distinct path
  const colorMap = useMemo(() => {
    const paths = graph.nodes.map((n) => stripStepPrefix(n.name));
    return buildColorMap(paths);
  }, [graph]);

  const getNodeColor = (name: string): string => {
    const path = stripStepPrefix(name);
    return colorMap.get(path) || PALETTE.blue;
  };

  // Layout dimensions
  const width = 1000;
  const height = Math.max(420, Math.min(900, graph.nodes.length * 34));

  // Run layout
  const layout = useMemo(() => {
    if (!hasData) return null;
    const sankeyGenerator = sankey<FlowNode, FlowLink>()
      .nodeWidth(14)
      .nodePadding(14)
      .extent([
        [1, 24],
        [width - 1, height - 24],
      ]);

    const nodesCopy = graph.nodes.map((d) => ({ ...d }));
    const linksCopy = graph.links.map((d) => ({ ...d }));

    try {
      return sankeyGenerator({ nodes: nodesCopy, links: linksCopy as any });
    } catch {
      return null;
    }
  }, [graph, hasData, height]);

  const linkPathGen = sankeyLinkHorizontal();

  const sankeyColumnGap = useMemo(() => {
    if (!layout || layout.nodes.length === 0) return 160;
    const maxDepth = Math.max(...layout.nodes.map((n: any) => n.depth ?? 0));
    const usableWidth = width - 2;
    return maxDepth > 0 ? usableWidth / (maxDepth + 1) : usableWidth;
  }, [layout, width]);

  return (
    <div className="dash-chart-card flex flex-col gap-4">
      <div className="dash-chart-header flex flex-wrap justify-between items-center gap-3">
        <div>
          <h3 className="dash-chart-title">User Journey & Path Flows</h3>
          <p className="dash-chart-sub">Visualizing sequential traffic transitions and dropout steps</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="dash-select-wrap">
            <Filter size={12} className="dash-select-icon" />
            <select
              className="dash-select"
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
            >
              <option value="All">All Devices</option>
              {devices.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="dash-select-wrap">
            <GitCommit size={12} className="dash-select-icon" />
            <select
              className="dash-select"
              value={maxSteps}
              onChange={(e) => setMaxSteps(parseInt(e.target.value, 10))}
            >
              <option value={2}>2 Steps</option>
              <option value={3}>3 Steps</option>
              <option value={4}>4 Steps</option>
              <option value={5}>5 Steps</option>
            </select>
          </div>
        </div>
      </div>

      {hasData && layout ? (
        <div style={{ width: "100%", position: "relative" }}>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            width="100%"
            height={height}
            style={{ overflow: "visible" }}
            onMouseLeave={() => {
              setHoveredLink(null);
              setHoveredNode(null);
              setTooltip(null);
            }}
          >
            {/* ── Links ── */}
            <g>
              {layout.links.map((link: any, i: number) => {
                const sourceName = (link.source as FlowNode).name;
                const color = getLinkColor(sourceName);
                const isDimmed =
                  (hoveredLink !== null && hoveredLink !== i) ||
                  (hoveredNode !== null &&
                    (link.source as FlowNode).index !== hoveredNode &&
                    (link.target as FlowNode).index !== hoveredNode);
                const path = linkPathGen(link) || undefined;
                if (!path) return null;
                return (
                  <path
                    key={i}
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeOpacity={isDimmed ? 0.12 : hoveredLink === i ? 0.9 : 0.55}
                    strokeWidth={Math.max(1.5, link.width || 1.5)}
                    style={{ transition: "stroke-opacity 0.15s ease-in-out", cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      setHoveredLink(i);
                      const rect = (e.target as SVGPathElement).ownerSVGElement?.getBoundingClientRect();
                      setTooltip({
                        x: e.clientX - (rect?.left || 0),
                        y: e.clientY - (rect?.top || 0),
                        kind: "link",
                        title: sourceName,
                        sub: (link.target as FlowNode).name,
                        value: link.value,
                        color,
                      });
                    }}
                    onMouseMove={(e) => {
                      const rect = (e.target as SVGPathElement).ownerSVGElement?.getBoundingClientRect();
                      setTooltip((prev) =>
                        prev
                           ? { ...prev, x: e.clientX - (rect?.left || 0), y: e.clientY - (rect?.top || 0) }
                           : prev
                      );
                    }}
                    onMouseLeave={() => {
                      setHoveredLink(null);
                      setTooltip(null);
                    }}
                  />
                );
              })}
            </g>

            {/* ── Nodes ── */}
            <g>
              {layout.nodes.map((node: any, i: number) => {
                const color = getNodeColor(node.name);
                const x0 = node.x0 ?? 0;
                const x1 = node.x1 ?? 0;
                const y0 = node.y0 ?? 0;
                const y1 = node.y1 ?? 0;
                const nodeHeight = Math.max(y1 - y0, 3);
                const isOut = x1 + 130 > width;
                const isDimmed = hoveredNode !== null && hoveredNode !== i;

                const colGap = sankeyColumnGap;
                const maxLabelPx = isOut ? x0 - 14 : Math.max(colGap - 24, 40);
                const charPx = 6.4;
                const maxChars = Math.max(6, Math.floor(maxLabelPx / charPx));
                const label =
                  node.name.length > maxChars
                    ? node.name.slice(0, maxChars - 1) + "\u2026"
                    : node.name;

                return (
                  <g
                    key={i}
                    onMouseEnter={(e) => {
                      setHoveredNode(i);
                      const rect = (e.target as SVGElement).ownerSVGElement?.getBoundingClientRect();
                      setTooltip({
                        x: e.clientX - (rect?.left || 0),
                        y: e.clientY - (rect?.top || 0),
                        kind: "node",
                        title: node.name,
                        value: node.value || 0,
                        color,
                      });
                    }}
                    onMouseMove={(e) => {
                      const rect = (e.target as SVGElement).ownerSVGElement?.getBoundingClientRect();
                      setTooltip((prev) =>
                        prev
                          ? { ...prev, x: e.clientX - (rect?.left || 0), y: e.clientY - (rect?.top || 0) }
                          : prev
                      );
                    }}
                    onMouseLeave={() => {
                      setHoveredNode(null);
                      setTooltip(null);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={x0}
                      y={y0}
                      width={Math.max(x1 - x0, 2)}
                      height={nodeHeight}
                      fill={color}
                      fillOpacity={isDimmed ? 0.35 : 0.9}
                      rx={2.5}
                      ry={2.5}
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth={1}
                      style={{ transition: "fill-opacity 0.15s ease-in-out" }}
                    />
                    <title>{node.name}</title>
                    <text
                      x={isOut ? x0 - 8 : x1 + 8}
                      y={y0 + nodeHeight / 2 - 2}
                      textAnchor={isOut ? "end" : "start"}
                      fontSize={11}
                      fontWeight={600}
                      fill={isDimmed ? "#6b7280" : "#e5e7eb"}
                    >
                      {label}
                    </text>
                    <text
                      x={isOut ? x0 - 8 : x1 + 8}
                      y={y0 + nodeHeight / 2 + 11}
                      textAnchor={isOut ? "end" : "start"}
                      fontSize={9.5}
                      fill={isDimmed ? "#4b5563" : "#9ca3af"}
                    >
                      {node.value} visits
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* ── Tooltip ── */}
          {tooltip && (
            <div
              className="dash-tooltip"
              style={{
                position: "absolute",
                left: Math.min(tooltip.x + 14, width - 200),
                top: Math.max(tooltip.y - 10, 0),
                maxWidth: 280,
                pointerEvents: "none",
                zIndex: 20,
              }}
            >
              <p className="dash-tooltip-label">
                {tooltip.kind === "link" ? "Transition Flow" : "Page Node"}
              </p>
              <div className="text-sm font-semibold mb-1" style={{ color: tooltip.color }}>
                {tooltip.title}
              </div>
              {tooltip.sub && (
                <>
                  <div className="text-xs text-gray-500 mb-1">→ moves to →</div>
                  <div className="text-sm font-semibold mb-2" style={{ color: getNodeColor(tooltip.sub) }}>
                    {tooltip.sub}
                  </div>
                </>
              )}
              <div
                className="flex justify-between items-center border-t border-white/5 pt-2 text-xs"
                style={{ marginTop: 6 }}
              >
                <span className="text-gray-400">{tooltip.kind === "link" ? "Volume:" : "Total Visits:"}</span>
                <strong className="text-white font-bold">
                  {tooltip.value} {tooltip.kind === "link" ? "visitors" : ""}
                </strong>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="dash-empty-state">
          <Info size={32} />
          <p>No user journey paths found to display. Try reloading live data.</p>
        </div>
      )}

      <div className="dash-export-hint mt-2">
        <Info size={14} className="text-gray-400" />
        <span>
          Sankey flow visualizes step-by-step navigation. <strong>Exit (Step N)</strong> indicates where users
          dropped off and ended their session. Low-traffic pages are grouped into <strong>Other pages</strong> per
          step to keep the diagram readable. Hover a node or ribbon to isolate it.
        </span>
      </div>
    </div>
  );
}