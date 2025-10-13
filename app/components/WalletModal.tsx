'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../providers/WalletContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { connectWallet, isLoading } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const wallets = [
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      description: 'The most popular Solana wallet',
      recommended: true,
    },
    {
      id: 'solflare',
      name: 'Solflare',
      icon: '☀️',
      description: 'Secure and user-friendly',
    },
    {
      id: 'backpack',
      name: 'Backpack',
      icon: '🎒',
      description: 'Built for traders and developers',
    },
    {
      id: 'glow',
      name: 'Glow',
      icon: '✨',
      description: 'Lightweight and fast',
    },
  ];

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId);
    await connectWallet();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Choose Your Wallet</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <span className="text-gray-400 hover:text-white text-xl">✕</span>
            </button>
          </div>

          <p className="text-gray-300 mb-6 text-center">
            Select a wallet to connect to DecentraMind and start minting AI agents
          </p>

          <div className="space-y-3">
            {wallets.map((wallet) => (
              <motion.button
                key={wallet.id}
                onClick={() => handleWalletSelect(wallet.id)}
                disabled={isLoading}
                className={`
                  w-full p-4 rounded-xl border transition-all duration-300 text-left
                  ${wallet.recommended 
                    ? 'border-purple-500/50 bg-purple-500/10 hover:border-purple-400/70 hover:bg-purple-500/20' 
                    : 'border-slate-600/50 bg-slate-700/20 hover:border-slate-500/70 hover:bg-slate-600/30'
                  }
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                whileHover={!isLoading ? { scale: 1.02 } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{wallet.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white">{wallet.name}</h3>
                      {wallet.recommended && (
                        <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{wallet.description}</p>
                  </div>
                  {isLoading && selectedWallet === wallet.id && (
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-xl">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>🔒</span>
              <span>Your wallet connection is secure and encrypted</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WalletModal;
