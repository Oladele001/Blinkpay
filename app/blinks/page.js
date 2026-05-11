"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowUpRight,
  Users,
  TrendingUp,
  Copy,
  Share2,
  ExternalLink,
  Calendar,
  DollarSign,
  Clock,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import Navbar from "../components/navbar";
import ThreeBackground from "../components/three-background";
import { useWallet } from "@solana/wallet-adapter-react";

export default function MyBlinks() {
  const { publicKey, connected } = useWallet();
  const [blinks, setBlinks] = useState([]);
  const [filteredBlinks, setFilteredBlinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock data - replace with real data from your backend
  useEffect(() => {
    if (connected && publicKey) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setBlinks([
          {
            id: 'abc123',
            type: 'simple',
            title: 'Coffee Payment',
            amount: 0.005,
            token: 'SOL',
            message: 'Thanks for the coffee!',
            status: 'active',
            createdAt: new Date(Date.now() - 86400000),
            expiresAt: new Date(Date.now() + 7 * 86400000),
            totalReceived: 0.003,
            transactions: 2,
            maxTransactions: 10,
            link: `${window.location.origin}/blink/abc123`
          },
          {
            id: 'def456',
            type: 'split',
            title: 'Dinner Split',
            amount: 0.15,
            token: 'SOL',
            message: 'Splitting dinner at the restaurant',
            status: 'completed',
            createdAt: new Date(Date.now() - 2 * 86400000),
            expiresAt: new Date(Date.now() - 86400000),
            totalReceived: 0.15,
            transactions: 3,
            maxTransactions: 3,
            link: `${window.location.origin}/blink/def456`
          },
          {
            id: 'ghi789',
            type: 'recurring',
            title: 'Monthly Subscription',
            amount: 0.02,
            token: 'USDC',
            message: 'Monthly subscription payment',
            status: 'active',
            createdAt: new Date(Date.now() - 30 * 86400000),
            expiresAt: null,
            totalReceived: 0.06,
            transactions: 3,
            frequency: 'monthly',
            link: `${window.location.origin}/blink/ghi789`
          }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    let filtered = blinks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(blink =>
        blink.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blink.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(blink => blink.status === filterStatus);
    }

    setFilteredBlinks(filtered);
  }, [blinks, searchTerm, filterStatus]);

  const copyBlinkLink = (link) => {
    navigator.clipboard.writeText(link);
    // Show toast notification
  };

  const shareBlink = (blink) => {
    if (navigator.share) {
      navigator.share({
        title: blink.title,
        text: blink.message,
        url: blink.link
      });
    }
  };

  const deleteBlink = (blinkId) => {
    setBlinks(prev => prev.filter(b => b.id !== blinkId));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'simple':
        return <ArrowUpRight className="w-5 h-5 text-purple-400" />;
      case 'split':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'recurring':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      default:
        return <ArrowUpRight className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getProgress = (blink) => {
    if (blink.type === 'recurring') return null;
    const progress = (blink.transactions / blink.maxTransactions) * 100;
    return Math.min(progress, 100);
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
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-purple rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
              <p className="text-gray-400 mb-6">Please connect your wallet to view your Blinks</p>
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gradient">My Blinks</h1>
              <p className="text-gray-300">Manage your payment links and track transactions</p>
            </div>
            
            <Link
              href="/create"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-purple text-white rounded-lg font-semibold btn-glow"
            >
              <ArrowUpRight className="w-5 h-5" />
              Create New Blink
            </Link>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass border border-white/10 rounded-xl p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title or message..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-primary/50 focus:outline-none transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Blinks Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filteredBlinks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-purple/20 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">No Blinks Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your filters or search terms'
                  : 'Create your first Blink to get started'
                }
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-purple text-white rounded-lg font-semibold btn-glow"
              >
                <ArrowUpRight className="w-5 h-5" />
                Create Your First Blink
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlinks.map((blink, index) => (
                <motion.div
                  key={blink.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass border border-white/10 rounded-xl p-6 card-hover group"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black/20 rounded-lg flex items-center justify-center">
                        {getTypeIcon(blink.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{blink.title}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          {getStatusIcon(blink.status)}
                          <span className="text-gray-400 capitalize">{blink.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Amount</span>
                      <span className="font-semibold text-white">
                        {blink.amount} {blink.token}
                      </span>
                    </div>
                    
                    {blink.type === 'recurring' && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Frequency</span>
                        <span className="text-sm text-primary capitalize">{blink.frequency}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Received</span>
                      <span className="text-sm text-green-400">
                        {blink.totalReceived} {blink.token}
                      </span>
                    </div>
                    
                    {blink.type !== 'recurring' && (
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-sm text-gray-300">
                            {blink.transactions}/{blink.maxTransactions}
                          </span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-purple h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgress(blink)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Created</span>
                      <span className="text-sm text-gray-300">{formatDate(blink.createdAt)}</span>
                    </div>
                  </div>

                  {/* Message */}
                  {blink.message && (
                    <div className="mb-4 p-3 bg-black/20 rounded-lg">
                      <p className="text-sm text-gray-300 line-clamp-2">{blink.message}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyBlinkLink(blink.link)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 glass border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    
                    <button
                      onClick={() => shareBlink(blink)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 glass border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                    
                    <Link
                      href={blink.link}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gradient-purple text-white rounded-lg hover:opacity-90 transition-opacity text-center"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
