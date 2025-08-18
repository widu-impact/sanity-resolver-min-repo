import { Language } from 'sanity-plugin-internationalized-array';

import { getWorkspaces } from './workspaces';

const languagesTitleMap = {
  sv: 'Swedish',
  no: 'Norwegian',
  fi: 'Finnish',
  en: 'English',
  de: 'German',
};

export const getSupportedLanguages = (
  availableLanguages: {
    code: string;
    storefrontUrl: string;
  }[],
): (Language & {
  storefrontUrl: string;
})[] => {
  return availableLanguages.map((lang) => {
    return {
      id: lang.code,
      title: languagesTitleMap[lang.code as keyof typeof languagesTitleMap],
      storefrontUrl: lang.storefrontUrl,
    };
  });
};

const apiVersion = '2025-08-15';

export const config = {
  workspaces: getWorkspaces(),
  languageFieldName: 'language',
  apiVersion,
} as const;
