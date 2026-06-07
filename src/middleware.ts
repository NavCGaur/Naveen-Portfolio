import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Regex pattern for AI Crawler User-Agents
const AI_BOTS_REGEX = /(GPTBot|ChatGPT-User|ClaudeBot|Claude-User|PerplexityBot|Google-Extended|Gemini|Applebot|Diffbot|Bytespider|YouBot|CCBot)/i;

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';
  
  if (AI_BOTS_REGEX.test(userAgent)) {
    const path = request.nextUrl.pathname;
    const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for') || '';
    const referrer = request.headers.get('referer') || '';
    
    // Log in a specific format that our collector script can easily parse
    console.log(`[AI_BOT_LOG]:${JSON.stringify({
      path,
      userAgent,
      ip,
      referrer,
      timestamp: Date.now()
    })}`);
  }
  
  return NextResponse.next();
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
