import { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://xrider.com.tr";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/seller`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categories = [
    "naked-motor", "scooter", "enduro-motor", "sport-motor",
    "kask", "eldiven", "motor-bot", "motor-aksesuar",
  ].map((cat) => ({
    url: `${base}/search?q=${cat}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const blogPages = getAllSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...categories, ...blogPages];
}