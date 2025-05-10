import { createConfig, http } from 'wagmi';
import { monadTestnet } from 'wagmi/chains';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [farcasterFrame()],
  transports: {
    [monadTestnet.id]: http(),
  },
  ssr: true,
});
