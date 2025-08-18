import { type BaseIssue, type BaseSchema, ValiError, getDotPath, parse } from 'valibot';

export function parseData<TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>(
  data: unknown,
  schema: TSchema,
) {
  try {
    return parse(schema, data);
  } catch (parseError) {
    if (parseError instanceof ValiError) {
      for (const issue of parseError.issues) {
        console.error(getDotPath(issue as BaseIssue<unknown>));
      }
    } else {
      console.error(parseError);
    }
  }

  return null;
}
