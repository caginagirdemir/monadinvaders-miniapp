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
          if (!isEthProviderAvailable) {
            throw new Error("Ethereum provider not available");
          }

          let walletAddress = address;

          try {
            // Bağlı değilse bağlan
            if (!isConnected) {
              const result = await connectAsync({ connector: farcasterFrame() });
              walletAddress = result.accounts?.[0];
              if (!walletAddress) throw new Error("No wallet address found after connect");

              // Chain doğru değilse bağlandıktan sonra değiştir
              if (result.chain.id !== monadTestnet.id) {
                await switchChain({ chainId: monadTestnet.id });
              }
            } else {
              // Bağlı ama chain yanlışsa
              if (chainId !== monadTestnet.id) {
                await switchChain({ chainId: monadTestnet.id });
              }
            }

            // Son durumda client'i al
            const freshClient = await getWalletClient(config, {
              account: walletAddress!,
              chainId: monadTestnet.id,
            });

            if (!freshClient) {
              throw new Error("Wallet client not available");
            }

            // Kontrat çağrısı
            const txHash = await freshClient.writeContract({
              address: CONTRACT_ADDRESS,
              abi: ABI as Abi,
              functionName: "submitScore",
              args: [score],
            });

            return txHash;
          } catch (err: any) {
            console.error("submitScore error:", err);
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
    ]);



  return (
    <></>
  );
}
