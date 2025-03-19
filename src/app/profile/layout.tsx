import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import React from "react";

export const metadata: Metadata = {
  title: siteConfig.profile.title,
  description: siteConfig.profile.description,
  metadataBase: new URL(siteConfig.profile.url),
  openGraph: {
    title: siteConfig.profile.title,
    description: siteConfig.profile.description,
    url: siteConfig.profile.url,
    images: [
      {
        url: `${siteConfig.url}/default-og-image.jpg`,
        width: 800,
        height: 600,
        alt: siteConfig.profile.title,
      },
    ],
    siteName: siteConfig.profile.title,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="h-auto p-0">{children}</main>;
}
