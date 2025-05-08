import { SafeAreaContainer } from "@/components/safe-area-container";
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import dynamic from "next/dynamic";

const Demo = dynamic(() => import("@/components/Home"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function Home() {
  const { context } = useMiniAppContext();
  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <img src="https://governing-guild-il-reed.trycloudflare.com/images/wrapcast.png" />
      <a href="https://monadinvaders.xyz">play</a>
    </SafeAreaContainer>
  );
}
