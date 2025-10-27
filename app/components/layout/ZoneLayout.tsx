'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ZoneNav from '../navigation/ZoneNav';
import DecentraMindLogo from '../DecentraMindLogo';

interface ZoneLayoutProps {
  children: React.ReactNode;
  zone: 'home' | 'agents' | 'ai-console' | 'governance' | 'docs' | 'community';
  showNavigation?: boolean;
  className?: string;
}

const ZoneLayout: React.FC<ZoneLayoutProps> = ({ 
  children, 
  zone, 
  showNavigation = true,
  className = ''
}) => {
  const getZoneTheme = (zone: string) => {
    const themes = {
      home: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      agents: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
      'ai-console': 'bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900',
      governance: 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900',
      docs: 'bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900',
      community: 'bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900'
    };
    return themes[zone as keyof typeof themes] || themes.home;
  };

  return (
    <div className={`min-h-screen ${getZoneTheme(zone)} ${className}`}>
      {/* Top Navigation */}
      {showNavigation && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-50 w-full bg-zinc-900/90 backdrop-blur-sm border-b border-cyan-400/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center space-x-4">
                <DecentraMindLogo size="lg" variant="text-only" animated={true} />
              </div>

              {/* Zone Navigation */}
              <div className="hidden md:flex items-center">
                <ZoneNav variant="horizontal" />
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <ZoneNav variant="mobile" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative"
      >
        {children}
      </motion.main>

      {/* Zone Indicator */}
      {showNavigation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <div className="bg-zinc-800/80 backdrop-blur-sm border border-cyan-400/20 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-300 capitalize">
                {zone.replace('-', ' ')} Zone
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ZoneLayout;