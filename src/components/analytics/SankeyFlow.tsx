"use client";

import React, { useState, useMemo } from "react";
import { Sankey, Tooltip, ResponsiveContainer } from "recharts";
import { VisitorSession } from "./types";
import { motion } from "framer-motion";
import { Filter, GitCommit, Info } from "lucide-react";

interface SankeyFlowProps {
  sessions: VisitorSession[];
}

interface SankeyNode {
  name: string;
  depth?: number;
  value?: number;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

// Accent colors matching our dark modern theme
const PALETTE = {
  accent: "#FF007A",
  accent2: "#7B5CF0",
  accent3: "#00C9A7",
  accent4: "#F59E0B",
  blue: "#3B82F6",
  slate: "#6B7280",
  red: "#EF4444"
};

const PAGE_COLORS: Record<string, string> = {
  "/": PALETTE.accent,
  "/blog": PALETTE.accent2,
  "/free-audit": PALETTE.accent3,
  "/hosting-automation": PALETTE.accent4,
  "/whatsapp-automation": PALETTE.blue,
  "/how-it-works": "#14B8A6",
  "/migration": "#EC4899",
  "exit": "#374151"
};

const getPageColor = (name: string) => {
  // strip step prefix (e.g. "1. /" -> "/")
  const path = name.substring(name.indexOf(" ") + 1).trim();
  if (path.toLowerCase().includes("exit")) return PALETTE.slate;
  return PAGE_COLORS[path] || PALETTE.blue;
};

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

const getLinkColor = (name: string) => {
  const path = name.substring(name.indexOf(" ") + 1).trim();
  if (path.toLowerCase().includes("exit")) return "#4B5563"; // slate gray
  return LINK_COLORS[path] || "#9CA3AF";
};

// ─── Custom CustomSankeyNode ───
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomSankeyNode = (props: any) => {
  const { x, y, width, height, index, payload, containerWidth } = props;
  const isOut = x + width + 6 > containerWidth;
  const color = getPageColor(payload.name);

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        fillOpacity={0.85}
        rx={3}
        ry={3}
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1}
      />
      <text
        x={isOut ? x - 8 : x + width + 8}
        y={y + height / 2 + 4}
        textAnchor={isOut ? "end" : "start"}
        fontSize={11}
        fontWeight="600"
        fill="#e5e7eb"
      >
        {payload.name}
      </text>
      <text
        x={isOut ? x - 8 : x + width + 8}
        y={y + height / 2 + 15}
        textAnchor={isOut ? "end" : "start"}
        fontSize={9.5}
        fill="#9ca3af"
      >
        {payload.value} visits
      </text>
    </g>
  );
};

