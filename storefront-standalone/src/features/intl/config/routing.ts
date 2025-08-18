import {
  type DomainsConfig,
  type LocalePrefixMode,
  type Pathnames,
  defineRouting,
} from 'next-intl/routing';

import { getEnv } from '../../../lib/env/src';

type AppLocales = string[];

export const intlRoutingConfig = defineRouting<
  AppLocales,
  LocalePrefixMode,
  Pathnames<AppLocales>,
  DomainsConfig<AppLocales>
>({
  locales: getEnv('NEXT_PUBLIC_INTL_LOCALES'),
  defaultLocale: getEnv('NEXT_PUBLIC_INTL_DEFAULT_LOCALE'),
  localePrefix: 'as-needed',
  localeDetection: false,
  pathnames: {},
  domains: getEnv('NEXT_PUBLIC_INTL_DOMAINS'),
  alternateLinks: false,
  localeCookie: false,
});
