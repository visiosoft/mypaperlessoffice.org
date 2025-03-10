/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mypaperlessoffice.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig; 