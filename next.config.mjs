/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cloudinaryLoader.ts',

    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],

    deviceSizes: [320, 480, 640, 750, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256, 384],
  },
};

export default nextConfig;
