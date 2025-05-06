import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa'; // Import next-pwa

const withPWA = withPWAInit({
  dest: 'public', // Destination directory for service worker and manifest
  register: true, // Register the service worker
  skipWaiting: true, // Skip waiting for service worker activation
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig); // Wrap the config with withPWA
