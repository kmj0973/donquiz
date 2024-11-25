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
import Head from "next/head";

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
      <Head>
        <title>DONQUIZ</title>
        <meta
          name="google-site-verification"
          content="rp575jxsVB0hY7LJ_bkLafnCserkjgxBFrRTHwwztDE"
        />
        <meta name="description" content="퀴즈를 풀고 포인트를 쌓자!" />
        <meta name="keywords" content="퀴즈, 퀴즈 게임, quiz game" />
        <meta property="og:title" content="DONQUIZ" />
        <meta property="og:description" content="퀴즈를 풀고 포인트를 쌓자!" />
        <meta property="og:url" content="https://donquiz.vercel.app/" />
        {/* PWA 메타 태그 */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/image/favicon.ico" />
      </Head>
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
