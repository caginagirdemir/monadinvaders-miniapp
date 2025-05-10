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
  const [scoreToSubmit, setScoreToSubmit] = useState<number | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log(event.data?.type);

      if (event.data?.type === "SUBMIT_SCORE") {
        const score = Number(event.data.score);
        if (
          typeof score === "number" &&
          !Number.isNaN(score)
        ) {
          console.log("SUBMIT_SCORE triggered", score);

          setScoreToSubmit(score); // Score'u state'e al
          setShowWalletActions(true); 
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <IframeGame />
      {showWalletActions && scoreToSubmit !== null && (
        <WalletActions score={scoreToSubmit} />
      )}
    </SafeAreaContainer>
  );
}
