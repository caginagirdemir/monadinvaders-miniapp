import { Metadata } from "next";
import App from "@/components/pages/app";
import { APP_URL } from "@/lib/constants";

const frame = {
  version: "next",
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: "Play Game",
    action: {
      type: "launch_frame",
      name: "Monad Invaders",
      url: 'https://governing-guild-il-reed.trycloudflare.com',
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#ffffff",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Monad Farcaster MiniApp Template",
    openGraph: {
      title: "Monad Farcaster MiniApp Template",
      description: "A template for building mini-apps on Farcaster and Monad",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function Home() {
  return <App />;
}
