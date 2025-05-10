"use client";

import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { parseEther, Abi } from "viem";
import { monadTestnet } from "viem/chains";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
  useWalletClient 
} from "wagmi";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { useEffect } from "react";
import { getWalletClient } from "wagmi/actions";
import { config } from "@/lib/wagmi";

export function WalletActions() {
  const { isEthProviderAvailable } = useMiniAppContext();
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();
  const { connectAsync } = useConnect();
  const { data: walletClient } = useWalletClient();

  const CONTRACT_ADDRESS = "0x859643c0aC12BF9A192BC5c0844B5047F046b9D1";

  const ABI = [
    {
      inputs: [{ internalType: "uint256", name: "_score", type: "uint256" }],
      name: "submitScore",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  async function sendTransactionHandler() {
    sendTransaction({
      to: "0x7f748f154B6D180D35fA12460C7E4C631e28A9d7",
      value: parseEther("0.0000001"),
    });
  }


  useEffect(() => {
    if (typeof window !== "undefined") {
      window.submitScoreFromIframe = async (score: number): Promise<string> => {
        console.log("SUBMIT_SCORE triggered", score);

        if (!isEthProviderAvailable) {
          throw new Error("Ethereum provider not available");
        }

        try {
          // Eğer daha önce cüzdan bağlıysa disconnect
          if (isConnected) {
            console.log("Cüzdan zaten bağlı, disconnect ediliyor...");
            disconnect();
            await new Promise((res) => setTimeout(res, 500)); // disconnect sonrası küçük bekleme
          }

          // Cüzdan bağlanıyor
          const result = await connectAsync({ connector: farcasterFrame() });
          const walletAddress = result.accounts?.[0];
          console.log("Cüzdan bağlandı:", walletAddress);

          if (!walletAddress) throw new Error("Cüzdan adresi alınamadı");

          // Eğer chainId farklıysa zinciri değiştir
          if (chainId !== monadTestnet.id) {
            await switchChain({ chainId: monadTestnet.id });
            await new Promise((res) => setTimeout(res, 1000));
          }

          // Yeni bağlantıdan sonra client al
          console.log("getWalletClient test:");
        const client = await getWalletClient(config, {
          account: walletAddress,
          chainId: monadTestnet.id,
        });

          if (!client) throw new Error("WalletClient alınamadı");

          console.log("İşlem gönderiliyor...");
          const txHash = await client.writeContract({
            address: CONTRACT_ADDRESS,
            abi: ABI as Abi,
            functionName: "submitScore",
            args: [score],
          });

          console.log("✅ İşlem gönderildi:", txHash);

          // Sayfa 3 saniye sonra reload edilsin
          setTimeout(() => {
            window.location.reload();
          }, 3000);

          return txHash;
        } catch (err: any) {
          console.error("submitScoreFromIframe failed:", err);
          throw new Error("Submit failed: " + err.message);
        }
      };
    }
  }, [
    isConnected,
    connectAsync,
    isEthProviderAvailable,
    chainId,
    switchChain,
    address,
    disconnect,
  ]);



  return <></>;
}
