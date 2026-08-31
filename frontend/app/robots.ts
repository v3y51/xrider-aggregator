import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
    ],
    sitemap: "https://xrider.com.tr/sitemap.xml",
    host: "https://xrider.com.tr",
  };
}