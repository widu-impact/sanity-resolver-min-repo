import { defineLocations, presentationTool } from 'sanity/presentation';
import { defineDocuments } from 'sanity/presentation';

import { PresentationToolNavigator } from './components/PresentationToolNavigator';
import { pagesName } from './schemaTypes';
import { Workspace, findWorkspaceLanguageByOrigin } from './workspaces';

// Used in the previewUrl.previewMode function and the resolve functions
let currentOrigin: string | undefined;

export function configurePresentationPlugin(workspace: Workspace) {
  if (!workspace || workspace.languages.length === 0) {
    throw new Error('Workspace is not defined');
  }

  return presentationTool({
    title: `Presentation`,
    name: `presentation`,
    resolve: {
      mainDocuments: defineDocuments([
        {
          route: '/:locale/:slug',
          resolve: ({ params }) => {
            let locale: Intl.Locale | null;

            try {
              locale = new Intl.Locale(params.locale);
            } catch {
              locale = null;
            }

            if (!locale) {
              return;
            }

            return {
              filter: `_type == '${pagesName.P060StandardPage}' && brand == '${workspace.name}' && path.current == $slug && language == $locale`,
              params: {
                locale: locale.language,
                slug: params.slug,
              },
            };
          },
        },
        {
          route: '/:localeOrSlug',
          resolve: ({ params, origin }) => {
            // Cannot indentify what the locale is becase origin is always undefined
            console.info('/:localeOrSlug - resolved origin', origin);

            let locale: Intl.Locale | null;

            try {
              locale = new Intl.Locale(params.localeOrSlug);
            } catch {
              locale = null;
            }

            if (
              locale &&
              workspace.languages.some((language) => language.code === locale.language)
            ) {
              return {
                filter: `_type == '${pagesName.P020HomePage}' && brand == '${workspace.name}' && language == $localeOrSlug`,
                params: {
                  localeOrSlug: locale.language,
                },
              };
            }

            // Workaround allowing us to determine the language
            // currentOrigin is set in the previewUrl.previewMode function
            const workspaceLanguage = findWorkspaceLanguageByOrigin(workspace, currentOrigin);

            if (!workspaceLanguage) {
              return undefined;
            }

            return {
              filter: `_type == '${pagesName.P060StandardPage}' && brand == '${workspace.name}' && path.current == $localeOrSlug && language == '${workspaceLanguage.code}'`,
              params: {
                localeOrSlug: params.localeOrSlug,
              },
            };
          },
        },
        {
          route: '/',
          resolve: () => {
            // Workaround allowing us to determine the language
            // currentOrigin is set in the previewUrl.previewMode function
            const workspaceLanguage = findWorkspaceLanguageByOrigin(workspace, currentOrigin);

            if (!workspaceLanguage) {
              return undefined;
            }

            return {
              filter: `_type == '${pagesName.P020HomePage}' && brand == '${workspace.name}' && language == '${workspaceLanguage.code}'`,
            };
          },
        },
      ]),
      locations: {
        [pagesName.P060StandardPage]: defineLocations({
          select: {
            path: 'path.current',
            language: 'language',
            brand: 'brand',
          },
          resolve: (document) => {
            if (!(document?.path && document.brand === workspace.name && document.language)) {
              return;
            }

            const storefrontUrl = workspace.languages.find(
              (language) => language.code === document.language,
            )?.storefrontUrl;

            if (!storefrontUrl) {
              return;
            }

            return {
              locations: [
                {
                  title: `Standard page - ${document.path}`,
                  href: `${storefrontUrl}/${document.path}`,
                },
              ],
            };
          },
        }),
        [pagesName.P020HomePage]: defineLocations({
          select: { language: 'language', brand: 'brand' },
          resolve: (document) => {
            if (!(document?.language && document.brand === workspace.name)) {
              return;
            }

            const storefrontUrl = workspace.languages.find(
              (language) => language.code === document.language,
            )?.storefrontUrl;

            if (!storefrontUrl) {
              return;
            }

            return {
              locations: [
                {
                  title: 'Home page',
                  href: storefrontUrl,
                },
              ],
            };
          },
        }),
      },
    },
    allowOrigins: workspace.languages.map((lang) => lang.storefrontUrl),
    previewUrl: {
      initial: workspace.languages[0].storefrontUrl,
      previewMode: async (options) => {
        currentOrigin = options.targetOrigin;

        return {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        };
      },
    },
    components: {
      unstable_navigator: {
        minWidth: 150,
        maxWidth: 150,
        component: () => PresentationToolNavigator({ sites: workspace.languages }),
      },
    },
  });
}
