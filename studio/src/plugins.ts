import { definePlugin, defineType } from 'sanity';
import { Language } from 'sanity-plugin-internationalized-array';

import { config } from './config';

interface BrandFieldPluginArgs {
  brand: string;
}

export const brandFieldPlugin = definePlugin<BrandFieldPluginArgs>(({ brand }) => ({
  name: 'brandFieldPlugin',
  schema: {
    types: [
      defineType({
        type: 'string',
        name: 'brand',
        options: {
          list: [brand],
        },
        readOnly: false,
        hidden: false,
        initialValue: brand,
        validation: (Rule) => Rule.required(),
      }),
    ],
  },
}));

interface LanguageFieldPluginArgs {
  languages: Language[];
}

export const languageFieldPlugin = definePlugin<LanguageFieldPluginArgs>(({ languages }) => ({
  name: 'languageFieldPlugin',
  schema: {
    types: [
      defineType({
        type: 'string',
        name: config.languageFieldName,
        options: {
          list: languages.map((language) => ({
            title: language.title,
            value: language.id,
          })),
          layout: 'radio',
        },
        readOnly: true,
        hidden: (context) => {
          return !!context.value;
        },
        validation: (Rule) =>
          Rule.custom((value) => {
            if (!value) {
              return 'Language is required. Please pick language from Translations select in document header.';
            }

            return true;
          }),
      }),
    ],
  },
}));
