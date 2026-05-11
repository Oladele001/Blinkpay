"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Menu, X, Zap, Users, TrendingUp } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: TrendingUp },
    { name: "Create Blink", href: "/create", icon: Zap },
    { name: "My Blinks", href: "/blinks", icon: Users },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-8 h-8 bg-gradient-purple rounded-lg flex items-center justify-center"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-xl font-bold text-gradient">BlinkPay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
              >
                <item.icon className="w-4 h-4 group-hover:text-primary" />
                <span className="group-hover:text-gradient">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Wallet Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <WalletMultiButton
                className="!bg-gradient-purple !hover:opacity-90 !text-white !border-none !px-6 !py-2 !rounded-lg !transition-all !duration-300 !hover:scale-105"
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass-dark border-t border-white/10 mt-4 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors px-2 py-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="px-2 py-2">
                <WalletMultiButton
                  className="!bg-gradient-purple !hover:opacity-90 !text-white !border-none !w-full !px-6 !py-2 !rounded-lg !transition-all !duration-300"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
