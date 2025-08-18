import { IntlErrorCode } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';

import { getTranslationMessages } from '../repository';
import { parseLocale } from '../utils';
import { intlRoutingConfig } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !intlRoutingConfig.locales.includes(locale)) {
    locale = intlRoutingConfig.defaultLocale;
  }

  const { languageCode } = parseLocale(locale);

  return {
    locale,
    timeZone: 'Europe/Stockholm',
    messages: await getTranslationMessages({ languageCode }),
    getMessageFallback: ({ namespace, key, error }) => {
      const path = [namespace, key].filter((part) => part != null).join('.');

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return `{${path}}`;
      } else {
        return `Translations error: ${path}`;
      }
    },
    onError: (error) => {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        console.warn(error.message);
      }
    },
  };
});
