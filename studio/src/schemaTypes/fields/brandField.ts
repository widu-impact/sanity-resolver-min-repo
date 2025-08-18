import { defineField } from 'sanity';

export function createBrandField() {
  return defineField({
    type: 'brand',
    name: 'brand',
  });
}
