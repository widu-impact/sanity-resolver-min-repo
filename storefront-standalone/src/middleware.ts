import createIntlMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

import { intlRoutingConfig } from './features/intl/server';

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.*\\.xml|robots.txt|/public/:path).*)',
  ],
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' },
  ],
};

const intlMiddleware = createIntlMiddleware(intlRoutingConfig);

export function middleware(request: NextRequest) {
  return intlMiddleware(request);
}
