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
import { config } from "@/lib/wagmi"; // 🧠 config'in yolunu kontrol et!

export function WalletActions() {
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

  async function sendTransactionHandler() {
    sendTransaction({
      to: "0x7f748f154B6D180D35fA12460C7E4C631e28A9d7",
      value: parseEther("0.0000001"),
    });
  }

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
    } catch (error: any) {
      console.error("submitScore error:", error);
      alert("❌ Submit failed: " + error.message);
    }
  }





  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">sdk.wallet.ethProvider</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        {isConnected ? (
          <div className="flex flex-col space-y-4 justify-start">
            <p className="text-sm text-left">
              Connected to wallet:{" "}
              <span className="bg-white font-mono text-black rounded-md p-[4px]">
                {address}
              </span>
            </p>
            <p className="text-sm text-left">
              Chain Id:{" "}
              <span className="bg-white font-mono text-black rounded-md p-[4px]">
                {chainId}
              </span>
            </p>
            {chainId === monadTestnet.id ? (
              <div className="flex flex-col space-y-2 border border-[#333] p-4 rounded-md">
                <h2 className="text-lg font-semibold text-left">
                  Send Transaction Example
                </h2>
                <button
                  className="bg-white text-black rounded-md p-2 text-sm"
                  onClick={sendTransactionHandler}
                >
                  Send Transaction
                </button>
                <button
                  className="bg-white text-black rounded-md p-2 text-sm"
                  onClick={() => submitScoreHandler(1234)} // test skoru
                >
                  Submit Score: 1234
                </button>
              </div>
            ) : (
              <button
                className="bg-white text-black rounded-md p-2 text-sm"
                onClick={() => switchChain({ chainId: monadTestnet.id })}
              >
                Switch to Monad Testnet
              </button>
            )}

            <button
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : isEthProviderAvailable ? (
          <button
            className="bg-white text-black w-full rounded-md p-2 text-sm"
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
