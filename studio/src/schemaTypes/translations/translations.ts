import { SanityDocument, defineField, defineType } from 'sanity';

import { translationsName } from '.';
import { createBrandField } from '../fields/brandField';

type Translations = {
  _key: string;
  _ref: string;
  _type: string;
};

export const translations = defineType({
  name: 'translations',
  title: 'Translations',
  type: 'document',
  fields: [
    createBrandField(),
    defineField({
      name: 'translations',
      type: 'array',
      of: [
        ...translationsName.map((translation) => ({
          type: 'reference',
          name: translation,
          to: [{ type: translation }],
          options: {
            filter: ({ document }: { document: SanityDocument }) => {
              return {
                filter: 'brand == $brand',
                params: {
                  brand: document.brand,
                },
              };
            },
          },
        })),
      ],
      validation: (Rule) =>
        Rule.custom((translations?: Translations[]) => {
          // Extract all translation ids (_ref) from the translations array
          const translationIds = (translations || []).map((translation) => translation._ref);

          // Use a Set to check for duplicates based on translation id (_ref)
          const uniqueTranslationIds = new Set(translationIds);

          // If the size of the Set is less than the original array, there are duplicates
          if (translationIds.length !== uniqueTranslationIds.size) {
            return 'Translation references must be unique based on translation.id';
          }

          return true; // Validation passed
        }),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Translations',
      };
    },
  },
});
