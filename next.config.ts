import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    const webhookUrl = process.env.WEBHOOK_URL;
    if (!webhookUrl) {
      return [];
    }
    return [
      {
        source: '/api/webhook',
        destination: webhookUrl,
      },
    ];
  },
};

export default nextConfig;
