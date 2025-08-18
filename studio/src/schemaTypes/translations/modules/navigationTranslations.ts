import { defineField, defineType } from 'sanity';

import { createBrandField } from '../../fields/brandField';

export const NavigationTranslationsTypeName = 'NavigationTranslations';
export const NavigationTranslationsTitle = 'Navigation Translations';

export const NavigationTranslationsType = defineType({
  name: NavigationTranslationsTypeName,
  title: NavigationTranslationsTitle,
  type: 'document',
  fields: [
    createBrandField(),
    defineField({
      name: 'translations',
      title: 'Translations',
      type: 'object',
      fields: [
        defineField({
          name: 'navigation',
          title: 'Navigation',
          type: 'object',
          fields: [
            defineField({
              name: 'primaryNavigation',
              title: 'Primary Navigation title',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'breadcrumbs',
              title: 'Breadcrumbs title',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'showAll',
              title: '"Show all" link label',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'mobileOpenMenu',
              title: '"Menu" title',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'mobileGoBack',
              title: '"Back" link label',
              type: 'internationalizedArrayString',
            }),
            defineField({
              name: 'mobileCloseNavigation',
              title: '"Close navigation" link label',
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
        title: NavigationTranslationsTitle,
      };
    },
  },
});
