import * as v from 'valibot';

const stringToNumberSchema = v.pipe(
  v.string(),
  v.transform((input) => Number(input)),
);

export const contextSchema = v.object({
  NEXT_PUBLIC_INTL_LOCALES: v.array(v.string()),
  NEXT_PUBLIC_INTL_DEFAULT_LOCALE: v.string(),
  NEXT_PUBLIC_INTL_DOMAINS: v.array(
    v.object({
      domain: v.string(),
      locales: v.array(v.string()),
      defaultLocale: v.string(),
    }),
  ),
});

export const envsSchema = v.pipe(
  v.object({
    NEXT_PUBLIC_APP_ENV: v.union([
      v.literal('local'),
      v.literal('development'),
      v.literal('staging'),
      v.literal('production'),
    ]),
    NEXT_PUBLIC_BRAND: v.string(),
    NEXT_PUBLIC_CONTEXT_ENV: v.pipe(
      v.string(),
      v.transform((input) => {
        return v.parse(contextSchema, JSON.parse(input));
      }),
    ),
    NEXT_PUBLIC_SANITY_PROJECT_DATASET: v.string(),
    NEXT_PUBLIC_SANITY_PROJECT_ID: v.string(),
  }),
  v.transform((input) => {
    return {
      ...input,
      ...input.NEXT_PUBLIC_CONTEXT_ENV,
    };
  }),
);

export const serverEnvsSchema = v.object({
  REVALIDATE_CACHE_SECRET: v.string(),
  SANITY_API_TOKEN: v.string(),
  SANITY_LIVE_API_TOKEN: v.string(),
  SANITY_PERSPECTIVE: v.string(),
  SANITY_STUDIO_URL: v.pipe(v.string(), v.url()),
  SANITY_PRESENTATION_TOOL_ENABLED: v.optional(
    v.pipe(
      v.union([v.literal('0'), v.literal('1')]),
      v.transform((input) => input === '1'),
    ),
    '0',
  ),
  STORE_ID: stringToNumberSchema,
});

export const serverEnvsForStorybookSchema = v.object({
  STORE_ID: stringToNumberSchema,
});
