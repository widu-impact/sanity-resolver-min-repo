import { revalidateTag } from 'next/cache';
import { type NextRequest } from 'next/server';

import { SIGNATURE_HEADER_NAME, isValidSignature } from '@sanity/webhook';
import * as v from 'valibot';

import { getServerEnv } from '../../../../lib/env/src/server';
import { pageTypes } from '../../../../lib/sdk';

import { createErrorResponse, createSuccessResponse } from '~/features/api/utils';
// import { createGenericCategoryTag, createGenericProductTag } from '~/features/catalogue/server';
import {
  createFrameTag,
  createGenericPageTag,
  createPageTag,
  createStandardPageTag,
} from '~/features/content/server';
import { createTranslationMessagesTag } from '~/features/intl/server';

const sanityPayloadSchema = v.union([
  v.object({
    _type: v.string(),
    language: v.optional(v.string()),
    path: v.optional(
      v.object({
        current: v.pipe(v.string(), v.nonEmpty()),
        _type: v.literal('slug'),
      }),
    ),
  }),
]);

export async function POST(request: NextRequest) {
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);

  if (!signature) {
    return createErrorResponse({ message: 'Missing signature' });
  }

  const body = await request.text();

  if (!(await isValidSignature(body, signature, getServerEnv('REVALIDATE_CACHE_SECRET')))) {
    return createErrorResponse({ message: 'Invalid signature', status: 401 });
  }

  const rawPayload = JSON.parse(body) as unknown;
  const tags: string[] = [];
  let sanityPayload;
  // const skipRevalidation = false;

  try {
    sanityPayload = await v.parseAsync(sanityPayloadSchema, rawPayload);
  } catch (error) {
    if (error instanceof v.ValiError) {
      console.error(error, error.issues[0]);
    }

    return createErrorResponse({ message: 'Invalid data structure' });
  }

  switch (sanityPayload._type) {
    case 'brands':
      // We use brands only for products so that's why we need to invalidate producs cache
      // tags.push(createGenericProductTag());

      break;
    case 'frame':
      if (!sanityPayload.language) {
        return createErrorResponse({ message: 'Frame needs language property' });
      }

      tags.push(createFrameTag(sanityPayload.language));

      break;

    case pageTypes.P020HomePage:
      if (!sanityPayload.language) {
        return createErrorResponse({ message: 'Pages need language property' });
      }

      tags.push(createPageTag(sanityPayload._type as 'P020HomePage', sanityPayload.language));

      break;

    case pageTypes.P060StandardPage:
      if (!sanityPayload.language) {
        return createErrorResponse({ message: 'P060StandardPage needs language property' });
      }

      if (!sanityPayload.path?.current) {
        return createErrorResponse({ message: 'P060StandardPage needs path property' });
      }

      tags.push(createStandardPageTag(sanityPayload.language, sanityPayload.path.current));

      // TODO Enable when Presentation Tool will be working again
      // We don't invalidate it because standard page is using live content
      // skipRevalidation = true;

      break;
  }

  /// TODO Enable when Presentation Tool will be working again
  // if (skipRevalidation) {
  //   console.info(`Invalidation request skipped for: ${sanityPayload._type}`);

  //   return createSuccessResponse();
  // }

  if (!tags.length) {
    if (sanityPayload._type.endsWith('Module')) {
      if (!sanityPayload.language) {
        return createErrorResponse({
          message: `Module ${sanityPayload._type} needs language property`,
        });
      }

      // We don't have information about which page the module is part of so we need to invalidate all pages
      tags.push(createGenericPageTag(sanityPayload.language));
    } else if (sanityPayload._type.endsWith('Translations')) {
      tags.push(createTranslationMessagesTag());
    }
  }

  if (tags.length) {
    tags.forEach((tag) => {
      revalidateTag(tag);
      console.info('Invalidated cache for tag: ', tag);
    });
  } else {
    console.info(
      'Received Invaldiation request, but cannot construct tag for type: ',
      sanityPayload._type,
    );
  }

  return createSuccessResponse();
}
