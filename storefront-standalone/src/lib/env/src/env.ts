import { parseData } from '../../utils';

import { envsSchema } from './schemas';
import { type AccessibleEnvs, type Envs } from './types';

const envs = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_CONTEXT_ENV: process.env.NEXT_PUBLIC_CONTEXT_ENV,
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_PROJECT_DATASET: process.env.NEXT_PUBLIC_SANITY_PROJECT_DATASET,
  NEXT_PUBLIC_BRAND: process.env.NEXT_PUBLIC_BRAND,
};

let parsedEnvs: Envs | undefined;

/** Returns public env available on client and server side. */
export function getEnv<T extends keyof AccessibleEnvs>(name: T): AccessibleEnvs[T] {
  if (!parsedEnvs) {
    const tempParsedEnvs = parseData(envs, envsSchema);

    if (!tempParsedEnvs) {
      throw new Error('Parsing envs error.');
    }

    parsedEnvs = tempParsedEnvs;
  }

  return parsedEnvs[name];
}

