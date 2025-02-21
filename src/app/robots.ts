import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/auth/'], 
    },
    sitemap: 'https://kairos-tracker.vercel.app/sitemap.xml',
  }
} 