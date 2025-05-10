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
import Image from "next/image";

interface WalletActionsProps {
  score?: number;
}

export function WalletActions({ score }: WalletActionsProps) {


  useEffect(() => {
    console.log("Gelen score props ile:", score);
  }, [score]);

  const { isEthProviderAvailable } = useMiniAppContext();
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();
  const { connect } = useConnect();
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


 async function submitScoreHandler(score: number) {
    try {
      if (!isConnected) {
        alert("Wallet is not connected.");
        return;
      }

      if (chainId !== monadTestnet.id) {
        alert("Please switch to Monad Testnet");
        return;
      }

      if (!walletClient) {
        alert("Wallet client not available");
        return;
      }

      const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI as Abi,
        functionName: "submitScore",
        args: [score],
      });


      alert(`✅ Tx sent: ${txHash}`);
      window.location.reload();

    } catch (error: any) {
      console.error("submitScore error:", error);
      alert("❌ Submit failed: " + error.message);
    }
  }





return (



  <div className="space-y-4 border border-[#333] rounded-md p-4">
    <div className="flex justify-center items-center">
    <Image
      src="/game/images/game-over.png"
      alt="Game Over"
      priority
    />
  </div>

    <h2 className="text-xl font-bold text-left">Monad Invaders</h2>
    <div className="flex flex-row space-x-4 justify-start items-start">
      {isConnected ? (
        <div className="flex flex-col space-y-4 justify-start">
          <p className="text-sm text-left">
            Connected to wallet:{" "}
            <span className="bg-gray-900 font-mono text-white rounded-md p-[4px]">
              {address}
            </span>
          </p>
          <p className="text-sm text-left">
            Chain Id:{" "}
            <span className="bg-gray-900 font-mono text-white rounded-md p-[4px]">
              {chainId}
            </span>
          </p>
          {chainId === monadTestnet.id ? (
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-left">
                Submit Score
              </h2>
              <button
                className="bg-black text-white rounded-md p-2 text-sm hover:bg-gray-800"
                onClick={() => submitScoreHandler(score!)}
              >
                Submit Score: {score}
              </button>
            </div>
          ) : (
            <button
              className="bg-black text-white rounded-md p-2 text-sm hover:bg-gray-800"
              onClick={() => switchChain({ chainId: monadTestnet.id })}
            >
              Switch to Monad Testnet
            </button>
          )}

          <button
            className="bg-black text-white rounded-md p-2 text-sm hover:bg-gray-800"
            onClick={() => disconnect()}
          >
            Disconnect Wallet
          </button>
        </div>
      ) : isEthProviderAvailable ? (
        <button
          className="bg-black text-white w-full rounded-md p-2 text-sm hover:bg-gray-800"
          onClick={() => connect({ connector: farcasterFrame() })}
        >
          Connect Wallet
        </button>
      ) : (
        <p className="text-sm text-left">
          Wallet connection only via Warpcast
        </p>
      )}
    </div>
  </div>
);
}
