import baseConfig from '@repo/next-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig,
  reactStrictMode: true, // 👈 example override
  images: {
    domains: ['192.168.2.249', 'localhost','103.86.57.232'], // add your file server host
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.2.249',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '103.86.57.232',
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
