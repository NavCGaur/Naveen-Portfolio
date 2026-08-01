// ─── New: per-page-visit timing ───
// Backend should emit this shape once per-page timestamps are tracked.
// `duration` is the seconds spent on this specific page before navigating
// away (or session end). It is undefined for the last page in an active /
// abandoned session, since there's no "next event" yet to compute it from.
export interface PageVisit {
  path: string;
  enteredAt: string; // ISO timestamp
  duration?: number; // seconds; undefined = still on page / unknown
}

export interface VisitorSession {
  ip: string;
  country?: string;
  countryCode?: string;
  city?: string;
  isp?: string;
  device: string;
  browser?: string;
  // Backward compatible: old sessions may still send a flat string[] of
  // paths with no timing info. New sessions should send PageVisit[].
  // Components consuming `pages` should normalize via normalizePages().
  pages: string[] | PageVisit[];
  duration: number; // total session duration (kept for summary views)
  lastActive: string;
}

/**
 * Normalizes a session's `pages` field to PageVisit[] regardless of
 * whether the backend sent the legacy string[] shape or the new
 * PageVisit[] shape. Legacy entries get no timing info (enteredAt is
 * approximated as empty, duration stays undefined) so the UI can
 * detect and label them as "timing not available" rather than
 * fabricating numbers.
 */
export function normalizePages(pages: VisitorSession["pages"]): PageVisit[] {
  if (pages.length === 0) return [];
  if (typeof pages[0] === "string") {
    return (pages as string[]).map((path) => ({ path, enteredAt: "" }));
  }
  return pages as PageVisit[];
}
