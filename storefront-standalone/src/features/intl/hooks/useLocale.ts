import { useLocale as useLocaleBase } from 'next-intl';

import { parseLocale } from '../utils';

export function useLocale() {
  const locale = useLocaleBase();

  return parseLocale(locale);
}
