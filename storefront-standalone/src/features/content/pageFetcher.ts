import {
  getHomePage as getApiHomePage,
  getStandardPage as getApiStandardPage,
} from '../../lib/sdk/server';

import { getAppConfig } from '~/config';

import { createGenericPageTag, createPageTag, createStandardPageTag } from './utils';

import 'server-only';

export async function getHomePage({
  languageCode,
  enableLivePreview = false,
}: {
  languageCode: string;
  enableLivePreview?: boolean;
}) {
  const appConfig = getAppConfig();

  if (enableLivePreview) {
    return getApiHomePage({
      languageCode,
      enableLivePreview,
    });
  } else {
    return getApiHomePage({
      languageCode,
      clientOptions: {
        signal: AbortSignal.timeout(5000),
        next: {
          revalidate: appConfig.cache.revalidateTime.pages,
          tags: [createGenericPageTag(languageCode), createPageTag('P020HomePage', languageCode)],
        },
      },
    });
  }
}

export async function getStandardPage({
  path,
  languageCode,
  enableLivePreview = false,
}: {
  path: string;
  languageCode: string;
  enableLivePreview?: boolean;
}) {
  const appConfig = getAppConfig();

  if (enableLivePreview) {
    return getApiStandardPage({
      path,
      languageCode,
      enableLivePreview,
    });
  } else {
    return getApiStandardPage({
      path,
      languageCode,
      clientOptions: {
        signal: AbortSignal.timeout(5000),
        next: {
          revalidate: appConfig.cache.revalidateTime.pages,
          tags: [createGenericPageTag(languageCode), createStandardPageTag(languageCode, path)],
        },
      },
    });
  }
}