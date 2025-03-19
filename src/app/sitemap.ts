import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://holo-card.vercel.app",
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: "https://holo-card.vercel.app/cardlist",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: "https://holo-card.vercel.app/decklist",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://holo-card.vercel.app/deckcreate",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://holo-card.vercel.app/auth",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.5,
    },
    {
      url: "https://holo-card.vercel.app/profile",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
