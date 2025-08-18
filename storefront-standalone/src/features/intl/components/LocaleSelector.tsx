'use client';

import { useCallback } from 'react';

import { type Locale } from '../types';
import { useLocaleSelector } from './../context/LocaleSelectorContext';
import { useLocale } from './../hooks/useLocale';

type Props = {
  locales: Locale[];
};

export function LocaleSelector({ locales }: Props) {
  const currentLocale = useLocale();
  const { handleSelectCountry } = useLocaleSelector();

  const handleLocaleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedCountryCode = event.target.value;
      const selectedLocale = locales.find((locale) => locale.countryCode === selectedCountryCode);
      
      if (selectedLocale) {
        handleSelectCountry(selectedLocale);
      }
    },
    [locales, handleSelectCountry],
  );

  // Don't render if there's only one or no locales
  if (locales.length <= 1) {
    return null;
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <label 
        htmlFor="locale-selector" 
        style={{ 
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#374151'
        }}
      >
      Language:
      </label>
      <select
        id="locale-selector"
        value={currentLocale.countryCode}
        onChange={handleLocaleChange}
        style={{
          padding: '0.5rem',
          borderRadius: '0.375rem',
          border: '1px solid #d1d5db',
          backgroundColor: '#ffffff',
          fontSize: '0.875rem',
          color: '#374151',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '150px'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6';
          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
      >
        {locales.map((locale) => (
          <option 
            key={locale.countryCode} 
            value={locale.countryCode}
          >
            {`${locale.countryName} ${locale.languageCode}-${locale.countryCode}`}
          </option>
        ))}
      </select>
    </div>
  );
}
