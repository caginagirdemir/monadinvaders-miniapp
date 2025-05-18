import { Metadata } from "next";
import App from "@/components/pages/app";
import { APP_URL } from "@/lib/constants";

const frame = {
  version: "next",
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: "Play Game 123",
    action: {
      type: "launch_frame",
      name: "Monad Invaders",
      url: 'https://monadinvaders-miniapp.vercel.app',
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
};


export default function Home() {
  return <App />;
}
