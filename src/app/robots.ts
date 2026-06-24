import type { MetadataRoute } from "next";

const BASE_URL = "https://terr4.pt";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // não deixar indexar páginas privadas
      disallow: ["/admin", "/account", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}