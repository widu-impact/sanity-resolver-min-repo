'use client';

import { type ComponentProps, type ReactNode } from 'react';

import { IntlErrorCode, NextIntlClientProvider } from 'next-intl';

type TimeZone = ComponentProps<typeof NextIntlClientProvider>['timeZone'];

type Props = {
  children: ReactNode;
  locale: string; 
  timeZone?: TimeZone;
};

export function IntlProvider({ children, locale, timeZone = 'Europe/Stockholm' }: Props) {
  return (
    <NextIntlClientProvider
      locale={locale}
      timeZone={timeZone}
      messages={null}
      onError={(event) => {
        if (typeof window === 'undefined' && event.code === IntlErrorCode.MISSING_MESSAGE) {
          return;
        }
      }}
    >
      {children}
    </NextIntlClientProvider>
  );
}
