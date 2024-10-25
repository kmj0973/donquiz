/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["firebasestorage.googleapis.com"], // 외부 URL 사용 시 허용할 도메인 추가
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96],
  },
};

export default nextConfig;
