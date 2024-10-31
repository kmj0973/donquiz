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

    deviceSizes: [320, 420, 640, 768, 1024, 1200, 1600, 1920], // 반응형 이미지 사이즈
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // 정적 이미지 사이즈
  },
};

export default nextConfig;
