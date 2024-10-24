import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Jost } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { RouteChangeListener } from "@/containers/create/RouterChangeListener";
import { Suspense } from "react";

const jost = Jost({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jost.variable} font-jost`}>
        <Header />
        <Toaster />
        {/* Suspense로 RouteChangeListener 감싸기 */}
        <Suspense fallback={<div>Loading...</div>}>
          <RouteChangeListener />
        </Suspense>
        {children}
        <Footer />
      </body>
    </html>
  );
}
