import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://instalanding.shop/356a8",
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: "https://instalanding.shop/f1211",
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 2,
        }
    ]
}
