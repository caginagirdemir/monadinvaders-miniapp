"use client";

import { SafeAreaContainer } from "@/components/safe-area-container";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import IframeGame from "@/components/IframeGame";
import { WalletActions } from "@/components/Home/WalletActions";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    submitScoreFromIframe?: (score: number) => void;
  }
}

export default function Home() {
  const { context } = useMiniAppContext();
  const [showWalletActions, setShowWalletActions] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log(event.data?.type);

      if (event.data?.type === "SUBMIT_SCORE") {
        console.log("SUBMIT_SCORE");
        setShowWalletActions(true); 

        const score = Number(event.data.score);
        if (
          typeof score === "number" &&
          !Number.isNaN(score) &&
          typeof window.submitScoreFromIframe === "function"
        ) {
          console.log("SUBMIT_SCORE triggered", score);
          window.submitScoreFromIframe(score);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <IframeGame />
      {showWalletActions && <WalletActions />}
    </SafeAreaContainer>
  );
}
