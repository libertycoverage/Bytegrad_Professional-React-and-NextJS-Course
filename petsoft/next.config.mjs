/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bytegrad.com",
      },
      // fix error of not recognizing proper hostname after fixing a one letter issue
      {
        protocol: "https",
        hostname: "bytegred.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
