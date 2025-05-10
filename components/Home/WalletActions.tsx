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

  /*async function submitScoreHandler(score: number) {
    if (!isConnected) {
      alert("Wallet not connected");
      return;
    }

    try {
      if (!walletClient) {
        alert("Wallet client not available");
        return;
      }

      if (chainId !== monadTestnet.id) {
        alert("Please switch to Monad Testnet");
        return;
      }

      const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI as Abi,
        functionName: "submitScore",
        args: [score],
      });

      alert(`✅ Tx sent: ${txHash}`);
    } catch (error: any) {
      console.error("submitScore error:", error);
      alert("❌ Submit failed: " + error.message);
    }
  }*/

useEffect(() => {
  if (typeof window !== "undefined") {
    window.submitScoreFromIframe = async (score: number): Promise<string> => {
      console.log("SUBMIT_SCORE triggered", score);
      
      if (!isEthProviderAvailable) {
        throw new Error("Ethereum provider not available");
      }

      let walletAddress = address;
      let client = walletClient;

      const result = await connectAsync({ connector: farcasterFrame() });
      walletAddress = result.accounts?.[0];
      console.log("Cüzdan bağlandı 2:", walletAddress);
      if (!walletAddress) throw new Error("No wallet address after connect");
      console.log("Current chainId:", chainId);



      /*if (chainId !== monadTestnet.id) {
        console.log("Switching chain...");
        await switchChain({ chainId: monadTestnet.id });

        await new Promise((res) => setTimeout(res, 500)); 
        const reconnected = await connectAsync({ connector: farcasterFrame() });

        walletAddress = reconnected.accounts?.[0];
        if (!walletAddress) throw new Error("Reconnect failed after chain switch");


        console.log("Zincir değişti, tekrar bağlanıldı:", walletAddress);
        console.log("Current chainId:", chainId);

        if (!client) throw new Error("Wallet client not available after reconnect");
      }*/

    await new Promise((res) => setTimeout(res, 500));
    console.log("getWalletClient testing");
       client = await getWalletClient(config, {
          account: walletAddress,
          chainId: monadTestnet.id,
        });

      if (!client) {
        throw new Error("Wallet client not available");
      }

      const txHash = await client.writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: "submitScore",
        args: [score],
      });

      console.log("✅ Transaction sent:", txHash);

      // Adding a delay before the page reload
      setTimeout(() => {
        window.location.reload(); // Triggering reload after a short delay
      }, 3000); // 3 seconds delay to ensure transaction is processed

      return txHash;
    };
  }
}, [
  isConnected,
  connectAsync,
  isEthProviderAvailable,
  chainId,
  switchChain,
  walletClient,
  address,
]);




  return (
    <></>
  );
}
