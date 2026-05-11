"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ThreeBackgroundComponent from '../components/three-background';
import { 
  ArrowUpRight, 
  Users, 
  TrendingUp, 
  Plus, 
  Minus, 
  Copy,
  Share2,
  CheckCircle,
  AlertCircle,
  Wallet,
  Calendar,
  DollarSign,
  UserPlus,
  Zap
} from "lucide-react";
import Navbar from "../components/navbar";
import { useWallet } from "@solana/wallet-adapter-react";

export default function CreateBlink() {
  const { publicKey, connected } = useWallet();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'simple';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    amount: '',
    recipients: [''],
    message: '',
    token: 'SOL',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    splitType: 'equal'
  });
  
  const [blinkLink, setBlinkLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const tabs = [
    {
      id: 'simple',
      label: 'Simple Pay',
      icon: ArrowUpRight,
      description: 'Create a one-time payment request'
    },
    {
      id: 'split',
      label: 'Split Bill',
      icon: Users,
      description: 'Split expenses with multiple people'
    },
    {
      id: 'recurring',
      label: 'Recurring',
      icon: TrendingUp,
      description: 'Set up recurring payments'
    }
  ];

  const tokens = [
    { symbol: 'SOL', name: 'Solana', decimals: 9 },
    { symbol: 'USDC', name: 'USD Coin', decimals: 6 }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRecipient = () => {
    setFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, '']
    }));
  };

  const removeRecipient = (index) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const updateRecipient = (index, value) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => i === index ? value : r)
    }));
  };

  const generateBlinkLink = () => {
    setIsCreating(true);
    
    // Simulate API call to create blink
    setTimeout(() => {
      const blinkId = Math.random().toString(36).substring(7);
      const link = `${window.location.origin}/blink/${blinkId}`;
      setBlinkLink(link);
      setIsCreating(false);
      setShowSuccess(true);
    }, 2000);
  };

  const copyBlinkLink = () => {
    navigator.clipboard.writeText(blinkLink);
    // Show toast notification
  };

  const shareBlink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'BlinkPay Payment',
        text: formData.message || 'Pay me with BlinkPay',
        url: blinkLink
      });
    }
  };

  const validateForm = () => {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      return false;
    }
    
    if (activeTab === 'split') {
      const validRecipients = formData.recipients.filter(r => r.trim() !== '');
      return validRecipients.length >= 1;
    }
    
    if (activeTab === 'recurring') {
      return formData.startDate && formData.endDate;
    }
    
    return true;
  };

  if (!connected) {
    return (
      <div className="relative min-h-screen bg-background text-foreground">
        <ThreeBackgroundComponent />
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
              <p className="text-gray-400 mb-6">Please connect your wallet to create Blinks</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <ThreeBackgroundComponent />
      
      <div className="relative z-10">
        <Navbar />

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-2 text-gradient">Create Blink</h1>
            <p className="text-gray-300">Create beautiful, shareable payment requests</p>
            <ThreeBackgroundComponent />
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 glass border rounded-xl p-4 transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-primary/50 bg-primary/10 neon-glow'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <tab.icon className={`w-6 h-6 mb-2 mx-auto ${
                  activeTab === tab.id ? 'text-primary' : 'text-gray-400'
                }`} />
                <h3 className={`font-semibold mb-1 ${
                  activeTab === tab.id ? 'text-white' : 'text-gray-300'
                }`}>
                  {tab.label}
                </h3>
                <p className="text-sm text-gray-400">{tab.description}</p>
              </button>
            ))}
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass border border-white/10 rounded-2xl p-8"
          >
            {/* Amount and Token */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.000000001"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Token
                </label>
                <select
                  value={formData.token}
                  onChange={(e) => handleInputChange('token', e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-primary/50 focus:outline-none transition-colors"
                >
                  {tokens.map((token) => (
                    <option key={token.symbol} value={token.symbol}>
                      {token.symbol} - {token.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message (optional)
              </label>
              <textarea
                placeholder="What's this payment for?"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Tab-specific fields */}
            {activeTab === 'split' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-300">
                    Recipients
                  </label>
                  <button
                    onClick={addRecipient}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Recipient
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.recipients.map((recipient, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter wallet address or username"
                        value={recipient}
                        onChange={(e) => updateRecipient(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none transition-colors"
                      />
                      {formData.recipients.length > 1 && (
                        <button
                          onClick={() => removeRecipient(index)}
                          className="p-3 text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Split Type
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="equal"
                        checked={formData.splitType === 'equal'}
                        onChange={(e) => handleInputChange('splitType', e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-gray-300">Equal Split</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="custom"
                        checked={formData.splitType === 'custom'}
                        onChange={(e) => handleInputChange('splitType', e.target.value)}
                        className="text-primary"
                      />
                      <span className="text-gray-300">Custom Amounts</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recurring' && (
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Frequency
                  </label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => handleInputChange('frequency', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-primary/50 focus:outline-none transition-colors"
                  >
                    {frequencies.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:border-primary/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Create Button */}
            <div className="flex justify-center">
              <button
                onClick={generateBlinkLink}
                disabled={!validateForm() || isCreating}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white rounded-lg font-semibold btn-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Create Blink
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Success Modal */}
          {showSuccess && blinkLink && (
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
                  <h3 className="text-2xl font-bold mb-2 text-white">Blink Created!</h3>
                  <p className="text-gray-300 mb-6">
                    Your payment link is ready to share
                  </p>
                  
                  <div className="glass-dark border border-white/10 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-2">Payment Link</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={blinkLink}
                        readOnly
                        className="flex-1 bg-transparent text-primary font-mono text-sm"
                      />
                      <button
                        onClick={copyBlinkLink}
                        className="p-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                      <button
                        onClick={shareBlink}
                        className="p-2 text-primary hover:text-primary/80 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowSuccess(false)}
                      className="flex-1 px-4 py-2 glass border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Close
                    </button>
                    <Link
                      href={blinkLink}
                      target="_blank"
                      className="flex-1 px-4 py-2 bg-gradient-purple text-white rounded-lg hover:opacity-90 transition-opacity text-center"
                    >
                      View Blink
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
