/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverActions: {
  //     allowedOrigins: ["62.72.26.118", "localhost:3000"],
  //     allowedForwardedHosts: ["62.72.26.118", "localhost:3000"],
  //   },
  // },
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
      },
    ],
    unoptimized: true,
  },
};

//module.exports = nextConfig;
export default nextConfig;
