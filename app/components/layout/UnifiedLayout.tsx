'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import TopNavigation from '../TopNavigation';
import { WalletProvider } from '../../providers/WalletProvider';
import { ReduxProvider } from '../../providers/ReduxProvider';
import { ToastProvider } from '../ToastNotifications';

interface UnifiedLayoutProps {
  children: React.ReactNode;
}

// Define the 5 core zones
const CORE_ZONES = {
  HOME: '/',
  AGENTS: '/agents',
  AI_CONSOLE: '/ai-console',
  GOVERNANCE: '/governance',
  DOCS: '/docs',
  COMMUNITY: '/community'
};

// Zone configuration
const ZONE_CONFIG = {
  [CORE_ZONES.HOME]: {
    name: 'Home',
    description: 'Landing Page & Overview',
    icon: '🏠',
    color: 'cyan',
    requiresAuth: false,
    layout: 'landing'
  },
  [CORE_ZONES.AGENTS]: {
    name: 'AI Agents',
    description: 'Agent Marketplace & Management',
    icon: '🤖',
    color: 'purple',
    requiresAuth: true,
    layout: 'dashboard'
  },
  [CORE_ZONES.AI_CONSOLE]: {
    name: 'AI Console',
    description: 'Unified AI Dashboard',
    icon: '🧠',
    color: 'emerald',
    requiresAuth: true,
    layout: 'console'
  },
  [CORE_ZONES.GOVERNANCE]: {
    name: 'Governance',
    description: 'Tokenomics & DAO Governance',
    icon: '🏛️',
    color: 'blue',
    requiresAuth: true,
    layout: 'dashboard'
  },
  [CORE_ZONES.DOCS]: {
    name: 'Documentation',
    description: 'Developer Resources & Guides',
    icon: '📚',
    color: 'orange',
    requiresAuth: false,
    layout: 'docs'
  },
  [CORE_ZONES.COMMUNITY]: {
    name: 'Community',
    description: 'Community Portal & Social',
    icon: '👥',
    color: 'rose',
    requiresAuth: false,
    layout: 'community'
  }
};

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [currentZone, setCurrentZone] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Determine current zone based on pathname
  useEffect(() => {
    const determineZone = () => {
      // Check for exact matches first
      if (Object.values(CORE_ZONES).includes(pathname as any)) {
        return pathname;
      }
      
      // Check for sub-routes
      if (pathname.startsWith('/agents')) return CORE_ZONES.AGENTS;
      if (pathname.startsWith('/ai-console')) return CORE_ZONES.AI_CONSOLE;
      if (pathname.startsWith('/governance')) return CORE_ZONES.GOVERNANCE;
      if (pathname.startsWith('/docs')) return CORE_ZONES.DOCS;
      if (pathname.startsWith('/community')) return CORE_ZONES.COMMUNITY;
      
      // Default to home
      return CORE_ZONES.HOME;
    };

    const zone = determineZone();
    setCurrentZone(zone);
    setIsLoading(false);
  }, [pathname]);

  // Get current zone configuration
  const zoneConfig = ZONE_CONFIG[currentZone as keyof typeof ZONE_CONFIG];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white">Loading...</h2>
        </motion.div>
      </div>
    );
  }

  // Render different layouts based on zone
  const renderZoneLayout = () => {
    if (!zoneConfig) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <TopNavigation />
          <main className="relative z-10">
            {children}
          </main>
        </div>
      );
    }

    switch (zoneConfig.layout) {
      case 'landing':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {children}
          </div>
        );
      
      case 'console':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {children}
          </div>
        );
      
      case 'docs':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {children}
          </div>
        );
      
      case 'community':
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <TopNavigation />
            <main className="relative z-10">
              {children}
            </main>
          </div>
        );
      
      case 'dashboard':
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <TopNavigation />
            <main className="relative z-10">
              {children}
            </main>
          </div>
        );
    }
  };

  return (
    <ReduxProvider>
      <WalletProvider>
        <ToastProvider>
          <div className="min-h-screen">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentZone}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderZoneLayout()}
              </motion.div>
            </AnimatePresence>
          </div>
        </ToastProvider>
      </WalletProvider>
    </ReduxProvider>
  );
};

export default UnifiedLayout;
