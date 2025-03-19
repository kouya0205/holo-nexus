import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import React from "react";

export const metadata: Metadata = {
  title: siteConfig.deckCreate.title,
  description: siteConfig.deckCreate.description,
  metadataBase: new URL(siteConfig.deckCreate.url),
  openGraph: {
    title: siteConfig.deckCreate.title,
    description: siteConfig.deckCreate.description,
    url: siteConfig.deckCreate.url,
    images: [
      {
        url: `${siteConfig.url}/default-og-image.jpg`,
        width: 800,
        height: 600,
        alt: siteConfig.deckCreate.title,
      },
    ],
    siteName: siteConfig.deckCreate.title,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="h-auto p-0">{children}</main>;
}
