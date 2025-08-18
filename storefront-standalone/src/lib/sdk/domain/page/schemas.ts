import * as v from 'valibot';

export const rawHomePageSchema = v.object({
  id: v.string(),
  type: v.literal('P020HomePage'),
  title: v.string(),
});

export const rawStandardPageSchema = v.object({
  id: v.string(),
  type: v.literal('P060StandardPage'),
  path: v.object({
    current: v.pipe(v.string(), v.nonEmpty()),
    _type: v.literal('slug'),
  }),
  title: v.string(),
});
