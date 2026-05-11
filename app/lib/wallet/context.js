"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCluster } from "../../components/cluster-context";

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const { 
    connected, 
    connecting, 
    wallet, 
    publicKey, 
    connect, 
    disconnect, 
    select,
    wallets,
    connecting: isConnecting
  } = useWallet();
  
  const { cluster } = useCluster();
  const [error, setError] = useState(null);

  const handleConnect = useCallback(async (walletName) => {
    try {
      setError(null);
      select(walletName);
      await connect();
    } catch (err) {
      setError(err);
      console.error("Wallet connection failed:", err);
    }
  }, [select, connect]);

  const handleDisconnect = useCallback(async () => {
    try {
      setError(null);
      await disconnect();
    } catch (err) {
      setError(err);
      console.error("Wallet disconnection failed:", err);
    }
  }, [disconnect]);

  const value = useMemo(() => ({
    connectors: wallets.map(w => ({
      id: w.adapter.name,
      name: w.adapter.name,
      icon: w.adapter.icon,
      ready: w.readyState === 'Installed',
      connect: () => handleConnect(w.adapter.name),
      disconnect: handleDisconnect,
    })),
    status: connecting ? 'connecting' : connected ? 'connected' : 'disconnected',
    wallet: wallet ? {
      account: {
        address: publicKey?.toBase58(),
      },
      adapter: wallet.adapter,
    } : undefined,
    signer: publicKey,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
    isReady: typeof window !== "undefined",
  }), [connected, connecting, wallet, publicKey, wallets, error, handleConnect, handleDisconnect]);

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWalletContext() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWalletContext must be used within WalletProvider");
  return ctx;
}
