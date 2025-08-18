import { parseData } from '../../utils';

import { serverEnvsForStorybookSchema, serverEnvsSchema } from './schemas';
import { type ServerEnvs } from './types';

let parsedServerEnvs: ServerEnvs | undefined;

export function getServerEnv<T extends keyof ServerEnvs>(name: T): ServerEnvs[T] {
  if (!parsedServerEnvs) {
    let tempParsedServerEnvs: ServerEnvs | null = null;

    // eslint-disable-next-line turbo/no-undeclared-env-vars
    if (process.env.STORYBOOK_CONTEXT !== '1') {
      tempParsedServerEnvs = parseData(process.env, serverEnvsSchema);
    } else {
      // We have to handle Storybook envs a bit differently and we also don't want to expose all envs there.
      tempParsedServerEnvs = parseData(
        {
          // We have to define envs explicitly here, because otherwise they will be removed by Storybook build system
          STORE_ID: process.env.STORE_ID,
        },
        serverEnvsForStorybookSchema,
      ) as unknown as ServerEnvs;
    }

    if (!tempParsedServerEnvs) {
      throw new Error('Parsing server envs error.');
    }

    parsedServerEnvs = tempParsedServerEnvs;
  }

  return parsedServerEnvs[name];
}
