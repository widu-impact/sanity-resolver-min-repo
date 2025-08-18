import { fetchFromSanity } from '../../utils/sanity';
import { type ClientOptions } from '../../utils/types';
import {
  createHomePage,
  createStandardPage,
} from './factory';
import {
  HOME_PAGE_QUERY,
  STANDARD_PAGE_QUERY,
} from './queries';
import {
  rawHomePageSchema,
  rawStandardPageSchema,
} from './schemas';

type GenericParams = {
  languageCode: string;
};

type GenericParamsWithClientOptions = GenericParams & {
  clientOptions?: ClientOptions;
  enableLivePreview?: undefined;
};

type GenericParamsWithLive = GenericParams & {
  clientOptions?: undefined;
  enableLivePreview?: boolean;
};

export async function getHomePage({
  languageCode,
  clientOptions = {},
  enableLivePreview,
}: GenericParamsWithClientOptions | GenericParamsWithLive) {
  const baseOptions = {
    query: HOME_PAGE_QUERY,
    queryParams: {
      language: languageCode,
    },
    schema: rawHomePageSchema,
  };

  const rawPage = await fetchFromSanity({
    ...baseOptions,
    ...(enableLivePreview ? { enableLivePreview } : { clientOptions }),
  });

  if (!rawPage) {
    return null;
  }

  return createHomePage({ rawPage });
}

export async function getStandardPage({
  path,
  languageCode,
  clientOptions,
  enableLivePreview,
}: (GenericParamsWithClientOptions | GenericParamsWithLive) & { path: string }) {
  const baseOptions = {
    query: STANDARD_PAGE_QUERY,
    queryParams: {
      path,
      language: languageCode,
    },
    schema: rawStandardPageSchema,
  };

  const rawPage = await fetchFromSanity({
    ...baseOptions,
    ...(enableLivePreview ? { enableLivePreview } : { clientOptions }),
  });

  if (!rawPage) {
    return null;
  }

  return createStandardPage({ rawPage });
}