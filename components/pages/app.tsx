"use client";

import { SafeAreaContainer } from "@/components/safe-area-container";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import dynamic from "next/dynamic";
import IframeGame from "@/components/IframeGame";
import { WalletActions } from "@/components/Home/WalletActions";
import { useEffect } from "react";



const Demo = dynamic(() => import("@/components/Home"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

declare global {
  interface Window {
    connectFromIframe?: () => void;
  }
}

export default function Home() {
  const { context } = useMiniAppContext();
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      console.log(event.data?.type);
      if (event.data?.type === "CONNECT_WALLET") {
        if (typeof window.connectFromIframe === "function") {
          window.connectFromIframe();
        }
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);


  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
       <IframeGame />
       <WalletActions />
    </SafeAreaContainer>
  );
}
