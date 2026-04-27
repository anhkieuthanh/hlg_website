/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NEXT_OUTPUT || undefined,
  experimental: {
    typedRoutes: false
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.hoanglonggroup.vn" },
      { protocol: "https", hostname: "hoanglonggroup.vn" }
    ]
  }
};

export default nextConfig;
