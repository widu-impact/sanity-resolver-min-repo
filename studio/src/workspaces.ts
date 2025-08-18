import * as v from 'valibot';

import { envName, groupName } from './env';

const _workspacesSchema = v.array(
  v.object({
    name: v.string(),
    title: v.string(),
    dataset: v.optional(v.string()),
    defaultLanguage: v.string(),
    languages: v.array(
      v.object({
        code: v.string(),
        storefrontUrl: v.string(),
      }),
    ),
  }),
);

const savedStorefrontUrls = {
  'hybrid-development-sv': 'http://localhost:3000',
  'hybrid-development-en': 'http://localhost:3001',
  'hybrid-development-no': 'http://localhost:3002',
  'hybrid-development-fi': 'http://localhost:3003',
  'hybrid-development-de': 'http://localhost:3004',
  'single-development-sv': 'http://localhost:3000/sv-se',
  'single-development-no': 'http://localhost:3000/no-no',
  'single-development-en': 'http://localhost:3000',
};

const generateStorefrontUrl = (name: string, env: string, language: string) => {
  return (
    savedStorefrontUrls[`${name}-${env}-${language}` as keyof typeof savedStorefrontUrls] ??
    `https://${name}-storefront-${language}-git-${env}-impact-as.vercel.app`
  );
};

type Workspaces = v.InferOutput<typeof _workspacesSchema>;

export type Workspace = Workspaces[number];

export const getWorkspaces = (): Workspaces => {
  const baseWorkspaces = {
    // Hybrid domain set up
    'brand-1': [
      {
        name: 'hybrid',
        title: 'hybrid',
        defaultLanguage: 'sv',
        languages: [
          {
            code: 'sv',
            storefrontUrl: generateStorefrontUrl('hybrid', envName, 'sv'),
          },
          {
            code: 'no',
            storefrontUrl: generateStorefrontUrl('hybrid', envName, 'no'),
          },
          {
            code: 'en',
            storefrontUrl: generateStorefrontUrl('hybrid', envName, 'en'),
          },
        ],
      },
      // Single domain for all languages
      {
        name: 'single',
        title: 'single',
        defaultLanguage: 'en',
        languages: [
          {
            code: 'sv',
            storefrontUrl: generateStorefrontUrl('single', envName, 'sv'),
          },
          {
            code: 'no',
            storefrontUrl: generateStorefrontUrl('single', envName, 'no'),
          },
          {
            code: 'en',
            storefrontUrl: generateStorefrontUrl('single', envName, 'en'),
          },
        ],
      },
    ],
  };

  return baseWorkspaces[groupName];
};
