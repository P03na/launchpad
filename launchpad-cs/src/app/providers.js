"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  polygonMumbai,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useEffect, useState } from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    alchemyProvider({apiKey: process.env.NEXT_PUBLIC_ALCHEMY_APIKEY}),
    publicProvider(),
  ]
);

//const projectId = '3cba1c661b5a8b71e40f1201e5a1d4e0';
const projectId = 'f6e78a0b9efe4b3554249027965a60b9';

const { wallets } = getDefaultWallets({
  appName: "Tip Button",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Rainbowkit Demo",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
