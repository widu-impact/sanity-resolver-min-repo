import { revalidateTag } from 'next/cache';
import { type NextRequest } from 'next/server';

import { getServerEnv } from '../../../../lib/env/src/server';

import { createErrorResponse, createSuccessResponse } from '~/features/api/utils';
import { createFrameTag } from '~/features/content/server';
import { getLocales } from '~/features/intl/server';

export function POST(request: NextRequest) {
  if (
    request.headers.get('x-invalidate-cache-secret') !== getServerEnv('REVALIDATE_CACHE_SECRET')
  ) {
    return createErrorResponse({ message: 'You shall not pass', status: 401 });
  }

  console.info('Invalidating frames...');

  const locales = getLocales();

  locales.forEach((locale) => {
    revalidateTag(createFrameTag(locale.languageCode));
  });

  console.info('Done.');

  return createSuccessResponse();
}
