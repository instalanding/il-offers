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
            }
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '', 
                pathname: '**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 86400, // 24 hours
        deviceSizes: [480, 768, 1024, 1280, 1536], // Customize device sizes
        imageSizes: [16, 32, 48, 64, 96, 128, 256], // Customize image sizes
    },
    experimental: {
        optimizeCss: true,
        // optimizeServerReact: true
    },
    // Explicitly set the server runtime
    serverRuntimeConfig: {
        // Will only be available on the server side
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
    }
};

export default nextConfig;
