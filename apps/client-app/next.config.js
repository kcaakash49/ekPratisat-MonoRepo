import baseConfig from '@repo/next-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig,
  reactStrictMode: true,
   images: {
    domains: ['192.168.2.249', 'www.ekpratishat.com', "images.unsplash.com",'192.168.0.102'], 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.2.249',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.0.102',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ekpratishat.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
