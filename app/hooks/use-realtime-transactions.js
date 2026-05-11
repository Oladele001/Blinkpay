"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

// Mock real-time transaction data
const mockTransactions = [
  {
    id: "tx_1",
    type: "received",
    amount: 0.025,
    token: "SOL",
    from: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    to: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    signature: "5j7s8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4",
    status: "confirmed",
    timestamp: new Date(Date.now() - 3600000),
    message: "Coffee payment ☕"
  },
  {
    id: "tx_2",
    type: "sent",
    amount: 0.1,
    token: "SOL",
    from: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    to: "So11111111111111111111111111111111111111111112",
    signature: "3k9m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8",
    status: "confirmed",
    timestamp: new Date(Date.now() - 7200000),
    message: "Split dinner bill 🍽️"
  },
  {
    id: "tx_3",
    type: "received",
    amount: 50,
    token: "USDC",
    from: "11111111111111111111111111111111111111111111",
    to: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    signature: "7p4l1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7",
    status: "pending",
    timestamp: new Date(Date.now() - 1800000),
    message: "Monthly subscription"
  }
];

export function useRealtimeTransactions() {
  const { publicKey, connected } = useWallet();
  const [transactions, setTransactions] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Simulate WebSocket connection
  const connectWebSocket = useCallback(() => {
    setIsConnected(true);
    
    // Initial load
    setTransactions(mockTransactions);
    setLastUpdate(new Date());

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Random chance of new transaction
      if (Math.random() > 0.7) {
        const newTransaction = generateMockTransaction();
        setTransactions(prev => [newTransaction, ...prev].slice(0, 50)); // Keep last 50
        setLastUpdate(new Date());
      }
    }, 5000); // Check every 5 seconds

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  useEffect(() => {
    if (connected && publicKey) {
      const cleanup = connectWebSocket();
      return cleanup;
    } else {
      setTransactions([]);
      setIsConnected(false);
      setLastUpdate(null);
    }
  }, [connected, publicKey, connectWebSocket]);

  const generateMockTransaction = () => {
    const types = ["received", "sent"];
    const tokens = ["SOL", "USDC"];
    const type = types[Math.floor(Math.random() * types.length)];
    const token = tokens[Math.floor(Math.random() * tokens.length)];
    
    const amount = token === "SOL" 
      ? (Math.random() * 2).toFixed(4)
      : (Math.random() * 100).toFixed(2);

    const messages = [
      "Quick payment 💨",
      "Bill split 🍕",
      "Coffee ☕",
      "Lunch 🥗",
      "Subscription 📱",
      "Gift 🎁",
      "Refund 💰",
      "Transfer 📤"
    ];

    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      amount: parseFloat(amount),
      token,
      from: type === "received" ? generateRandomAddress() : publicKey?.toBase58(),
      to: type === "sent" ? generateRandomAddress() : publicKey?.toBase58(),
      signature: generateRandomSignature(),
      status: Math.random() > 0.1 ? "confirmed" : "pending",
      timestamp: new Date(),
      message: messages[Math.floor(Math.random() * messages.length)]
    };
  };

  const generateRandomAddress = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateRandomSignature = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < 88; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const refreshTransactions = useCallback(() => {
    if (connected && publicKey) {
      // Simulate refresh
      setTransactions(prev => [...prev]);
      setLastUpdate(new Date());
    }
  }, [connected, publicKey]);

  const addTransaction = useCallback((transaction) => {
    setTransactions(prev => [transaction, ...prev]);
    setLastUpdate(new Date());
  }, []);

  const updateTransactionStatus = useCallback((transactionId, status) => {
    setTransactions(prev => 
      prev.map(tx => 
        tx.id === transactionId ? { ...tx, status } : tx
      )
    );
    setLastUpdate(new Date());
  }, []);

  return {
    transactions,
    isConnected,
    lastUpdate,
    refreshTransactions,
    addTransaction,
    updateTransactionStatus,
    totalTransactions: transactions.length,
    pendingTransactions: transactions.filter(tx => tx.status === "pending").length
  };
}
