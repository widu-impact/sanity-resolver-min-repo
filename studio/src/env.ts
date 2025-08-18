import * as v from 'valibot';
import { BaseIssue, BaseSchema } from 'valibot';

const envs = {
  SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
  SANITY_STUDIO_PROJECT_DATASET: process.env.SANITY_STUDIO_PROJECT_DATASET,
  SANITY_STUDIO_HOST_NAME: process.env.SANITY_STUDIO_HOST_NAME,
  SANITY_STUDIO_GROUP: process.env.SANITY_STUDIO_GROUP,
  SANITY_STUDIO_ENV_NAME: process.env.SANITY_STUDIO_ENV_NAME,
};

export const checkEnv = (name: string) => {
  if (!envs[name as keyof typeof envs]) {
    throw new Error(`${name} env has to be defined`);
  }
};

export const getEnv = <TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  schema: TSchema,
  name: string,
) => {
  checkEnv(name);

  return v.parse(schema, envs[name as keyof typeof envs]);
};

checkEnv('SANITY_STUDIO_PROJECT_ID');

const projectDatasetSchema = v.union([v.literal('development'), v.literal('production')]);

export const projectDataset = getEnv(projectDatasetSchema, 'SANITY_STUDIO_PROJECT_DATASET');

const hostNameSchema = v.union([v.literal('brand-1')]);

export const hostName = getEnv(hostNameSchema, 'SANITY_STUDIO_HOST_NAME');

const groupNameSchema = v.literal('brand-1');

export const groupName = getEnv(groupNameSchema, 'SANITY_STUDIO_GROUP');

const envNameSchema = v.union([
  v.literal('production'),
  v.literal('staging'),
  v.literal('development'),
]);

export const envName = getEnv(envNameSchema, 'SANITY_STUDIO_ENV_NAME');
