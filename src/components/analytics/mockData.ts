import { AnalyticsData } from "./types";

function generateDailyData(days: number) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 45 : 90;
    const visits = Math.floor(base + Math.random() * 60 - 20);
    data.push({
      date: date.toISOString().split("T")[0],
      visits: Math.max(10, visits),
      pageviews: Math.max(15, Math.floor(visits * (1.4 + Math.random() * 0.6))),
      uniqueVisitors: Math.max(8, Math.floor(visits * (0.65 + Math.random() * 0.2))),
    });
  }
  return data;
}

export const mockData: AnalyticsData = {
  site: "naveengaur.com",
  timeRange: "7d",
  overview: {
    totalVisits: 1847,
    uniqueVisitors: 1204,
    pageviews: 3291,
    bounceRate: 42.3,
    avgSessionDuration: 187,
    prevTotalVisits: 1563,
    prevUniqueVisitors: 1018,
    prevPageviews: 2874,
    prevBounceRate: 48.1,
    prevAvgSessionDuration: 164,
  },
  trafficOverTime: generateDailyData(30),
  topPages: [
    { path: "/blog/baileys-whatsapp-bot-developer-guide", pageviews: 843, avgDuration: 312, bounceRate: 34.2 },
    { path: "/", pageviews: 712, avgDuration: 145, bounceRate: 51.4 },
    { path: "/blog/ai-automation-freelancing", pageviews: 498, avgDuration: 267, bounceRate: 38.9 },
    { path: "/free-audit", pageviews: 384, avgDuration: 223, bounceRate: 29.1 },
    { path: "/blog/next-js-seo-guide", pageviews: 301, avgDuration: 198, bounceRate: 44.7 },
    { path: "/contact", pageviews: 187, avgDuration: 89, bounceRate: 62.3 },
    { path: "/blog/whatsapp-crm-integration", pageviews: 166, avgDuration: 245, bounceRate: 36.8 },
  ],
  referrers: [
    { source: "Organic Search", visits: 782, percentage: 42.3 },
    { source: "Direct", visits: 421, percentage: 22.8 },
    { source: "GitHub", visits: 234, percentage: 12.7 },
    { source: "Twitter / X", visits: 183, percentage: 9.9 },
    { source: "LinkedIn", visits: 124, percentage: 6.7 },
    { source: "Reddit", visits: 67, percentage: 3.6 },
    { source: "Other", visits: 36, percentage: 2.0 },
  ],
  devices: [
    { device: "Desktop", visits: 1021, percentage: 55.3 },
    { device: "Mobile", visits: 698, percentage: 37.8 },
    { device: "Tablet", visits: 128, percentage: 6.9 },
  ],
  browsers: [
    { browser: "Chrome", visits: 1102, percentage: 59.7 },
    { browser: "Safari", visits: 412, percentage: 22.3 },
    { browser: "Firefox", visits: 198, percentage: 10.7 },
    { browser: "Edge", visits: 98, percentage: 5.3 },
    { browser: "Other", visits: 37, percentage: 2.0 },
  ],
  geolocations: [
    { country: "India", countryCode: "IN", visits: 623, percentage: 33.7 },
    { country: "United States", countryCode: "US", visits: 482, percentage: 26.1 },
    { country: "United Kingdom", countryCode: "GB", visits: 187, percentage: 10.1 },
    { country: "Germany", countryCode: "DE", visits: 124, percentage: 6.7 },
    { country: "Canada", countryCode: "CA", visits: 98, percentage: 5.3 },
    { country: "Australia", countryCode: "AU", visits: 87, percentage: 4.7 },
    { country: "Singapore", countryCode: "SG", visits: 76, percentage: 4.1 },
    { country: "Other", countryCode: "XX", visits: 170, percentage: 9.3 },
  ],
  events: [
    { id: "e1", name: "audit_form_submit", count: 284, page: "/free-audit", lastSeen: "2 min ago" },
    { id: "e2", name: "cta_book_call_click", count: 198, page: "/", lastSeen: "8 min ago" },
    { id: "e3", name: "blog_read_complete", count: 167, page: "/blog/baileys-whatsapp-bot-developer-guide", lastSeen: "15 min ago" },
    { id: "e4", name: "copy_code_snippet", count: 143, page: "/blog/baileys-whatsapp-bot-developer-guide", lastSeen: "23 min ago" },
    { id: "e5", name: "pricing_view", count: 121, page: "/", lastSeen: "31 min ago" },
    { id: "e6", name: "contact_form_open", count: 89, page: "/contact", lastSeen: "45 min ago" },
    { id: "e7", name: "github_link_click", count: 76, page: "/blog/baileys-whatsapp-bot-developer-guide", lastSeen: "1 hr ago" },
    { id: "e8", name: "audit_result_download", count: 54, page: "/free-audit", lastSeen: "2 hr ago" },
  ],
  sessions: [
    { ip: "106.76.190.*", country: "India", countryCode: "IN", city: "Thrissur", isp: "Idea Cellular Limited", device: "Desktop", browser: "Firefox", pages: ["/", "/blog/baileys-whatsapp-bot-developer-guide", "/free-audit"], duration: 247, lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { ip: "192.168.1.*", country: "United States", countryCode: "US", city: "Dallas", isp: "AT&T Internet", device: "Desktop", browser: "Chrome", pages: ["/", "/blog/baileys-whatsapp-bot-developer-guide", "/free-audit"], duration: 310, lastActive: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { ip: "122.164.22.*", country: "India", countryCode: "IN", city: "Chennai", isp: "Airtel Fiber", device: "Mobile", browser: "Chrome", pages: ["/", "/blog/ai-automation-freelancing"], duration: 94, lastActive: new Date(Date.now() - 1000 * 60 * 18).toISOString() },
    { ip: "73.4.19.*", country: "United States", countryCode: "US", city: "Atlanta", isp: "Comcast", device: "Mobile", browser: "Safari", pages: ["/", "/contact"], duration: 45, lastActive: new Date(Date.now() - 1000 * 60 * 25).toISOString() },
    { ip: "95.111.4.*", country: "Germany", countryCode: "DE", city: "Frankfurt", isp: "Deutsche Telekom", device: "Desktop", browser: "Chrome", pages: ["/blog/next-js-seo-guide", "/free-audit"], duration: 185, lastActive: new Date(Date.now() - 1000 * 60 * 42).toISOString() },
    { ip: "108.162.2.*", country: "United Kingdom", countryCode: "GB", city: "London", isp: "British Telecom", device: "Desktop", browser: "Safari", pages: ["/", "/blog/baileys-whatsapp-bot-developer-guide", "/blog/whatsapp-crm-integration"], duration: 320, lastActive: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
    { ip: "109.112.5.*", country: "Canada", countryCode: "CA", city: "Toronto", isp: "Rogers Communications", device: "Mobile", browser: "Safari", pages: ["/free-audit"], duration: 12, lastActive: new Date(Date.now() - 1000 * 60 * 70).toISOString() },
    { ip: "27.12.98.*", country: "Australia", countryCode: "AU", city: "Sydney", isp: "Telstra", device: "Tablet", browser: "Chrome", pages: ["/", "/blog/ai-automation-freelancing", "/contact"], duration: 140, lastActive: new Date(Date.now() - 1000 * 60 * 95).toISOString() }
  ]
};

export const SITE_OPTIONS = [
  "naveengaur.com",
  "thelaunchpadlabs.com",
  "looplearn.in",
];
