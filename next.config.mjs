/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['s3.amazonaws.com'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '', 
                pathname: '**',
            },
        ],
    },
};

export default nextConfig;
