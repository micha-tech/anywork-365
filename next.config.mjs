/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      // Firebase Storage (for when you migrate off local disk)
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      // AWS S3 (for when you migrate to S3)
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },
}

export default nextConfig
