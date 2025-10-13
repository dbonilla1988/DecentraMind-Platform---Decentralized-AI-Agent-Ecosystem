"use client";

import React from 'react';

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Temporarily disabled Solana wallet provider to avoid dependency issues
  return <>{children}</>;
} 