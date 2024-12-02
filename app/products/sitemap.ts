import type { MetadataRoute } from 'next';

// Function to fetch all campaigns
const getCampaigns = async () => {
    try {
        const url = new URL(`${process.env.API_URL}campaign/all`); // Replace with your API endpoint
        const response = await fetch(url.toString(), { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('Failed to fetch campaigns');
        }

        const data = await response.json();
        return data.campaigns; // Ensure API response includes { campaigns: [] }
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return [];
    }
};

// Generate the list of sitemap IDs
export async function generateSitemaps() {
    const campaigns = await getCampaigns();
    const totalCampaigns = campaigns?.length || 0;
    const sitemapsCount = Math.ceil(totalCampaigns / 50000);

    return Array.from({ length: sitemapsCount }, (_, index) => ({ id: index }));
}

// Generate sitemap for a specific batch
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
    const start = id * 50000;
    const end = start + 50000;

    // Fetch all campaigns
    const campaigns = await getCampaigns();
    if (!campaigns || campaigns.length === 0) {
        return [];
    }

    // Get campaigns for the current batch
    const batchCampaigns = campaigns.slice(start, end);

    const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3200';

    // Map campaigns to sitemap format
    return batchCampaigns.map((campaign: { offer_id: string; product_handle: string; updatedAt: string }) => {
        const urlPath = campaign.product_handle
            ? `/products/${encodeURIComponent(campaign.product_handle)}`
            : `/${campaign.offer_id}`;

        return {
            url: `${baseUrl}${urlPath}`,
            lastModified: new Date(campaign.updatedAt).toISOString(),
        };
    });
}