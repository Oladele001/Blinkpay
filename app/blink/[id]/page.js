"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowUpRight,
  Users,
  TrendingUp,
  Wallet,
  Copy,
  Share2,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Zap,
  Calendar,
  DollarSign,
  UserPlus,
  Minus,
  Plus
} from "lucide-react";
import Navbar from "../../components/navbar";
import ThreeBackground from "../../components/three-background";
import { useWallet } from "@solana/wallet-adapter-react";

// Solana Actions integration


export default function BlinkPage() {
  const { id } = useParams();
  const { publicKey, connected, signTransaction } = useWallet();
  
  const [blink, setBlink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [splitDetails, setSplitDetails] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Mock blink data - replace with real data fetching
  useEffect(() => {
    const fetchBlink = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        const mockBlinks = {
          'abc123': {
            id: 'abc123',
            type: 'simple',
            title: 'Coffee Payment',
            amount: 0.005,
            token: 'SOL',
            message: 'Thanks for the coffee! ☕',
            creator: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
            status: 'active',
            createdAt: new Date(Date.now() - 86400000),
            expiresAt: new Date(Date.now() + 7 * 86400000),
            totalReceived: 0.003,
            transactions: 2,
            maxTransactions: 10
          },
          'def456': {
            id: 'def456',
            type: 'split',
            title: 'Dinner Split',
            amount: 0.05,
            token: 'SOL',
            message: 'Splitting dinner at the restaurant 🍽️',
            creator: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
            status: 'active',
            createdAt: new Date(Date.now() - 2 * 86400000),
            expiresAt: new Date(Date.now() + 5 * 86400000),
            totalReceived: 0.10,
            transactions: 2,
            maxTransactions: 3,
            recipients: [
              { address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', paid: true },
              { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', paid: false },
              { address: 'So11111111111111111111111111111111111111111112', paid: false }
            ]
          },
          'ghi789': {
            id: 'ghi789',
            type: 'recurring',
            title: 'Monthly Subscription',
            amount: 0.02,
            token: 'USDC',
            message: 'Monthly subscription payment 📅',
            creator: '11111111111111111111111111111111111',
            status: 'active',
            createdAt: new Date(Date.now() - 30 * 86400000),
            expiresAt: null,
            totalReceived: 0.06,
            transactions: 3,
            frequency: 'monthly'
          }
        };

        const foundBlink = mockBlinks[id];
        if (foundBlink) {
          setBlink(foundBlink);
          setAmount(foundBlink.amount.toString());
          setMessage(foundBlink.message);
          
          if (foundBlink.type === 'split' && foundBlink.recipients) {
            setSplitDetails(foundBlink.recipients.map(r => ({
              ...r,
              amount: foundBlink.amount / foundBlink.recipients.length
            })));
          }
        } else {
          setError('Blink not found');
        }
        setLoading(false);
      }, 1000);
    };

    if (id) {
      fetchBlink();
    }
  }, [id]);

  const handlePayment = async () => {
    if (!connected || !blink) return;

    // The wallet/actions runtime will execute the actual transaction when
    // the user follows the action link.
    const url = new URL(`/api/pay/${blink.id}`, window.location.origin);
    url.searchParams.set("amount", amount || String(blink.amount));
    url.searchParams.set("message", message || "");

    window.location.href = url.toString();
  };

  const handleSplitPayment = async (recipientIndex) => {
    if (!connected) return;
    
    setPaying(true);
    setError('');
    
    try {
      // Simulate split payment processing
      setTimeout(() => {
        setPaying(false);
        setShowSuccess(true);
        
        // Update recipient status
        setSplitDetails(prev => prev.map((r, i) => 
          i === recipientIndex ? { ...r, paid: true } : r
        ));
        
        // Update blink state
        setBlink(prev => ({
          ...prev,
          totalReceived: prev.totalReceived + splitDetails[recipientIndex].amount,
          transactions: prev.transactions + 1
        }));
      }, 2000);
      
    } catch (err) {
      setPaying(false);
      setError('Payment failed. Please try again.');
      console.error('Split payment error:', err);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const shareBlink = () => {
    if (navigator.share) {
      navigator.share({
        title: blink?.title,
        text: blink?.message,
        url: window.location.href
      });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'simple':
        return <ArrowUpRight className="w-6 h-6 text-purple-400" />;
      case 'split':
        return <Users className="w-6 h-6 text-blue-400" />;
      case 'recurring':
        return <TrendingUp className="w-6 h-6 text-green-400" />;
      default:
        return <ArrowUpRight className="w-6 h-6 text-gray-400" />;
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getProgress = () => {
    if (!blink) return 0;
    return Math.min((blink.transactions / blink.maxTransactions) * 100, 100);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <ThreeBackground />
        <div className="relative z-10">
          <Navbar />
          <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-2xl font-bold mb-2 text-white">Blink Not Found</h2>
              <p className="text-gray-400 mb-6">This payment link doesn&apos;t exist or has expired</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-purple text-white rounded-lg font-semibold btn-glow"
              >
                Go Home
              </Link>
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

        <main className="max-w-4xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border border-white/10 rounded-2xl p-8 neon-glow"
          >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-purple rounded-xl flex items-center justify-center">
                {getTypeIcon(blink.type)}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2 text-white">{blink.title}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>Created by {formatAddress(blink.creator)}</span>
                  <span>•</span>
                  <span>{new Intl.DateTimeFormat('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  }).format(blink.createdAt)}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={copyLink}
                  className="p-3 glass border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={shareBlink}
                  className="p-3 glass border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Message */}
            {blink.message && (
              <div className="mb-6 p-4 bg-black/20 rounded-lg border border-white/5">
                <p className="text-gray-300">{blink.message}</p>
              </div>
            )}

            {/* Payment Details */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Payment Details</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-xl font-bold text-white">
                      {blink.amount} {blink.token}
                    </span>
                  </div>
                  
                  {blink.type === 'recurring' && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Frequency</span>
                      <span className="text-primary capitalize">{blink.frequency}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 capitalize">{blink.status}</span>
                    </span>
                  </div>
                  
                  {blink.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Expires</span>
                      <span className="text-sm text-gray-300">
                        {new Intl.DateTimeFormat('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }).format(blink.expiresAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">Progress</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Received</span>
                    <span className="text-lg font-semibold text-green-400">
                      {blink.totalReceived} {blink.token}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Transactions</span>
                    <span className="text-sm text-gray-300">
                      {blink.transactions}{blink.maxTransactions ? `/${blink.maxTransactions}` : ''}
                    </span>
                  </div>
                  
                  {blink.maxTransactions && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Completion</span>
                        <span className="text-sm text-gray-300">{getProgress().toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-black/20 rounded-full h-3">
                        <div 
                          className="bg-gradient-purple h-3 rounded-full transition-all duration-300"
                          style={{ width: `${getProgress()}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            {blink.status === 'active' && (
              <div className="border-t border-white/10 pt-6">
                {blink.type === 'simple' && (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4 text-white">Make Payment</h3>
                    
                    <div className="max-w-md mx-auto space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Amount ({blink.token})
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            step="0.000000001"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Message (optional)
                        </label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Add a message..."
                          rows={3}
                          className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-colors resize-none"
                        />
                      </div>
                      
                      <button
                        onClick={handlePayment}
                        disabled={!connected || paying || !amount || parseFloat(amount) <= 0}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-purple text-white rounded-lg font-semibold btn-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        {paying ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            Pay {amount || blink.amount} {blink.token}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {blink.type === 'split' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">Split Payment</h3>
                    
                    <div className="space-y-4">
                      {splitDetails.map((recipient, index) => (
                        <div key={index} className="flex items-center justify-between p-4 glass-dark border border-white/5 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              recipient.paid ? 'bg-green-500/20' : 'bg-gray-500/20'
                            }`}>
                              {recipient.paid ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              ) : (
                                <UserPlus className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {formatAddress(recipient.address)}
                              </p>
                              <p className="text-sm text-gray-400">
                                {recipient.paid ? 'Paid' : 'Pending'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-semibold text-white">
                              {recipient.amount.toFixed(4)} {blink.token}
                            </p>
                            {!recipient.paid && (
                              <button
                                onClick={() => handleSplitPayment(index)}
                                disabled={!connected || paying}
                                className="mt-2 px-4 py-2 bg-gradient-green text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                              >
                                {paying ? 'Paying...' : 'Pay Share'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {blink.type === 'recurring' && (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-4 text-white">Subscribe</h3>
                    <p className="text-gray-300 mb-6">
                      This is a recurring payment of {blink.amount} {blink.token} per {blink.frequency}
                    </p>
                    
                    <button
                      onClick={handlePayment}
                      disabled={!connected || paying}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-green text-white rounded-lg font-semibold btn-glow-green disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {paying ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-5 h-5" />
                          Subscribe {blink.amount} {blink.token}/{blink.frequency}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass border border-primary/50 rounded-2xl p-8 max-w-md w-full neon-glow"
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <h3 className="text-2xl font-bold mb-2 text-white">Payment Successful!</h3>
              <p className="text-gray-300 mb-6">
                Your payment has been processed successfully
              </p>
              
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full px-6 py-3 bg-gradient-purple text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
