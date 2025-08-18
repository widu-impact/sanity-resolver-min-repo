import { type ReactNode } from 'react';

import { VisualEditing } from 'next-sanity';
import { draftMode } from 'next/headers';

import { getSanityLive } from '../../lib/sdk/server';

type Props = {
  children: ReactNode;
};

export function PresentationToolProvider({ children }: Props) {
  const { SanityLive } = getSanityLive();

  return (
    <>
      {children}
      {!!draftMode().isEnabled && (
        <>
          <SanityLive />
          <VisualEditing />
        </>
      )}
    </>
  );
}
