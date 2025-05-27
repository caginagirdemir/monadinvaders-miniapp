import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FrameProvider } from "@/components/farcaster-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Monad Farcaster MiniApp Template",
  description: "A template for building mini-apps on Farcaster and Monad",
  other: {
    "fc:frame": JSON.stringify({
      version: "1",
      imageUrl: "https://monadinvaders-miniapp.vercel.app/images/feed.png",
      iconUrl: "https://monadinvaders-miniapp.vercel.app/images/splash.png",
      name: "Monad Invaders",
      button: {
        title: "Play Game",
        action: {
          type: "launch_frame",
          name: "Monad Invaders",
          url: "https://monadinvaders-miniapp.vercel.app",
          splashImageUrl: "https://monadinvaders-miniapp.vercel.app/images/splash.png",
          splashBackgroundColor: "#000000"
        }
      }
    })
  }
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FrameProvider>{children}</FrameProvider>
      </body>
    </html>
  );
}
