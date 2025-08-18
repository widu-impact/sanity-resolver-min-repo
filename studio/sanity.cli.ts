import { defineCliConfig } from 'sanity/cli';

import { envName, hostName, projectDataset } from './src/env';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: projectDataset,
  },
  studioHost: `${hostName}-${envName}`,
  vite: {
    build: {
      target: 'esnext',
    },
  },
  autoUpdates: false,
});
