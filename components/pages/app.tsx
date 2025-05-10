"use client";

import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import IframeGame from "@/components/IframeGame";
import { WalletActions } from "@/components/Home/WalletActions";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    submitScoreFromIframe?: (score: number) => void;
  }
}

export default function AppPage() {
  const { isEthProviderAvailable } = useMiniAppContext();
  const [score, setScore] = useState<number>(0);
  const [showWalletActions, setShowWalletActions] = useState(false);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      //console.log("RAW");
      if (event.data?.type === "SUBMIT_SCORE") {
        //console.log("SUBMIT_SCORE");
        const newScore = Number(event.data.score);

        //console.log(newScore);
        if (!Number.isNaN(newScore)) {
          setScore(newScore);
          setShowWalletActions(true);
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div style={{ overflowY: "hidden", height: "100vh" }}>
      {!showWalletActions && <IframeGame />}
      {showWalletActions && isEthProviderAvailable && <WalletActions score={score} />}
    </div>
  );

}
