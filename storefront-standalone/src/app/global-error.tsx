'use client';

import { useEffect } from 'react';

import Link from 'next/link';

type Props = {
  error: Error & { digest?: string };
};

export default function GlobalError({ error }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div>
          <h1>Something went wrong!</h1>
          <pre>Try again in a few minutes</pre>
          <Link href="/">
            Go to homepage
          </Link>
        </div>
      </body>
    </html>
  );
}
