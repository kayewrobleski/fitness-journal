/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["prisma", "@prisma/client"],
    transpilePackages: ['react-syntax-highlighter', 'swagger-client', 'swagger-ui-react'],
  },
};

module.exports = nextConfig;