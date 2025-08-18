import { getLocale as getLocaleBase } from 'next-intl/server';

import { getEnv } from '../../lib/env/src';

import { type intlRoutingConfig } from './config/routing';
import { type Locale } from './types';

export function getUrlForLocale(locale: string) {
  const domainsConfig = getEnv('NEXT_PUBLIC_INTL_DOMAINS');
  const domainConfig = domainsConfig.find((domain) => domain.locales.includes(locale));

  if (!domainConfig) {
    return null;
  }

  const host =
    domainConfig.defaultLocale === locale
      ? domainConfig.domain
      : `${domainConfig.domain}/${locale}`;

  return host.startsWith('localhost') ? `http://${host}` : `https://${host}`;
}

function ensureStartingSlash(path: string): string {
  return path.startsWith('/') ? path : '/' + path;
}

export { getTranslations } from 'next-intl/server';

export function createTranslationMessagesTag() {
  return `translation-messages`;
}

/**
 * `locale` has to be in `xx-xx` format eg. `en-gb` where first part is langauge and second is country.
 */
export function parseLocale(locale: string): Locale {
  const split = locale.split('-');
  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  const countryName = regionNames.of(split[1].toUpperCase());

  if (!countryName) {
    throw new Error(`Cannot determine country name for ${locale}`);
  }

  const url = getUrlForLocale(locale);

  if (!url) {
    throw new Error(`Locale ${locale} needs to have assigned url.`);
  }

  return {
    locale,
    languageCode: split[0],
    countryCode: split[1],
    countryName,
    url,
  };
}

export function generateLocalePaths<T extends { params: { locale: string } }>(
  pages?: Partial<Omit<T['params'], 'locale'>>[],
) {
  return getLocales()
    .map(({ locale }) => {
      if (!pages) {
        return [{ locale }];
      }

      return pages.map((page) => {
        return { locale, ...page };
      });
    })
    .reduce((acc, val) => acc.concat(val), []);
}

/** Returns array of supported locales. */
export function getLocales() {
  return getEnv('NEXT_PUBLIC_INTL_LOCALES').map((locale) => parseLocale(locale));
}

/**
 * Returns current locale (either default or based on cookie).
 * **IMPORTANT! Using this function on statically generated pages, will lead to opt out from this behaviour.**
 */
export async function getLocale() {
  const locale = await getLocaleBase();

  return parseLocale(locale);
}

/** Returns default locale. */
export function getDefaultLocale() {
  return parseLocale(getEnv('NEXT_PUBLIC_INTL_DEFAULT_LOCALE'));
}

/**
 * Retrieves and parses the domain configuration from the environment variable `NEXT_PUBLIC_INTL_DOMAINS`.
 *
 * Each domain configuration is returned with:
 * - `domain`: the domain name as a string
 * - `locales`: an array of parsed locale objects
 * - `defaultLocale`: the parsed default locale object
 *
 * @returns An array of domain configuration objects with parsed locales
 */
export function getDomainsConfigs() {
  const domainsConfigs = getEnv('NEXT_PUBLIC_INTL_DOMAINS');

  return domainsConfigs.map(({ domain, locales, defaultLocale }) => {
    return {
      domain: domain,
      locales: locales.map((locale) => parseLocale(locale)),
      defaultLocale: parseLocale(defaultLocale),
    };
  });
}

/**
 * Returns base path depending on app configuration (with ot without locale prefix).
 * @param intlConfig Has to be provided from outside to not break client side
 * @param locale Has to be in xx-xx format eg. `en-gb`
 */
export function getLocalisedBasePath(intlConfig: typeof intlRoutingConfig, locale: string) {
  if (
    (intlConfig.localePrefix === 'as-needed' && locale === intlConfig.defaultLocale) ||
    intlConfig.localePrefix === 'never'
  ) {
    return '';
  }

  return '/' + locale;
}

/**
 * Checks whether the given pathname starts with a locale prefix in the format "xx-yy".
 *
 * A valid locale prefix must match the pattern: two lowercase or uppercase letters,
 * followed by a hyphen, followed by another two letters (e.g., "en-us", "pl-PL", "sv-se").
 *
 * @param pathname - The URL pathname to check (e.g. "/sv-se/c/slug" or "en-us/about")
 * @returns true if the pathname starts with a locale segment, false otherwise
 */
export function hasLocaleInPathname(pathname: string) {
  const pathParts = pathname.split('/').filter(Boolean);
  const firstPart = pathParts[0];

  return /^[a-z]{2}-[a-z]{2}$/i.test(firstPart);
}