export default function SankeyFlow({ sessions = [] }: SankeyFlowProps) {
  const [maxSteps, setMaxSteps] = useState<number>(4);
  const [deviceFilter, setDeviceFilter] = useState<string>("All");

  // Get unique device list from sessions
  const devices = useMemo(() => {
    const set = new Set<string>();
    sessions.forEach((s) => {
      if (s.device) set.add(s.device);
    });
    return Array.from(set);
  }, [sessions]);

  // 1. Process Sessions to build Sankey nodes & links
  const sankeyData = useMemo(() => {
    if (!sessions || sessions.length === 0) {
      return { nodes: [], links: [] };
    }

    // Filter by device if set
    const filtered = sessions.filter((s) => {
      if (deviceFilter === "All") return true;
      return s.device === deviceFilter;
    });

    const nodesList: string[] = [];
    const linkMap = new Map<string, number>(); // key: "sourceIndex->targetIndex", value: weight

    const addNode = (nodeName: string): number => {
      let idx = nodesList.indexOf(nodeName);
      if (idx === -1) {
        nodesList.push(nodeName);
        idx = nodesList.length - 1;
      }
      return idx;
    };

    filtered.forEach((session) => {
      // session.pages is an array of page paths visited in sequence
      const path = session.pages || [];
      if (path.length === 0) return;

      const stepsCount = Math.min(path.length, maxSteps);

      for (let i = 0; i < stepsCount; i++) {
        const stepNum = i + 1;
        const currentPath = path[i];
        const currentNodeName = `${stepNum}. ${currentPath}`;
        const sourceIdx = addNode(currentNodeName);

        // Check if there is a next step
        if (i < stepsCount - 1 && path[i + 1]) {
          const nextStepNum = stepNum + 1;
          const nextPath = path[i + 1];
          const nextNodeName = `${nextStepNum}. ${nextPath}`;
          const targetIdx = addNode(nextNodeName);

          const key = `${sourceIdx}->${targetIdx}`;
          linkMap.set(key, (linkMap.get(key) || 0) + 1);
        } else {
          // If no next page, flow exits at this step
          const exitNodeName = `Exit (Step ${stepNum})`;
          const targetIdx = addNode(exitNodeName);

          const key = `${sourceIdx}->${targetIdx}`;
          linkMap.set(key, (linkMap.get(key) || 0) + 1);
        }
      }
    });

    // Format for Recharts Sankey
    const nodes = nodesList.map((name) => ({ name }));
    const links: SankeyLink[] = [];

    linkMap.forEach((val, key) => {
      const [sourceStr, targetStr] = key.split("->");
      links.push({
        source: parseInt(sourceStr, 10),
        target: parseInt(targetStr, 10),
        value: val
      });
    });

    // Recharts requires nodes to be non-empty and links to connect valid node indices
    return { nodes, links };
  }, [sessions, maxSteps, deviceFilter]);

  const hasData = sankeyData.nodes.length > 0 && sankeyData.links.length > 0;

  // Custom tooltips
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomSankeyTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0];

    // Check if it's a link tooltip or node tooltip
    if (item.payload.source !== undefined && item.payload.target !== undefined) {
      // Transition link
      const sourceNode = item.payload.source.name;
      const targetNode = item.payload.target.name;
      const val = item.value;
      return (
        <div className="dash-tooltip" style={{ maxWidth: 300 }}>
          <p className="dash-tooltip-label">Transition Flow</p>
          <div className="text-sm font-semibold mb-1" style={{ color: getPageColor(sourceNode) }}>
            {sourceNode}
          </div>
          <div className="text-xs text-gray-500 mb-1">→ moves to →</div>
          <div className="text-sm font-semibold mb-2" style={{ color: getPageColor(targetNode) }}>
            {targetNode}
          </div>
          <div className="flex justify-between items-center border-t border-white/5 pt-2 text-xs">
            <span className="text-gray-400">Volume:</span>
            <strong className="text-white font-bold">{val} visitors</strong>
          </div>
        </div>
      );
    }

    // Otherwise it's a node
    return (
      <div className="dash-tooltip">
        <p className="dash-tooltip-label">Page Node</p>
        <div className="text-sm font-semibold mb-1" style={{ color: getPageColor(item.name) }}>
          {item.name}
        </div>
        <div className="flex justify-between items-center text-xs mt-2">
          <span className="text-gray-400">Total Visits:</span>
          <strong className="text-white font-bold">{item.value}</strong>
        </div>
      </div>
    );
  };

  return (
    <div className="dash-chart-card flex flex-col gap-4">
      <div className="dash-chart-header flex flex-wrap justify-between items-center gap-3">
        <div>
          <h3 className="dash-chart-title">User Journey & Path Flows</h3>
          <p className="dash-chart-sub">Visualizing sequential traffic transitions and dropout steps</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          {/* Device filter */}
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

          {/* Max steps */}
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

      {hasData ? (
        <div style={{ width: "100%", height: 420, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={sankeyData}
              node={<CustomSankeyNode containerWidth={800} />}
              nodePadding={24}
              link={(linkProps: any) => {
                const { sourceX, sourceY, targetX, targetY, sy, ty, width, payload } = linkProps;
                const color = getLinkColor(payload.source.name);
                return (
                  <path
                    d={`
                      M ${sourceX} ${sy}
                      C ${(sourceX + targetX) / 2} ${sy},
                        ${(sourceX + targetX) / 2} ${ty},
                        ${targetX} ${ty}
                    `}
                    fill="none"
                    stroke={color}
                    strokeOpacity={0.55}
                    strokeWidth={typeof width === "number" && !isNaN(width) ? Math.max(2, width) : 2}
                    style={{ transition: "stroke-opacity 0.15s ease-in-out", cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      (e.target as SVGPathElement).setAttribute("stroke-opacity", "0.9");
                    }}
                    onMouseLeave={(e) => {
                      (e.target as SVGPathElement).setAttribute("stroke-opacity", "0.55");
                    }}
                  />
                );
              }}
              margin={{ top: 12, right: 120, bottom: 12, left: 16 }}
            >
              <Tooltip content={<CustomSankeyTooltip />} />
            </Sankey>
          </ResponsiveContainer>
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
          Sankey flow visualizes step-by-step navigation. <strong>Exit (Step N)</strong> indicates where users dropped off and ended their session.
        </span>
      </div>
    </div>
  );
}
