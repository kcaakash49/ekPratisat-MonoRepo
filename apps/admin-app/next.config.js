import baseConfig from '@repo/next-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig,
  reactStrictMode: true, // 👈 example override
  images: {
    domains: ['192.168.1.75', 'localhost'], // add your file server host
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.1.75',
        port: '3001', // optional if not default
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    }
  }
};

export default nextConfig;
