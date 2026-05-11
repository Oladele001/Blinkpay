"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Zap, 
  ArrowRight, 
  Shield, 
  Globe, 
  Users, 
  TrendingUp,
  Star,
  CheckCircle,
  Sparkles
} from "lucide-react";
import Navbar from "./components/navbar";
import ThreeBackground from "./components/three-background";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "Instant Payments",
      description: "Create and share payment links in seconds with beautiful, customizable Blinks."
    },
    {
      icon: Users,
      title: "Bill Splitting",
      description: "Split expenses with friends effortlessly. Everyone pays their share instantly."
    },
    {
      icon: TrendingUp,
      title: "Recurring Payments",
      description: "Set up automated recurring payments for subscriptions and regular expenses."
    },
    {
      icon: Shield,
      title: "Secure & Fast",
      description: "Powered by Solana blockchain. Your transactions are secure and complete in seconds."
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Send and receive payments from anywhere in the world without borders."
    },
    {
      icon: Sparkles,
      title: "Beautiful Design",
      description: "Stunning, shareable payment pages that impress your recipients."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Freelance Designer",
      content: "BlinkPay has revolutionized how I get paid by clients. The Blinks are so professional!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      content: "Splitting team expenses has never been easier. Absolutely love the recurring payments feature.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Content Creator",
      content: "My fans love the beautiful payment pages. It's made supporting my work so much more elegant.",
      rating: 5
    }
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <ThreeBackground />
      
      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Colosseum Frontier Hackathon</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-black mb-6"
            >
              <span className="block text-gradient mb-2">Social Payments</span>
              <span className="block text-4xl md:text-6xl text-white">Reimagined</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Create beautiful, shareable "Blinks" for instant payments, 
              bill splits, and recurring payments on Solana.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/create"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-purple text-white rounded-lg font-semibold text-lg btn-glow transition-all duration-300"
              >
                Create Your First Blink
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 glass border border-white/20 text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300"
              >
                View Dashboard
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">2.5s</div>
                <div className="text-sm text-gray-400">Avg Transaction Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">$0.00025</div>
                <div className="text-sm text-gray-400">Avg Transaction Fee</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gradient">100M+</div>
                <div className="text-sm text-gray-400">Active Users</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">Powerful Features</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Everything you need for seamless social payments on Solana
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass border border-white/10 rounded-xl p-6 card-hover group"
                >
                  <div className="w-12 h-12 bg-gradient-purple rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="text-gradient">Loved by Users</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                See what our community is saying about BlinkPay
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass border border-white/10 rounded-xl p-6 card-hover"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass border border-primary/20 rounded-2xl p-12 neon-glow"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users already using BlinkPay for seamless social payments
              </p>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-green text-white rounded-lg font-semibold text-lg btn-glow-green transition-all duration-300"
              >
                <CheckCircle className="w-5 h-5" />
                Create Your First Blink
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-gradient">BlinkPay</span>
            </div>
            <p className="text-gray-400">
              Built with ❤️ for the Solana ecosystem | Colosseum Frontier Hackathon 2025
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
