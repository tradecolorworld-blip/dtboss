import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://dtboss.sbs';

    // Base static pages with explicit types
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/landing`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
        { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
        { url: `${baseUrl}/disclaimer`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
        { url: `${baseUrl}/dmca`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ];

    try {
        const res = await fetch(`${baseUrl}/api/apps`, { next: { revalidate: 3600 } });
        const data = await res.json();

        if (data.success && data.apps) {
            const appPages: MetadataRoute.Sitemap = data.apps.map((app: any) => ({
                url: `${baseUrl}/apk/${app.slug || app._id}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            }));
            return [...staticPages, ...appPages];
        }
    } catch (e) {
        console.error("Sitemap generation error:", e);
    }

    return staticPages;
}