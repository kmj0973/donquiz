import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  dest: "public", // service worker와 manifest.json이 생성될 위치 설정
  disable: process.env.NODE_ENV === "development", // 개발 환경에서는 PWA 비활성화
  register: true,
  skipWaiting: true,
  buildExcludes: [/middleware-manifest\.json$/], // 일부 캐시 제외
})({
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
    domains: ["firebasestorage.googleapis.com"], // Firebase Storage 허용
  },
});

export default nextConfig;
