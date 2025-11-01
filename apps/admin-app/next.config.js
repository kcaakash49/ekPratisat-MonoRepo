import baseConfig from '@repo/next-config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...baseConfig,
  reactStrictMode: true, // 👈 example override
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    }
  }
};

export default nextConfig;
