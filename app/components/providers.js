"use client";

import { ThemeProvider } from "next-themes";
import { PropsWithChildren, useMemo } from "react";
import { 
  WalletProvider as SolanaWalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { PhantomWalletAdapter, BackpackWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

// Default wallets that will be available
const wallets = [
  new PhantomWalletAdapter(),
  new BackpackWalletAdapter(),
  new SolflareWalletAdapter(),
];

export function Providers({ children }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}
