/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/appspecific/com.chrome.devtools.json',
        destination: '/api/well-known-dev-tools',
      },
    ];
  },
};

module.exports = nextConfig;
