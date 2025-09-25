import { http, createConfig } from 'wagmi';
import { celo } from 'wagmi/chains';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

// Selected chain (Celo mainnet)
export const SELECTED_CHAIN = celo;

// Celo mainnet RPC
const ACTIVE_RPC = 'https://forno.celo.org';

export const config = createConfig({
  chains: [SELECTED_CHAIN],
  transports: {
    [celo.id]: http(ACTIVE_RPC),
  },
  connectors: [
    // Farcaster Mini App connector
    farcasterMiniApp(),
  ],
});


