'use client';

import { type ReactNode, createContext, useCallback, useContext } from 'react';


import { type Locale } from '../types';
import {  getDomainWithOptionalLocale } from '../utils';

type Props = {
  children: ReactNode;
};

const LocaleSelectorContext = createContext<{
  handleSelectCountry: (locale: Locale) => void;
}>({
  handleSelectCountry: () => undefined,
});

export function LocaleSelectorProvider({ children }: Props) {

  const handleSelectCountry = useCallback((locale: Locale) => {
    try {
      const targetDomain = getDomainWithOptionalLocale(locale.url);
      const currentDomain = getDomainWithOptionalLocale(window.location.href);

      const isSamePath = currentDomain.fullPath === targetDomain.fullPath;

      if (isSamePath) {
        return;
      }

      const redirectUrl = new URL(locale.url);

      location.href = redirectUrl.toString();
    } catch (error) {
      console.error(`Failed to switch language:`, error);
    }
  }, []);


  return (
    <LocaleSelectorContext.Provider
      value={{
        handleSelectCountry,
      }}
    >
      {children}
    </LocaleSelectorContext.Provider>
  );
}

export function useLocaleSelector() {
  return useContext(LocaleSelectorContext);
}
