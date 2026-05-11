import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./components/providers";
import { Toaster } from "sonner";
import AIAssistant from "./components/ai-assistant";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "BlinkPay - Social Payments on Solana",
  description: "Create beautiful, shareable Blinks for instant payments, bill splits, and recurring payments on Solana",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(26, 0, 51, 0.95)',
                border: '1px solid rgba(153, 69, 255, 0.2)',
                color: '#ffffff',
                backdropFilter: 'blur(12px)',
              },
              success: {
                iconTheme: {
                  primary: '#14F195',
                  secondary: '#0a001f',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#0a001f',
                },
              },
            }}
          />
          <AIAssistant />
        </Providers>
      </body>
    </html>
  );
}
