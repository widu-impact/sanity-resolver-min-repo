import { defineEnableDraftMode } from 'next-sanity/draft-mode';

import { getServerEnv } from '../../../../lib/env/src/server';
import { getSanityClient } from '../../../../lib/sdk/server';

const sanityClient = getSanityClient();

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token: getServerEnv('SANITY_LIVE_API_TOKEN') }),
});
