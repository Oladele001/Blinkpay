"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Users, 
  TrendingUp, 
  Clock,
  Copy,
  ExternalLink,
  Zap,
  RefreshCw
} from "lucide-react";
import Navbar from "../components/navbar";
import ThreeBackground from "../components/three-background";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRealtimeTransactions } from "../hooks/use-realtime-transactions";

export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState(0);
  const { 
    transactions, 
    isConnected: isRealtimeConnected, 
    lastUpdate,
    refreshTransactions,
    pendingTransactions 
  } = useRealtimeTransactions();

  // Mock balance - replace with real Solana data
  useEffect(() => {
    if (connected && publicKey) {
      setBalance(2.456);
    }
  }, [connected, publicKey]);

  const quickActions = [
    {
      icon: ArrowUpRight,
      label: "Send",
      href: "/create",
      color: "text-green-400"
    },
    {
      icon: Users,
      label: "Split Bill",
      href: "/create?tab=split",
      color: "text-purple-400"
    },
    {
      icon: TrendingUp,
      label: "Recurring",
      href: "/create?tab=recurring",
      color: "text-blue-400"
    },
    {
      icon: Clock,
      label: "History",
      href: "/blinks",
      color: "text-yellow-400"
    }
  ];

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      // Show toast notification
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!connected) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <ThreeBackground />
        <div className="relative z-10">
          <Navbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Wallet className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">Please connect your wallet to access the dashboard</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ThreeBackground />
      
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Wallet Balance Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border border-white/10 rounded-2xl p-8 mb-8 neon-glow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Balance</p>
                    <p className="text-3xl font-bold text-white">{balance} SOL</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Address:</span>
                    <code className="text-primary">{formatAddress(publicKey?.toBase58())}</code>
                    <button
                      onClick={copyAddress}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    isRealtimeConnected ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm text-gray-400">
                    {isRealtimeConnected ? 'Live' : 'Offline'}
                  </span>
                </div>
                <button 
                  onClick={refreshTransactions}
                  className="flex items-center gap-2 px-4 py-2 glass border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="glass border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 card-hover group"
                >
                  <action.icon className={`w-8 h-8 mb-3 ${action.color} group-hover:scale-110 transition-transform`} />
                  <p className="text-white font-medium">{action.label}</p>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
              <Link
                href="/blinks"
                className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1 text-sm"
              >
                View All
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">No transactions yet</p>
                  <Link
                    href="/create"
                    className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80"
                  >
                    <Zap className="w-4 h-4" />
                    Create your first Blink
                  </Link>
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 glass-dark border border-white/5 rounded-lg hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === 'received' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {tx.type === 'received' ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {tx.type === 'received' ? 'Received' : 'Sent'} {tx.amount} SOL
                        </p>
                        <p className="text-sm text-gray-400">
                          {tx.type === 'received' ? 'From' : 'To'} {formatAddress(tx.from || tx.to)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">{formatTime(tx.timestamp)}</p>
                      <p className="text-xs text-primary font-mono">{tx.signature}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
