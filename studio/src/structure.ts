import { StructureBuilder, StructureResolver } from 'sanity/structure';

import { pagesName } from './schemaTypes/pages';

type SiteStructureResolver = (brand: string) => StructureResolver;

const brandDocument = (S: StructureBuilder, type: string, brand: string) => {
  return S.documentList()
    .title(type)
    .schemaType(type)
    .filter('_type == $type && brand == $brand')
    .params({ type, brand });
};

const brandDocumentList = (S: StructureBuilder, type: string, brand: string) => {
  return S.documentTypeListItem(type).child(brandDocument(S, type, brand));
};

export const siteStructureResolver: SiteStructureResolver = (brand) => {
  const structure: StructureResolver = (S) => {
    return S.list()
      .title('Base')
      .items([

        S.listItem()
          .title('Pages')
          .child(
            S.list()
              .title('Pages')
              .items(
                Object.values(pagesName).map((pageName) => brandDocumentList(S, pageName, brand)),
              ),
          ),
      ]);
  };

  return structure;
};
