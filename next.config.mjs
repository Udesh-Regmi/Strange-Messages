/** @type {import('next').NextConfig} */
const nextConfig = {
    
      typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
        domains: ['utfs.io',  'c8r9b7bq24.ufs.sh'  ,'scontent-atl3-1.xx.fbcdn.net','images.unsplash.com'], // Add the required domain here
    unoptimized: false,
  },
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
};


export default nextConfig;
