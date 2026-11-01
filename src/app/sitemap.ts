import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/profile";

// Single-page site: the sections are #anchors on the home page, not separate URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
