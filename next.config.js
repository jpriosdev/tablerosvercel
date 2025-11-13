/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
      unoptimized: true
    },
    trailingSlash: true,
    experimental: {
      optimizeCss: true,
    },
    env: {
      CUSTOM_KEY: 'QA_DASHBOARD_2024',
    }
  }
  
  module.exports = nextConfig
  