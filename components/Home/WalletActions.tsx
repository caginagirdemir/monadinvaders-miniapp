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
  useWalletClient,
} from "wagmi";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { useEffect, useState } from "react";

export function WalletActions() {
  const { isEthProviderAvailable } = useMiniAppContext();
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();
  const { connect } = useConnect();
  const { data: walletClient } = useWalletClient();
  const [showUI, setShowUI] = useState(false);

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

  async function submitScoreHandler(score: number) {
    try {
      if (!walletClient) throw new Error("Wallet client not available");
      if (chainId !== monadTestnet.id) {
        await switchChain({ chainId: monadTestnet.id });
      }

      const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI as Abi,
        functionName: "submitScore",
        args: [score],
      });

      console.log("Transaction sent:", txHash);
    } catch (error: any) {
      console.error("submitScore error:", error);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.submitScoreFromIframe = (score: number) => {
        setShowUI(true);
        if (!isConnected && isEthProviderAvailable) {
          connect({ connector: farcasterFrame() });
        }
        if (isConnected) {
          submitScoreHandler(score);
        }
      };
    }
  }, [isConnected, connect, walletClient, chainId]);

  if (!showUI) return null;

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">sdk.wallet.ethProvider</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        {isConnected ? (
          <div className="flex flex-col space-y-4 justify-start">
            <p className="text-sm text-left">
              Connected to wallet: {" "}
              <span className="bg-white font-mono text-black rounded-md p-[4px]">
                {address}
              </span>
            </p>
            <p className="text-sm text-left">
              Chain Id: {" "}
              <span className="bg-white font-mono text-black rounded-md p-[4px]">
                {chainId}
              </span>
            </p>
            <button
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() => submitScoreHandler(1234)}
            >
              Submit Score
            </button>
            <button
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button
            className="bg-white text-black w-full rounded-md p-2 text-sm"
            onClick={() => connect({ connector: farcasterFrame() })}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}
