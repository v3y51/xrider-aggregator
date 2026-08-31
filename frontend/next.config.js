/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://xrider-backend.onrender.com";

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "api.xrider.com.tr" },
      { hostname: "cdn.xrider.com.tr" },
      { hostname: "xrider-backend.onrender.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
