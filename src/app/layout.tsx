import "./globals.css";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import React from "react";

import { Footer } from "@/components/Footer";
import Header from "@/components/Header";
import { siteConfig } from "@/config/site";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
const hanken_grotesk = Hanken_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-hanken-grotesk",
});

export const metadata: Metadata = {
  title: {
    template: "%s | " + siteConfig.title,
    default: siteConfig.title,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description, // Global site description
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: `${siteConfig.url}/default-og-image.jpg`,
        width: 800,
        height: 600,
        alt: siteConfig.title,
      },
    ],
    siteName: siteConfig.title,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  let userProfile: any = null;
  if (user) {
    const { data: profileData } = await supabase.from("users").select("*").eq("id", user.id).single();
    userProfile = profileData;
  }

  return (
    <html lang="ja" className={`${inter.variable} ${hanken_grotesk.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <Header userProfile={userProfile} />
          <main className="h-auto p-0">{children}</main>
          <Footer />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
