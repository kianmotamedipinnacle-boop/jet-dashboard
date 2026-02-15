/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for Railway deployment
  output: 'standalone',
  
  // Optimize for production
  reactStrictMode: true,

  // Handle static file serving
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Disable source maps in production to speed up build
  productionBrowserSourceMaps: false,
  
  // Transpile packages if needed
  transpilePackages: [],
};

module.exports = nextConfig;