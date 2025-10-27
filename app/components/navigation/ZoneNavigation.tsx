'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Bot, 
  Brain, 
  Building2, 
  BookOpen, 
  Users,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface ZoneNavigationProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

// Define the 5 core zones with their configurations
const ZONES = [
  {
    id: 'home',
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Landing Page & Overview',
    color: 'cyan',
    requiresAuth: false
  },
  {
    id: 'agents',
    name: 'AI Agents',
    href: '/agents',
    icon: Bot,
    description: 'Agent Marketplace & Management',
    color: 'purple',
    requiresAuth: true
  },
  {
    id: 'ai-console',
    name: 'AI Console',
    href: '/ai-console',
    icon: Brain,
    description: 'Unified AI Dashboard',
    color: 'emerald',
    requiresAuth: true
  },
  {
    id: 'governance',
    name: 'Governance',
    href: '/governance',
    icon: Building2,
    description: 'Tokenomics & DAO Governance',
    color: 'blue',
    requiresAuth: true
  },
  {
    id: 'docs',
    name: 'Documentation',
    href: '/docs',
    icon: BookOpen,
    description: 'Developer Resources & Guides',
    color: 'orange',
    requiresAuth: false
  },
  {
    id: 'community',
    name: 'Community',
    href: '/community',
    icon: Users,
    description: 'Community Portal & Social',
    color: 'rose',
    requiresAuth: false
  }
];

const ZoneNavigation: React.FC<ZoneNavigationProps> = ({ 
  className = '', 
  variant = 'horizontal' 
}) => {
  const pathname = usePathname();
  const [activeZone, setActiveZone] = useState<string>('');

  // Determine active zone based on current path
  useEffect(() => {
    const determineActiveZone = () => {
      if (pathname === '/') return 'home';
      if (pathname.startsWith('/agents')) return 'agents';
      if (pathname.startsWith('/ai-console')) return 'ai-console';
      if (pathname.startsWith('/governance')) return 'governance';
      if (pathname.startsWith('/docs')) return 'docs';
      if (pathname.startsWith('/community')) return 'community';
      return 'home';
    };

    setActiveZone(determineActiveZone());
  }, [pathname]);

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      cyan: isActive 
        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50' 
        : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10',
      purple: isActive 
        ? 'bg-purple-500/20 text-purple-300 border-purple-400/50' 
        : 'text-gray-400 hover:text-purple-300 hover:bg-purple-500/10',
      emerald: isActive 
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' 
        : 'text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10',
      blue: isActive 
        ? 'bg-blue-500/20 text-blue-300 border-blue-400/50' 
        : 'text-gray-400 hover:text-blue-300 hover:bg-blue-500/10',
      orange: isActive 
        ? 'bg-orange-500/20 text-orange-300 border-orange-400/50' 
        : 'text-gray-400 hover:text-orange-300 hover:bg-orange-500/10',
      rose: isActive 
        ? 'bg-rose-500/20 text-rose-300 border-rose-400/50' 
        : 'text-gray-400 hover:text-rose-300 hover:bg-rose-500/10'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.cyan;
  };

  const renderHorizontalNav = () => (
    <nav className={`flex items-center space-x-1 ${className}`}>
      {ZONES.map((zone) => {
        const isActive = activeZone === zone.id;
        const Icon = zone.icon;
        
        return (
          <motion.div
            key={zone.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={zone.href}
              className={`
                group relative flex items-center space-x-2 px-4 py-3 rounded-lg 
                border transition-all duration-300 font-medium
                ${getColorClasses(zone.color, isActive)}
                ${isActive ? 'shadow-lg' : ''}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:block">{zone.name}</span>
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg"
                  layoutId="activeZone"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );

  const renderVerticalNav = () => (
    <nav className={`flex flex-col space-y-2 ${className}`}>
      {ZONES.map((zone) => {
        const isActive = activeZone === zone.id;
        const Icon = zone.icon;
        
        return (
          <motion.div
            key={zone.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={zone.href}
              className={`
                group relative flex items-center space-x-3 px-4 py-3 rounded-lg 
                border transition-all duration-300 font-medium
                ${getColorClasses(zone.color, isActive)}
                ${isActive ? 'shadow-lg' : ''}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{zone.name}</div>
                <div className="text-xs opacity-75">{zone.description}</div>
              </div>
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg"
                  layoutId="activeZone"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );

  const renderCompactNav = () => (
    <nav className={`flex items-center justify-center space-x-1 ${className}`}>
      {ZONES.map((zone) => {
        const isActive = activeZone === zone.id;
        const Icon = zone.icon;
        
        return (
          <motion.div
            key={zone.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link
              href={zone.href}
              className={`
                group relative flex items-center justify-center w-12 h-12 rounded-lg 
                border transition-all duration-300
                ${getColorClasses(zone.color, isActive)}
                ${isActive ? 'shadow-lg' : ''}
              `}
              title={zone.name}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg"
                  layoutId="activeZoneCompact"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );

  const renderNav = () => {
    switch (variant) {
      case 'vertical':
        return renderVerticalNav();
      case 'compact':
        return renderCompactNav();
      case 'horizontal':
      default:
        return renderHorizontalNav();
    }
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {renderNav()}
      </AnimatePresence>
    </div>
  );
};

export default ZoneNavigation;

