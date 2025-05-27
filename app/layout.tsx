import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FrameProvider } from "@/components/farcaster-provider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Monad Invaders",
  description: "Monad Invaders",
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
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
      <title>Monad Invaders</title>
      <meta name="description" content="Monad Invaders" />

      <meta
        property="fc:frame"
        content='{
          "version": "next",
          "imageUrl": "https://monadinvaders-miniapp.vercel.app/images/feed.png",
          "iconUrl": "https://monadinvaders-miniapp.vercel.app/images/splash.png",
          "name": "Monad Invaders",
          "button": {
            "title": "Play Game",
            "action": {
              "type": "launch_frame",
              "name": "Monad Invaders",
              "url": "https://monadinvaders-miniapp.vercel.app",
              "splashImageUrl": "https://monadinvaders-miniapp.vercel.app/images/splash.png",
              "splashBackgroundColor": "#000000"
            }
         />
      <body className={inter.className}>
        <FrameProvider>{children}</FrameProvider>
      </body>
    </html>
  );
}
