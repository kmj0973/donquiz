import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Jost } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { RouteChangeListener } from "@/containers/create/RouterChangeListener";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import ReactQueryProvider from "@/global/reactQuery";
import { SpeedInsights } from "@vercel/speed-insights/next";

const jost = Jost({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "DONQUIZ",
  description: "Make your quiz, Make your point",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} font-jost`}>
        <ReactQueryProvider>
          <Header />
          <Toaster />
          {/* Suspense로 RouteChangeListener 감싸기 */}
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
