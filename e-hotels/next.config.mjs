/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,  // ✅ Ensures Next.js uses the new App Router
    },
    reactStrictMode: true, // ✅ Helps catch issues in development
    swcMinify: true, // ✅ Optimizes for production
};

export default nextConfig;
