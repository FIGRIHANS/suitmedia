/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'suitmedia-backend.suitdev.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;

export default nextConfig;