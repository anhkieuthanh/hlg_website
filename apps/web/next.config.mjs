/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NEXT_OUTPUT || undefined,
  images: {
    formats: ["image/avif", "image/webp"]
  },
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;
