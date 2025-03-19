import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import React from "react";

export const metadata: Metadata = {
  title: siteConfig.deckList.title,
  description: siteConfig.deckList.description,
  metadataBase: new URL(siteConfig.deckList.url),
  openGraph: {
    title: siteConfig.deckList.title,
    description: siteConfig.deckList.description,
    url: siteConfig.deckList.url,
    images: [
      {
        url: `${siteConfig.url}/default-og-image.jpg`,
        width: 800,
        height: 600,
        alt: siteConfig.deckList.title,
      },
    ],
    siteName: siteConfig.deckList.title,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="h-auto p-0">{children}</main>;
}
