import { type ReactNode } from "react";

import { PresentationToolProvider } from "../../../../features/content/PresentationToolProvider";
import { LocaleSelector } from "../../../../features/intl/components/LocaleSelector";
import { getLocales } from "../../../../features/intl/server";

type Props = {
  children: ReactNode;
};

export default async function SlugLayout({ children }: Readonly<Props>) {
  const locales = await getLocales();

  return (
    <PresentationToolProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100svh",
          gap: "1rem",
        }}
      >
        <nav
          style={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            padding: "1rem 3rem",
          }}
        >
          <LocaleSelector locales={locales} />
        </nav>
        <main>{children}</main>
      </div>
    </PresentationToolProvider>
  );
}
