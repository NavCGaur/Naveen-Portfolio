export interface TrafficDataPoint {
  date: string;
  visits: number;
  pageviews: number;
  uniqueVisitors: number;
}

export interface TopPage {
  path: string;
  pageviews: number;
  avgDuration: number;
  bounceRate: number;
}

export interface ReferrerSource {
  source: string;
  visits: number;
  percentage: number;
}

export interface DeviceStat {
  device: string;
  visits: number;
  percentage: number;
}

export interface BrowserStat {
  browser: string;
  visits: number;
  percentage: number;
}

export interface GeoLocation {
  country: string;
  countryCode: string;
  visits: number;
  percentage: number;
}

export interface CustomEvent {
  id: string;
  name: string;
  count: number;
  page: string;
  lastSeen: string;
  sampleIps?: string[];
}

export interface PageVisit {
  path: string;
  enteredAt: string; // ISO timestamp
  duration?: number; // seconds; undefined = still on page / unknown
}

export interface VisitorSession {
  ip: string;
  country: string;
  countryCode: string;
  city: string;
  isp: string;
  device: string;
  browser: string;
  pages: string[] | PageVisit[];
  duration: number;
  lastActive: string;
}

export function normalizePages(pages: VisitorSession["pages"]): PageVisit[] {
  if (!pages || pages.length === 0) return [];
  if (typeof pages[0] === "string") {
    return (pages as string[]).map((path) => ({ path, enteredAt: "" }));
  }
  return pages as PageVisit[];
}

export interface AnalyticsData {
  site: string;
  timeRange: string;
  overview: {
    totalVisits: number;
    uniqueVisitors: number;
    pageviews: number;
    bounceRate: number;
    avgSessionDuration: number;
    prevTotalVisits: number;
    prevUniqueVisitors: number;
    prevPageviews: number;
    prevBounceRate: number;
    prevAvgSessionDuration: number;
  };
  trafficOverTime: TrafficDataPoint[];
  topPages: TopPage[];
  referrers: ReferrerSource[];
  devices: DeviceStat[];
  browsers: BrowserStat[];
  geolocations: GeoLocation[];
  events: CustomEvent[];
  sessions?: VisitorSession[];
}
