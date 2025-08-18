'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <pre>Try again in a few minutes</pre>
      <Link href="/">
        Go to homepage
      </Link>
    </div>
  );
}
