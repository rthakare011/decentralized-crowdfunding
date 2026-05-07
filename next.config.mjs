/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Helps catch errors in development
  output: "standalone", // Ensures correct build output
  experimental: {
    appDir: true, // If you're using the app directory
  },
};

export default nextConfig;
