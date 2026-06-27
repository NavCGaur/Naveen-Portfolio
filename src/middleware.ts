import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Regex pattern for all major AI Crawler User-Agents
const AI_BOTS_REGEX = /GPTBot|ChatGPT-User|ClaudeBot|anthropic-ai|Bytespider|CCBot|cohere-ai|Google-Extended|PerplexityBot|bingbot|YouBot|FacebookBot|Applebot-Extended|Amazonbot/i;

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  const response = NextResponse.next();
  
  // Set custom debug header to confirm execution
  response.headers.set('x-middleware-executed', 'true');
  
  const path = request.nextUrl.pathname;
  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '';
  const referrer = request.headers.get('referer') || '';
  
  // Detect Next.js Link prefetching requests and skip logging to prevent traffic pollution
  const isPrefetch = request.headers.get('purpose') === 'prefetch' ||
                     request.headers.get('x-middleware-prefetch') === '1' ||
                     request.headers.get('next-router-prefetch') === '1';
  
  if (!isPrefetch) {
    const visitorType = AI_BOTS_REGEX.test(userAgent) ? 'AI_BOT' : 'HUMAN';
    
    // Log in a specific format that our collector script can easily parse
    console.log(`[TRAFFIC_LOG]:${JSON.stringify({
      type: visitorType,
      path,
      userAgent,
      ip,
      referrer,
      timestamp: Date.now()
    })}`);
  }
  
  return response;
}

// Matcher to exclude static assets and optimize execution
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets with file extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)).*)',
  ],
};
