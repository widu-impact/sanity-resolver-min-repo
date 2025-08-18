import { defineField, defineType } from 'sanity';

import { createBrandField } from '../fields/brandField';
import { createLanguageField } from '../fields/languageField';

export const P020HomePageTypeName = 'P020HomePage';

export const P020HomePageType = defineType({
  name: P020HomePageTypeName,
  title: 'Home page',
  type: 'document',
  fields: [
    createLanguageField(),
    createBrandField(),
    defineField({
      type: 'string',
      name: 'title',
    })
  ],
  preview: {
    select: {
      language: 'language',
    },
    prepare({ language }) {
      return {
        title: 'Home page',
        subtitle: language,
      };
    },
  },
});
