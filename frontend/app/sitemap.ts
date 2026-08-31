import { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://xrider.com.tr";
  const now = new Date("2026-08-31T00:00:00.000Z");

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "hourly", priority: 0.95 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/seller`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  const searchCategories = [
    "kask", "motosiklet-kask-fiyatlari", "shoei-nxr2", "agv-k6s", "ls2-advant-ff906",
    "motosiklet-montu", "dainese-mont", "alpinestars-mont", "revit-mont",
    "motosiklet-eldiveni", "motosiklet-botu", "gore-tex-bot",
    "motosiklet-lastigi", "pirelli-diablo-rosso-4", "michelin-road-6", "metzeler-tourance",
    "yedek-parca", "did-zincir-disli-seti", "ebc-fren-balatasi", "motul-7100-10w40",
    "interkom", "cardo-freecom-4x", "sena-50s", "knmaster-interkom",
    "motosiklet-kilidi", "abus-disk-kilidi", "shad-canta", "givi-canta"
  ].map((cat) => ({
    url: `${base}/search?q=${encodeURIComponent(cat)}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const blogPages = getAllSlugs().map((slug) => ({
    url: `${base}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...searchCategories, ...blogPages];
}