import { defineField } from 'sanity';

import { config } from '../../config';

export function createLanguageField() {
  return defineField({
    type: config.languageFieldName,
    name: config.languageFieldName,
    readOnly: true,
    hidden: true,
  });
}
