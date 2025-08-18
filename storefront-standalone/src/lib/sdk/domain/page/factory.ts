import {
  type HomePage,
  type RawHomePage,
  type RawStandardPage,
  type StandardPage,
} from './types';

export function createHomePage({
  rawPage,
}: {
  rawPage: RawHomePage;
}): HomePage {
  return {
    type: rawPage.type,
    title: rawPage.title,
  };
}

export function createStandardPage({
  rawPage,
}: {
  rawPage: RawStandardPage;
}): StandardPage {
  return {
    type: rawPage.type,
    title: rawPage.title,
  };
}
