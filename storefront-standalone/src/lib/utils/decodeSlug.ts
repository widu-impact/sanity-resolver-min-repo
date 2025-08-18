type DecodeSlugSuccess = {
  slug: string | null;
  error: null;
};

type DecodeSlugError = {
  slug: null;
  error: Error;
};

type DecodeSlugResult = DecodeSlugSuccess | DecodeSlugError;

export function decodeSlug(slug?: string | string[]): DecodeSlugResult {
  if (!slug) {
    return {
      slug: null,
      error: null,
    };
  }

  try {
    const joinedSlug = Array.isArray(slug) ? slug.join('/') : slug;

    return {
      slug: decodeURI(joinedSlug),
      error: null,
    };
  } catch (error) {
    if (error instanceof URIError) {
      console.error('Failed to decode slug:', slug, error.message);

      return { slug: null, error: error };
    } else {
      console.error('Unexpected error while decoding slug:', slug, error);

      return {
        slug: null,
        error: new Error('Unexpected error while decoding slug.', { cause: error }),
      };
    }
  }
}
