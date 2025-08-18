import { defineQuery } from 'next-sanity';

export const HOME_PAGE_QUERY = defineQuery(`*[
  _type == "P020HomePage" &&
  language == $language &&
  brand == $brand
]{
  "id":_id,
  "type":_type,
  title
}[0]`);

export const STANDARD_PAGE_QUERY = defineQuery(`*[
    _type == "P060StandardPage" &&
    language == $language &&
    path.current == $path &&
    brand == $brand
  ]{
    "id":_id,
    "type":_type,
    path,
    title
  }[0]`);