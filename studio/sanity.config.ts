import { assist } from '@sanity/assist';
import { documentInternationalization } from '@sanity/document-internationalization';
import { visionTool } from '@sanity/vision';
import { SchemaPluginOptions, WorkspaceOptions, defineConfig } from 'sanity';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { media } from 'sanity-plugin-media';
import { structureTool } from 'sanity/structure';

import { config, getSupportedLanguages } from './src/config';
import { envName, projectDataset } from './src/env';
import { brandFieldPlugin, languageFieldPlugin } from './src/plugins';
import { configurePresentationPlugin } from './src/presentation';
import { pagesName, schemaTypes } from './src/schemaTypes';
import { siteStructureResolver } from './src/structure';
import { Workspace } from './src/workspaces';

const configurePlugins = (workspace: Workspace) => [
  documentInternationalization({
    supportedLanguages: getSupportedLanguages(workspace.languages),
    schemaTypes: [...Object.values(pagesName)],
    languageField: config.languageFieldName,
  }),
  internationalizedArray({
    languages: getSupportedLanguages(workspace.languages),
    defaultLanguages: [getSupportedLanguages(workspace.languages)[0].id],
    fieldTypes: ['string'],
  }),
  brandFieldPlugin({ brand: workspace.name }),
  languageFieldPlugin({
    languages: getSupportedLanguages(workspace.languages),
  }),
  structureTool({
    structure: siteStructureResolver(workspace.name),
  }),
  configurePresentationPlugin(workspace),
  visionTool(),
  media({
    creditLine: {
      enabled: false,
    },
    maximumUploadSize: 10000000, // 9.54MB,
  }),
  assist({
    translate: {
      document: {
        languageField: config.languageFieldName,
      },
    },
  }),
];

const configureSchema = (workspace: Workspace): SchemaPluginOptions => {
  return {
    name: workspace.name,
    types: schemaTypes,
    templates: (prev) =>
      prev.filter((template) => ![...Object.values(pagesName)].includes(template.id)),
  };
};

export default defineConfig(
  config.workspaces.map((workspace) => {
    return {
      projectId: process.env.SANITY_STUDIO_PROJECT_ID,
      dataset: workspace.dataset ? workspace.dataset : projectDataset,
      name: `${workspace.name}-${envName}`,
      title: workspace.title,
      subtitle: envName,
      basePath: `/${workspace.name}`,
      plugins: configurePlugins(workspace),
      schema: configureSchema(workspace),
      scheduledPublishing: {
        enabled: true,
        inputDateTimeFormat: 'dd/MM/yyyy h:mm a',
      },
    } as WorkspaceOptions;
  }),
);
