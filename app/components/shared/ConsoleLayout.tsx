'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import WalletStatus from '../WalletStatus';

interface ConsoleLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showWalletStatus?: boolean;
}

const ConsoleLayout: React.FC<ConsoleLayoutProps> = ({
  children,
  title,
  subtitle,
  showWalletStatus = true
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Cosmic Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        {[...Array(50)].map((_, i) => {
          // Use deterministic positioning based on index to avoid hydration mismatch
          const positions = [
            { left: 20.7, top: 10.6 }, { left: 58.1, top: 82.5 }, { left: 13.8, top: 16.7 },
            { left: 35.1, top: 64.8 }, { left: 11.9, top: 35.7 }, { left: 80.6, top: 54.5 },
            { left: 45.0, top: 26.7 }, { left: 16.1, top: 31.7 }, { left: 95.4, top: 3.8 },
            { left: 81.0, top: 69.9 }, { left: 93.9, top: 25.8 }, { left: 24.7, top: 7.5 },
            { left: 45.6, top: 76.8 }, { left: 96.5, top: 42.3 }, { left: 43.5, top: 23.0 },
            { left: 37.5, top: 94.5 }, { left: 26.2, top: 53.2 }, { left: 64.3, top: 78.7 },
            { left: 40.3, top: 25.1 }, { left: 52.3, top: 93.7 }, { left: 16.9, top: 32.2 },
            { left: 64.4, top: 23.4 }, { left: 47.4, top: 43.2 }, { left: 59.5, top: 62.3 },
            { left: 13.8, top: 21.5 }, { left: 95.6, top: 43.2 }, { left: 55.5, top: 15.1 },
            { left: 56.3, top: 83.9 }, { left: 78.2, top: 34.6 }, { left: 7.23, top: 76.6 },
            { left: 73.8, top: 99.1 }, { left: 55.7, top: 70.9 }, { left: 83.9, top: 88.2 },
            { left: 14.6, top: 24.8 }, { left: 31.5, top: 65.8 }, { left: 44.7, top: 19.4 },
            { left: 41.0, top: 62.3 }, { left: 43.3, top: 36.3 }, { left: 31.9, top: 54.7 },
            { left: 39.0, top: 28.1 }, { left: 96.4, top: 24.1 }, { left: 99.0, top: 90.9 },
            { left: 23.6, top: 76.1 }, { left: 7.74, top: 70.9 }, { left: 26.5, top: 43.3 },
            { left: 33.2, top: 53.5 }, { left: 19.7, top: 13.4 }, { left: 55.1, top: 47.0 },
            { left: 11.7, top: 98.2 }, { left: 1.63, top: 35.0 }
          ];
          const pos = positions[i] || { left: 50, top: 50 };

          return (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + (i % 3) * 0.5, // Use index-based duration instead of random
                repeat: Infinity,
                delay: (i % 4) * 0.5, // Use index-based delay instead of random
              }}
            />
          );
        })}
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">DM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-400">{subtitle}</p>
                )}
              </div>
            </motion.div>

            {/* Wallet Status */}
            {showWalletStatus && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <WalletStatus />
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
};

export default ConsoleLayout;
