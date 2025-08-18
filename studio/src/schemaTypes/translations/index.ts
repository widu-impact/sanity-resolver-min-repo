import {
  LocaleSelectorTranslationsType,
  LocaleSelectorTranslationsTypeName,
} from './modules/localeSelectorTranslations';
import {
  NavigationTranslationsType,
  NavigationTranslationsTypeName,
} from './modules/navigationTranslations';

export const translationsName = [
  NavigationTranslationsTypeName,
  LocaleSelectorTranslationsTypeName,
];

export const translationsModules = [NavigationTranslationsType, LocaleSelectorTranslationsType];
