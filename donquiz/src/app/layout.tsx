import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Anta } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { RouteChangeListener } from "@/containers/create/RouterChangeListener";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import ReactQueryProvider from "@/global/reactQuery";
import { SpeedInsights } from "@vercel/speed-insights/next";

const anta = Anta({ weight: ["400"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DONQUIZ",
  description: "Make your quiz, Make your point",
  icons: {
    icon: "/image/mobile-icon.png",
    shortcut: "/image/mobile-icon.png", // 브라우저 단축 아이콘
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA 메타 태그 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/image/favicon.ico" />
      </head>
      <body className={anta.className}>
        <ReactQueryProvider>
          <Header />
          <Toaster />
          <Suspense fallback={<div>Loading...</div>}>
            <RouteChangeListener />
          </Suspense>
          {children}
          <Analytics />
          <SpeedInsights />
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
