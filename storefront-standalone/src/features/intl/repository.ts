type Params = {
  languageCode: string;
};

export async function getTranslationMessages({}: Params) {

  const translations = {};

  if (!translations) {
    throw new Error('Translations has to be correctly initialized.');
  }

  return translations;
}
