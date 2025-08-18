import { revalidatePath } from 'next/cache';
import { type NextRequest } from 'next/server';

import { getServerEnv } from '../../../../lib/env/src/server';

import { createErrorResponse, createSuccessResponse } from '~/features/api/utils';

export function POST(request: NextRequest) {
  if (
    request.headers.get('x-invalidate-cache-secret') !== getServerEnv('REVALIDATE_CACHE_SECRET')
  ) {
    return createErrorResponse({ message: 'You shall not pass', status: 401 });
  }

  console.info('Invalidating all cached data...');

  revalidatePath('/', 'layout');

  console.info('Done.');

  return createSuccessResponse();
}
