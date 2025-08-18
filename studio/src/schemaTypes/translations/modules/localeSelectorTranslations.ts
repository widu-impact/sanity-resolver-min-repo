import { defineField, defineType } from 'sanity';

import { createBrandField } from '../../fields/brandField';

export const LocaleSelectorTranslationsTypeName = 'LocaleSelectorTranslations';
export const LocaleSelectorTranslationsTitle = 'Locale Selector Translations';

export const LocaleSelectorTranslationsType = defineType({
  name: LocaleSelectorTranslationsTypeName,
  title: LocaleSelectorTranslationsTitle,
  type: 'document',
  fields: [
    createBrandField(),
    defineField({
      name: 'translations',
      title: 'Translations',
      type: 'object',
      fields: [
        defineField({
          name: 'localeSelector',
          title: 'Locale Selector',
          type: 'object',
          fields: [
            defineField({
              name: 'headline',
              title: 'Headline',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'closeDrawer',
              title: 'Close Drawer',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'axCountry',
              title: 'Åland',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'atCountry',
              title: 'Austria',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'beCountry',
              title: 'Belgium',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'bgCountry',
              title: 'Bulgaria',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'hrCountry',
              title: 'Croatia',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'cyCountry',
              title: 'Cyprus',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'czCountry',
              title: 'Czechia',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'dkCountry',
              title: 'Denmark',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'eeCountry',
              title: 'Estonia',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'fiCountry',
              title: 'Finland',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'frCountry',
              title: 'France',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'deCountry',
              title: 'Germany',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'grCountry',
              title: 'Greece',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'huCountry',
              title: 'Hungary',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'ieCountry',
              title: 'Ireland',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'itCountry',
              title: 'Italy',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'lvCountry',
              title: 'Latvia',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'ltCountry',
              title: 'Lithuania',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'luCountry',
              title: 'Luxembourg',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'mtCountry',
              title: 'Malta',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'nlCountry',
              title: 'Netherlands',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'noCountry',
              title: 'Norway',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'plCountry',
              title: 'Poland',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'ptCountry',
              title: 'Portugal',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'roCountry',
              title: 'Romania',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'skCountry',
              title: 'Slovakia',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'siCountry',
              title: 'Slovenia',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'esCountry',
              title: 'Spain',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'seCountry',
              title: 'Sweden',
              type: 'internationalizedArrayString',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: LocaleSelectorTranslationsTitle,
      };
    },
  },
});
