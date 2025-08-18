import merge from 'lodash/merge';
import type { Config, TransformedToken } from 'style-dictionary';

import * as utils from './utils';

const sharedCoreConfig = ({ buildPath, theme }: { buildPath: string; theme?: string }): Config => {
  const sourcePaths = ['tokens/core/**/*.tokens.jsonc'];

  if (theme) {
    sourcePaths.push(`tokens/themes/${theme}/core/**/*.tokens.jsonc`);
  }

  return {
    source: sourcePaths,
    platforms: {
      css: {
        transforms: ['name/cti/kebab', 'typography/composite+rest', 'spacing/em'],
        buildPath,
      },
      ts: {
        transforms: ['name/cti/pascal'],
        buildPath,
      },
    },
  };
};

export const getCoreDictionaryConfig = ({
  buildPath,
  theme,
}: {
  buildPath: string;
  theme?: string;
}): Config => {
  return merge(sharedCoreConfig({ buildPath, theme }), {
    platforms: {
      ts: {
        files: [
          // As module. Useful for documentation (storybook stories)
          {
            destination: 'core.dictionary.ts',
            format: 'javascript/dictionary',
            options: { dictionary: 'core' },
          },
        ],
      },
    },
  });
};

// Gets all tokens except for colors
export function getBaseConfig({ buildPath, theme }: { buildPath: string; theme?: string }): Config {
  const defaultPaths = [
    'tokens/{semantic,component}/**/!(background|fill|stroke|text).tokens.jsonc',
  ];

  const themePaths = theme
    ? [`tokens/themes/${theme}/{semantic,component}/**/!(background|fill|stroke|text).tokens.jsonc`]
    : [];

  const includePaths = [...defaultPaths, ...themePaths];

  return merge(sharedCoreConfig({ buildPath, theme }), {
    include: includePaths,
    platforms: {
      css: {
        files: [
          {
            destination: 'base.css',
            format: 'css/variables',
          },
        ],
      },
      ts: {
        files: [
          {
            destination: 'base.ts',
            format: 'javascript/es6',
          },
          {
            destination: 'interfaces/base.d.ts',
            format: 'typescript/typed',
            filter: (t: TransformedToken) => !utils.isSourceFilter(t),
            options: {
              interface: 'IBaseTokens',
            },
          },
        ],
      },
    },
  });
}

// Extend this with dark mode handling if needed
export function getColorConfig({
  buildPath,
  theme,
}: {
  buildPath: string;
  theme?: string;
}): Config {
  const defaultPaths = [`tokens/{semantic,component}/**/color/**/!(*.dark).tokens.jsonc`];

  const themePaths = theme
    ? [`tokens/themes/${theme}/{core,semantic,component}/**/color/**/!(*.dark).tokens.jsonc`]
    : [];

  const includePaths = [...defaultPaths, ...themePaths];

  return merge(sharedCoreConfig({ buildPath, theme }), {
    include: includePaths,
    platforms: {
      css: {
        files: [
          {
            destination: 'colors.css',
            format: 'css/variables/themed',
            options: { theme },
          },
          {
            destination: 'colors.inverse.css',
            format: 'css/variables/inverse',
            options: { theme },
          },
        ],
      },
      ts: {
        files: [
          // As module. Useful for documentation (storybook stories)
          {
            destination: 'color.dictionary.ts',
            format: 'javascript/dictionary',
            options: {
              theme,
              dictionary: 'colors',
            },
          },
          {
            destination: 'colors.ts',
            filter: (t: TransformedToken) => !utils.isSourceFilter(t),
            format: 'typescript/color/background',
          },
          {
            destination: 'interfaces/color.d.ts',
            format: 'typescript/typed',
            filter: (t: TransformedToken) => !utils.isSourceFilter(t),
            options: { interface: 'IColorTokens' },
          },
        ],
      },
    },
  });
}
