import {
  type FilteredResponseQueryOptions,
  type SanityClient,
  createClient,
  defineLive,
} from 'next-sanity';

import { type BaseIssue, type BaseSchema, type InferOutput } from 'valibot';

import { getEnv } from '../../../env/src';
import { getServerEnv } from '../../../env/src/server';
import { parseData } from '../../../utils';

import { type ClientOptions } from '../types';

let sanityClient: SanityClient | undefined;

function createSanityClient() {
  return createClient({
    projectId: getEnv('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: getEnv('NEXT_PUBLIC_SANITY_PROJECT_DATASET'),
    token: getServerEnv('SANITY_API_TOKEN'),
    perspective: [getServerEnv('SANITY_PERSPECTIVE')],
    stega: {
      studioUrl: getServerEnv('SANITY_STUDIO_URL'),
    },
    apiVersion: '2025-03-03',
    useCdn: false,
  });
}

/** Return cached Sanity client but if it doesn't exist then creates and cache it. */
export function getSanityClient() {
  if (!sanityClient) {
    sanityClient = createSanityClient();
  }

  return sanityClient;
}

export function getSanityLive() {
  const { sanityFetch, SanityLive } = defineLive({
    client: getSanityClient(),
    serverToken: getServerEnv('SANITY_LIVE_API_TOKEN'),
    browserToken: getServerEnv('SANITY_LIVE_API_TOKEN'),
    stega: true,
  });

  return { sanityFetch, SanityLive };
}

type FetchFromSanityBaseOptions<TSchema> = {
  query: string;
  queryParams: { language: string } & Record<string, string | number>;
  schema: TSchema;
  debug?: boolean;
};

type FetchFromSanityWithLive<TSchema> = FetchFromSanityBaseOptions<TSchema> & {
  /**
   * When set to `true` it uses different way of fetching data.
   * Sanity will internally create unique tags for request and listen for them in <SanityLive /> component.
   * If they will detect change in Sanity, they will revalidate tag and update content.
   */
  enableLivePreview?: boolean;
  clientOptions?: never;
};

type FetchFromSanityWithoutLive<TSchema> = FetchFromSanityBaseOptions<TSchema> & {
  enableLivePreview?: never;
  clientOptions?: ClientOptions;
};

export async function fetchFromSanity<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>({
  query,
  queryParams,
  schema,
  debug = false,
  ...restOptions
}: FetchFromSanityWithLive<TSchema> | FetchFromSanityWithoutLive<TSchema>) {
  let data: unknown;
  const queryParamsWithBrand = {
    ...queryParams,
    brand: getEnv('NEXT_PUBLIC_BRAND'),
  };

  if ('enableLivePreview' in restOptions) {
    const { sanityFetch } = getSanityLive();

    data = (
      await sanityFetch({
        query,
        params: queryParamsWithBrand,
      })
    ).data;

    if (debug) {
      console.debug(JSON.stringify(data, undefined, 2));
    }

    if (!data) {
      return null;
    }

    // Type needs to be asserted to InferOutput<TSchema> because
    // stega-encoding is required to be enabled but cannot be parsed by Valibot.
    // With Stega enabled, data rendered in your application looks the same
    // but contains invisible metadata that Sanity's Visual Editing tooling can detect.
    // https://www.sanity.io/docs/stega
    return data as InferOutput<TSchema>;
  } else {
    const options: FilteredResponseQueryOptions = {
      ...restOptions.clientOptions,
      signal: restOptions.clientOptions?.signal ?? undefined,
    };
    const sanityClient = getSanityClient();

    data = await sanityClient.fetch<unknown>(query, queryParamsWithBrand, options);

    if (debug) {
      console.debug(JSON.stringify(data, undefined, 2));
    }

    if (!data) {
      return null;
    }

    const parsedData = parseData(data, schema);

    return parsedData;
  }
}
