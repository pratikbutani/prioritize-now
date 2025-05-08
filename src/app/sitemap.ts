import type { MetadataRoute } from 'next'

// Replace with your actual deployed URL
const URL = 'https://prioritize-now.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: URL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    // Add more static routes here if your application grows
    // e.g., /about, /contact, etc.
  ]
}
