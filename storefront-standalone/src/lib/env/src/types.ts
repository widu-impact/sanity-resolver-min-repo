import { type InferOutput } from 'valibot';

import { type envsSchema, type serverEnvsSchema } from './schemas';

export type Envs = InferOutput<typeof envsSchema>;

export type AccessibleEnvs = Omit<Envs, 'NEXT_PUBLIC_CONTEXT_ENVS'>;

export type ServerEnvs = InferOutput<typeof serverEnvsSchema>;
