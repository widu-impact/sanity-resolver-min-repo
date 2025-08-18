import { type SdkModel, pageTypes } from '../../lib/sdk';

export function createGenericPageTag(languageCode: string) {
  return `page-${languageCode}`;
}

export function createPageTag(
  type: Exclude<SdkModel.PageTypesUnion, SdkModel.PageTypes['P060StandardPage']>,
  languageCode: string,
) {
  return `${type}-${languageCode}`;
}

export function createStandardPageTag(languageCode: string, path: string) {
  return `${pageTypes.P060StandardPage}-${languageCode}-${path}`;
}

export function createFrameTag(languageCode: string) {
  return `frame-${languageCode}`;
}
