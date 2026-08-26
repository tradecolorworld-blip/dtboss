import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api/'], // Keeps admin panel and backend API routes hidden from Google
        },
        sitemap: 'https://dtboss.sbs/sitemap.xml',
    };
}