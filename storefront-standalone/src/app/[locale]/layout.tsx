import { type Viewport } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../../lib/styles/critical.css";
import "../../lib/styles/variables.css";


import { IntlProvider, LocaleSelectorProvider } from "../../features/intl";
import {
  getLocale,
  intlRoutingConfig,
} from "../../features/intl/server";
import { ReactElement } from "react";


export const viewport: Viewport = {
  colorScheme: "light",
  initialScale: 1,
  width: "device-width",
};

export type RootLayout = {
  children: ReactElement;
  params: { locale: string; slug?: string[] };
};

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayout>) {
  if (!intlRoutingConfig.locales.includes(params.locale)) {
    notFound();
  }

  setRequestLocale(params.locale);

  const { locale } = await getLocale();

  return (
    <html lang={locale}>
      <body>
        <IntlProvider locale={locale}>
          <LocaleSelectorProvider>{children}</LocaleSelectorProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
