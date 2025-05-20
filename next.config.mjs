/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'export',
  basePath: '/PruebaPagBomberos',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: '/PruebaPagBomberos/',
}

export default nextConfig
