/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for better performance
  output: 'standalone',
  
  // Handle SQLite properly in production
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3']
  },

  // Webpack configuration to handle SQLite binary
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('better-sqlite3');
    }
    return config;
  }
};

module.exports = nextConfig;