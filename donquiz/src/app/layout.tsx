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
    icon: "/image/favicon.ico",
    shortcut: "/image/favicon.ico", // 브라우저 단축 아이콘
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
