/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NEXT_OUTPUT || undefined,
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;
