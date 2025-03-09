/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/api/:path*",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            },
            {
                // Apply caching headers to static assets
                source: '/:path*.(jpg|jpeg|png|gif|webp|svg|ico|ttf|woff|woff2)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    }
                ],
            },
            {
                // Apply caching headers to CSS and JS
                source: '/:path*.{css,js}',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    }
                ],
            }
        ]
    },
    images: {
        // Remove domains in favor of more specific remotePatterns
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's3.amazonaws.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: '**.cloudinary.com',
                pathname: '**',
            },
            // Generic pattern for other image sources
            {
                protocol: 'https',
                hostname: '**',
                pathname: '**',
            },
        ],
        // Optimize image delivery
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 86400, // Cache optimized images for 24 hours (in seconds)
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    // Enable Gzip compression
    compress: true,
    // Optimize production build
    swcMinify: true,
    // Only generate necessary JavaScript for each page
    reactStrictMode: true,
    // Reduce bundle size by stripping comments
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },
    // Improve performance by using persistent caching
    experimental: {
        optimizeCss: true, // Optimize CSS files
        optimizeServerReact: true, // Optimize Server Components
    },
};

export default nextConfig;
