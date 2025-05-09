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
      if (!isEthProviderAvailable) {
        throw new Error("Ethereum provider not available");
      }

      if (!isConnected) {
        try {
          const result = await connectAsync({ connector: farcasterFrame() });
          if (chainId !== monadTestnet.id) {
            await switchChain({ chainId: monadTestnet.id });

            // chain değişti, client yeniden alınmalı
            walletClient = await getWalletClient(config, {
              account: address!,
              chainId: monadTestnet.id,
            });
          }
        } catch (err) {
          console.error("Wallet connect error:", err);
          throw new Error("Wallet connection failed");
        }
      }

      if (!walletClient) {
        throw new Error("Wallet client not available");
      }

      if (chainId !== monadTestnet.id) {
        await switchChain({ chainId: monadTestnet.id });
      }

      try {
        const txHash = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: ABI as Abi,
          functionName: "submitScore",
          args: [score],
        });
        console.log("TX SENT", txHash);
        return txHash;
      } catch (error: any) {
        console.error("submitScore error:", error);
        throw new Error("Submit failed: " + error.message);
      }
    };
  }
}, [
  isConnected,
  connectAsync,
  isEthProviderAvailable,
  chainId,
  switchChain,
  walletClient,
]);


  return (
    <></>
  );
}
