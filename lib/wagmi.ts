import { createConfig, http } from 'wagmi'
import { monadTestnet } from 'viem/chains'
import { createClient } from 'viem'
import { farcasterFrame } from '@farcaster/frame-wagmi-connector'

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [farcasterFrame()],
  client({ chain }) {
    return createClient({
      chain,
      transport: http(), // varsayılan JSON-RPC bağlantısı
    });
  },
  ssr: true,
});
