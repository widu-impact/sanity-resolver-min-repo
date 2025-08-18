import { defineField, defineType } from 'sanity';

import { config } from '../../config';
import { createBrandField } from '../fields/brandField';
import { createLanguageField } from '../fields/languageField';

export const P060StandardPageTypeName = 'P060StandardPage';

const query = `!defined(*[
  _type == "${P060StandardPageTypeName}" &&
  !(_id in [$draftId, $publishedId]) &&
  language == $language &&
  brand == $brand &&
  path.current == $path
][0]._id)`;

export const P060StandardPageType = defineType({
  name: P060StandardPageTypeName,
  title: 'Standard page',
  type: 'document',
  fields: [
    createLanguageField(),
    createBrandField(),
    defineField({
      title: 'Path',
      name: 'path',
      type: 'slug',
      options: {
        isUnique: async (path, context) => {
          const { document, getClient } = context;

          const language = document?.language;
          const brand = document?.brand;

          if (!language || !brand) {
            console.error('Language and brand are required to validate the slug.');

            return false;
          }

          // Prevent users from creating a page with a duplicate slug.
          // However, when validating, we need to exclude the currently edited document.
          // In Sanity, the same document can exist with two IDs simultaneously:
          // the published ID and the draft ID (prefixed with "draft.").
          const currentId = document._id.replace(/^drafts\./, '');
          const params = {
            draftId: `drafts.${currentId}`,
            publishedId: currentId,
            language,
            brand,
            path,
          };

          const client = getClient({ apiVersion: config.apiVersion });
          const isUnique = await client.fetch(query, params, { perspective: 'raw' });

          return isUnique;
        },
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          if (value?.current?.startsWith('/')) {
            return 'The path must not begin with a "/".';
          }

          return true;
        }),
    }),
    defineField({
      type: 'string',
      name: 'title',
    })
  ],
  preview: {
    select: {
      path: 'path',
      language: 'language',
    },
    prepare({ path, language }) {
      return {
        title: path.current,
        subtitle: language,
      };
    },
  },
});
