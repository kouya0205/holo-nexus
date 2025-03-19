import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import React from "react";

export const metadata: Metadata = {
  title: siteConfig.cardList.title, // Global site title
  description: siteConfig.cardList.description, // Global site description
  metadataBase: new URL(siteConfig.cardList.url),
  openGraph: {
    title: siteConfig.cardList.title,
    description: siteConfig.cardList.description,
    url: siteConfig.cardList.url,
    images: [
      {
        url: `${siteConfig.url}/default-og-image.jpg`,
        width: 800,
        height: 600,
        alt: siteConfig.cardList.title,
      },
    ],
    siteName: siteConfig.cardList.title,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="h-auto p-0">{children}</main>;
}
