/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow images from external sources
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.openstreetmap.org" },
    ],
  },
  // Environment variables accessible in browser
  env: {
    NEXT_PUBLIC_APP_VERSION: "1.0.0-testing",
    NEXT_PUBLIC_TEST_MODE: "true",
  },
};

export default nextConfig;
