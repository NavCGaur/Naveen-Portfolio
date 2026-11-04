export interface LeadScoringSignals {
  hasDefinedScope?: boolean;
  hasBudget?: boolean;
  timelineUnder30Days?: boolean;
  isAgencyRecurring?: boolean;
  isDecisionMaker?: boolean;
  requestsDiscoveryCall?: boolean;
  longTermPotential?: boolean;
}

export interface LeadScoreResult {
  numeric: number;
  label: "hot" | "warm" | "cold";
  reasons: string[];
}

export function computeLeadScore(signals: LeadScoringSignals): LeadScoreResult {
  let score = 0;
  const reasons: string[] = [];

  if (signals.hasDefinedScope) {
    score += 2;
    reasons.push("Defined project scope (+2)");
  }
  if (signals.hasBudget) {
    score += 2;
    reasons.push("Budget mentioned (+2)");
  }
  if (signals.timelineUnder30Days) {
    score += 2;
    reasons.push("Timeline within 30 days (+2)");
  }
  if (signals.isAgencyRecurring) {
    score += 2;
    reasons.push("Agency with recurring work (+2)");
  }
  if (signals.isDecisionMaker) {
    score += 1;
    reasons.push("Decision-maker confirmed (+1)");
  }
  if (signals.requestsDiscoveryCall) {
    score += 2;
    reasons.push("Discovery call requested (+2)");
  }
  if (signals.longTermPotential) {
    score += 2;
    reasons.push("Long-term partnership potential (+2)");
  }

  let label: "hot" | "warm" | "cold" = "cold";
  if (score >= 8) {
    label = "hot";
  } else if (score >= 4) {
    label = "warm";
  }

  return { numeric: score, label, reasons };
}
