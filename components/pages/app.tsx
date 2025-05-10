"use client";

import { SafeAreaContainer } from "@/components/safe-area-container";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import dynamic from "next/dynamic";
import IframeGame from "@/components/IframeGame";
import { FarcasterActions } from "@/components/Home/FarcasterActions";
import { User } from "@/components/Home/User";
import { WalletActions } from "@/components/Home/WalletActions";
import { useEffect } from "react";



const Demo = dynamic(() => import("@/components/Home"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

declare global {
  interface Window {
    submitScoreFromIframe?: (score: number) => void;
  }
}


export default function Home() {
  const { context } = useMiniAppContext();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log(event.data?.type);

      if (event.data?.type === "SUBMIT_SCORE") {
        const score = Number(event.data.score);   
        if (typeof window.submitScoreFromIframe === "function") {
          window.submitScoreFromIframe(score);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div style={{ overflowY: "hidden", height: "100vh" }}>
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <IframeGame />
        <WalletActions />
      </SafeAreaContainer>
    </div>
  );
}
