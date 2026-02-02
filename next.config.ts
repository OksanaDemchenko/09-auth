import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ac.goit.global",
        port: "",        // залишаємо порожнім, якщо стандартний
        pathname: "/**"  // дозволяє будь-які шляхи
      },
    ],
  },
};

export default nextConfig;
