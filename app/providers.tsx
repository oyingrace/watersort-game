"use client";

import { type ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WagmiConfig } from 'wagmi';
import { config, SELECTED_CHAIN } from "@/lib/wagmi";

export function Providers(props: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={SELECTED_CHAIN}
        config={{
          appearance: {
            mode: 'auto',
            theme: 'default',
            name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
            logo: process.env.NEXT_PUBLIC_ICON_URL,
          },
        }}
        miniKit={{ enabled: true }}
      >
        {props.children}
      </OnchainKitProvider>
    </WagmiConfig>
  );
}


