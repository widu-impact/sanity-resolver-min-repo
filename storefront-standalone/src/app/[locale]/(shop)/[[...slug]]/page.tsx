import { setRequestLocale } from 'next-intl/server';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

import { decodeSlug } from '../../../../lib/utils/decodeSlug';

import { getHomePage, getStandardPage } from '../../../../features/content/server';
import { getLocale } from '../../../../features/intl/server';

type Page = {
  params: {
    locale: string;
    slug?: string[];
  };
};

export const dynamic = 'force-static';

export default async function Page({ params }: Readonly<Page>) {
  setRequestLocale(params.locale);

  const { slug, error: decodeSlugError } = decodeSlug(params.slug);

  if (decodeSlugError !== null) {
    return notFound();
  }

  const { languageCode } = await getLocale();

  let page;

  if (slug === null) {
    page = await getHomePage({
      languageCode,
      enableLivePreview: !!draftMode().isEnabled,
    });
  } else {
    page = await getStandardPage({
      path: slug,
      languageCode,
      enableLivePreview: !!draftMode().isEnabled,
    });
  }

  if (!page) {
    return notFound();
  }

  return <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '10rem',
  }}>
    <h1>{page.title}</h1>
    <p>{`Type: ${page.type}`}</p>
  </div>;
}