/**
 * Removes a locale prefix from the pathname if present.
 *
 * This function checks whether the first segment of the given pathname
 * is a locale code in the format `xx-XX` (e.g., `sv-se`, `no-no`). If so,
 * it removes that segment and returns the remaining path.
 *
 * @param pathname - A URL pathname string (e.g., `/sv-se/clothes`).
 * @returns The pathname without the locale prefix (e.g., `/clothes`),
 *          or an empty string if the path is just the locale or empty.
 */
export function getPathnameWithoutLocale(pathname: string) {
  const pathParts = pathname.split('/').filter(Boolean);

  const isLangPrefix = hasLocaleInPathname(pathname);
  const remainingPath = isLangPrefix ? pathParts.slice(1) : pathParts;

  const joinedPath = remainingPath.join('/');

  return joinedPath ? `/${joinedPath}` : '';
}

/**
 * Returns the base URL (origin) and optionally a language-prefixed path.
 *
 * This function parses the given URL and checks whether the first segment of the path
 * is a language prefix in the format `xx-XX` (e.g., `sv-se`, `no-no`). If so, it includes
 * this prefix in the returned `fullPath`.
 *
 * @param urlString - A full URL string. It must be passed from outside to ensure it works correctly on the client side.
 * @returns An object containing:
 *  - `origin`: the base origin of the URL (e.g., `https://example.com`)
 *  - `fullPath`: the origin combined with the optional locale prefix (e.g., `https://example.com/sv-se`)
 */
export function getDomainWithOptionalLocale(urlString: string) {
  const url = new URL(urlString);
  const pathParts = url.pathname.split('/').filter(Boolean);

  const firstPart = pathParts[0];
  const hasLangPrefix = /^[a-z]{2}-[a-z]{2}$/i.test(firstPart);

  const basePath = hasLangPrefix ? `/${firstPart}` : '';

  return {
    origin: url.origin,
    host: url.host,
    fullPath: `${url.origin}${basePath}`,
  };
}

export function getDomainDefaultLocale(currentHost: string) {
  const domainsConfig = getEnv('NEXT_PUBLIC_INTL_DOMAINS');
  const domainConfig = domainsConfig.find((domain) => domain.domain === currentHost);

  if (!domainConfig) {
    return null;
  }

  return parseLocale(domainConfig.defaultLocale);
}

/**
 * Checks if the provided locale is one of the default locales defined in the domain configuration.
 *
 * ⚠️ WARNING:
 * This function checks against **all configured domains**, not just the current one.
 * If you're expecting to validate the default locale **only for the current domain**,
 * this function will return true even for locales that belong to other domains.
 *
 * @param locale - The locale string to check (e.g., "en-pl", "sv-se", "no-no")
 * @returns true if the locale is a default locale for any domain, false otherwise
 */
export function isDefaultLocale(locale: string) {
  const domainsConfig = getEnv('NEXT_PUBLIC_INTL_DOMAINS');
  const defaultLocales = domainsConfig.map((el) => el.defaultLocale);

  return defaultLocales.includes(locale);
}

/**
 * Checks if the given string is an external link (i.e., points to a different domain).
 *
 * External links typically start with the "http://" or "https://" protocol.
 * Example of an external link: "https://google.com"
 * Example of an internal link: "/about", "contact", "#section"
 *
 * @param link - A string representing the URL or path (e.g., "/contact" or "https://google.com")
 * @returns true if the link is external, false if it points to a subpage on the same domain
 */
function isExternalLink(link: string): boolean {
  try {
    const url = new URL(link);

    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns a localized path based on the given locale and input path.
 *
 * This function handles localization logic for internal application routing.
 * It behaves as follows:
 *
 * - If the path is an external URL (e.g., "https://example.com"), it returns it unchanged.
 * - If the path already contains a locale prefix (e.g., "/sv-se/about"), it returns it unchanged.
 * - If the given locale is a default locale (as defined in configuration), it returns the path as-is.
 * - Otherwise, it prefixes the cleaned path with the provided locale (e.g., "/sv-se").
 *
 * @param locale - The locale string to apply (e.g., "sv-se", "en-pl").
 * @param path - The original URL path (e.g., "c/slug", "/about", or full URL).
 * @returns A path with the correct locale prefix applied if necessary.
 */
export function getLocalisedPath(locale: string, path: string) {
  if (isExternalLink(path)) {
    return path;
  }

  if (hasLocaleInPathname(path) || isDefaultLocale(locale)) {
    return path;
  }

  const cleanPath = getPathnameWithoutLocale(path);

  return `/${locale}${ensureStartingSlash(cleanPath)}`;
}
