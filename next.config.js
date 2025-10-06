// @ts-nocheck
// next.config.js
const path = require('path');
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(__dirname),
  
  // For development, allow all origins to avoid port issues
  allowedDevOrigins: process.env.NODE_ENV === 'development' 
    ? ['127.0.0.1', 'localhost', '0.0.0.0', 'app.localhost'] // Remove port restrictions in dev
    : ['127.0.0.1', 'localhost', 'app.localhost', '0.0.0.0'],
  
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,

  transpilePackages: ['crypto-js'],

  webpack: (config, { webpack, isServer }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.CUSTOM_VARIABLE': JSON.stringify('value'),
      })
    );

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/', destination: '/ar', permanent: true },
      { source: '/ar/', destination: '/ar', permanent: true },
    ];
  },

  images: {
    unoptimized: process.env.NODE_ENV === 'development', // Important for multi-port dev
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [680, 780, 1040, 1280, 1540, 1650, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [60, 75, 85, 100],
    remotePatterns: [
      { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
      { protocol: 'https', hostname: 'tamkeenstores.com.sa', pathname: '/images/**' },
      { protocol: 'https', hostname: 'partners.tamkeenstores.com.sa', pathname: '/assets/user-images/**' },
      { protocol: 'https', hostname: 'adminpanelapis.tamkeenstores.com.sa', pathname: '/assets/**' },
      { protocol: 'https', hostname: 'cdn-images.tamkeenstores.com.sa', pathname: '/assets/new-media/**' },
      { protocol: 'https', hostname: 'images.tamkeenstores.com.sa', pathname: '/assets/new-media/**' },
      { protocol: 'https', hostname: 'media.tamkeenstores.com.sa', pathname: '/assets/**' },
      { protocol: 'https', hostname: 'media.tamkeenstores.com.sa', pathname: '/specificicons/**' },
      { protocol: 'https', hostname: 'onelink.to', pathname: '/**' },
    ],
  },

  eslint: { ignoreDuringBuilds: true },
  
  ...(process.env.NODE_ENV === 'development' && { turbopack: {} }),
};

module.exports = withBundleAnalyzer(withPWA(nextConfig));