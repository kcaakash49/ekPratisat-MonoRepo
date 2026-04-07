import baseConfig from '@repo/next-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig,
  reactStrictMode: true,
   images: {
    domains: ['192.168.2.249', 'www.ekpratishat.com'], 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.2.249',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ekpratishat.com',
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
