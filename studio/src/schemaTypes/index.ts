import { pages, pagesName } from './pages';
import { translationsModules } from './translations';
import { translations } from './translations/translations';

export const schemaTypes = [ ...pages, ...translationsModules, translations];

export { pagesName };
