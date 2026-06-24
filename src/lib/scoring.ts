import { DetectionState } from "./github-audits";

export function calculateScore(
  items: { weight: number; state: DetectionState | boolean }[],
  ttfbPenalty: boolean = false
): number {
  let earned = 0;
  let possible = 0;
  for (const item of items) {
    if (item.state === true) {
      earned += item.weight;
      possible += item.weight;
    } else if (item.state === false) {
      possible += item.weight;
    }
  }
  let percentage = possible > 0 ? (earned / possible) * 100 : 0;
  if (ttfbPenalty && percentage > 75) percentage = 75;
  return Math.min(Math.round(percentage / 10), 10);
}

export interface CredibilityScoreInputs {
  hasAboutPage: DetectionState;
  hasTeamPage: DetectionState;
  hasPrivacyPolicy: DetectionState;
  hasTerms: DetectionState;
  hasTestimonials: DetectionState;
  hasReviewSchema: DetectionState;
  hasSocialLinks: DetectionState;
  hasAddress: DetectionState;
  hasPhone: DetectionState;
}

export function computeCredibilityScore(inputs: CredibilityScoreInputs, ttfbHigh: boolean): number {
  return calculateScore([
    { weight: 1, state: inputs.hasAboutPage },
    { weight: 1, state: inputs.hasTeamPage },
    { weight: 1, state: inputs.hasPrivacyPolicy },
    { weight: 0.5, state: inputs.hasTerms },
    { weight: 2, state: inputs.hasTestimonials },
    { weight: 1.5, state: inputs.hasReviewSchema },
    { weight: 1.5, state: inputs.hasSocialLinks },
    { weight: 1, state: inputs.hasAddress },
    { weight: 1.5, state: inputs.hasPhone }
  ], ttfbHigh);
}

export interface LocalSeoScoreInputs {
  hasPhone: DetectionState;
  hasAddress: DetectionState;
  hasLocalSchema: DetectionState;
  hasMapsEmbed: DetectionState;
  hasCityInH1: DetectionState;
  hasServiceArea: DetectionState;
  hasBusinessHours: DetectionState;
}

export function computeLocalSeoScore(inputs: LocalSeoScoreInputs, ttfbHigh: boolean): number {
  return calculateScore([
    { weight: 1.5, state: inputs.hasPhone },
    { weight: 1.5, state: inputs.hasAddress },
    { weight: 2, state: inputs.hasLocalSchema },
    { weight: 1.5, state: inputs.hasMapsEmbed },
    { weight: 1, state: inputs.hasCityInH1 },
    { weight: 1, state: inputs.hasServiceArea },
    { weight: 1.5, state: inputs.hasBusinessHours }
  ], ttfbHigh);
}

export interface OnlineAuthorityScoreInputs {
  hasAboutOrTeam: DetectionState;
  hasTestimonials: DetectionState;
  hasReviewSchema: DetectionState;
  hasSocialLinks: DetectionState;
  hasLegalPages: DetectionState;
  hasGoodSpeedOrCache: DetectionState;
  loadTime: number | undefined;
}

export function computeOnlineAuthorityScore(inputs: OnlineAuthorityScoreInputs, ttfbHigh: boolean): number {
  return calculateScore([
    { weight: 2, state: inputs.hasAboutOrTeam },
    { weight: 2, state: inputs.hasTestimonials },
    { weight: 1.5, state: inputs.hasReviewSchema },
    { weight: 1.5, state: inputs.hasSocialLinks },
    { weight: 1.5, state: inputs.hasLegalPages },
    { weight: 2, state: inputs.hasGoodSpeedOrCache },
    { weight: 1.5, state: inputs.loadTime === undefined ? "unverified" : inputs.loadTime < 3.0 }
  ], ttfbHigh);
}
