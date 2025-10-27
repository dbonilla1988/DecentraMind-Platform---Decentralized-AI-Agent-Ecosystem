'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Bot, 
  LayoutDashboard, 
  Building2, 
  BookOpen,
  Users,
  Menu,
  X,
  Hospital
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ZoneNavProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'mobile';
}

// Define the 5 core zones
const ZONES = [
  {
    id: 'home',
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Landing Page & Overview',
    color: 'cyan',
    emoji: '🏠'
  },
  {
    id: 'agents',
    name: 'Agents',
    href: '/agents',
    icon: Bot,
    description: 'AI Agent Marketplace',
    color: 'purple',
    emoji: '🤖'
  },
  {
    id: 'ai-console',
    name: 'AI Console',
    href: '/ai-console',
    icon: LayoutDashboard,
    description: 'Dashboard Suite',
    color: 'emerald',
    emoji: '📊'
  },
  {
    id: 'governance',
    name: 'Governance',
    href: '/governance',
    icon: Building2,
    description: 'Tokenomics & DAO',
    color: 'blue',
    emoji: '🏛️'
  },
  {
    id: 'hospital',
    name: 'Hospital',
    href: '/hospital',
    icon: Hospital,
    description: 'Healthcare Integration',
    color: 'green',
    emoji: '🏥'
  },
  {
    id: 'metaverse',
    name: 'Metaverse',
    href: '/metaverse',
    icon: Users, // Using Users icon as placeholder
    description: '3D Virtual Environments',
    color: 'indigo',
    emoji: '🌐'
  },
  {
    id: 'docs',
    name: 'Docs',
    href: '/docs',
    icon: BookOpen,
    description: 'Documentation',
    color: 'orange',
    emoji: '📚'
  }
];

const ZoneNav: React.FC<ZoneNavProps> = ({ 
  className = '', 
  variant = 'horizontal' 
}) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Determine active zone based on current path
  const getActiveZone = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/agents')) return 'agents';
    if (pathname.startsWith('/ai-console')) return 'ai-console';
    if (pathname.startsWith('/marketplace')) return 'agents'; // Marketplace falls under agents
    if (pathname.startsWith('/services')) return 'agents'; // Services falls under agents
    if (pathname.startsWith('/governance')) return 'governance';
    if (pathname.startsWith('/dao')) return 'governance'; // DAO falls under governance
    if (pathname.startsWith('/staking')) return 'governance'; // Staking falls under governance
    if (pathname.startsWith('/airdrop')) return 'governance'; // Airdrop falls under governance
    if (pathname.startsWith('/onboarding/hospital')) return 'hospital'; // Hospital onboarding
    if (pathname.startsWith('/admin/hospital')) return 'hospital'; // Hospital admin
    if (pathname.startsWith('/provider/workspace')) return 'hospital'; // Provider workspace
    if (pathname.startsWith('/patient/pwa')) return 'hospital'; // Patient PWA
    if (pathname.startsWith('/profile')) return 'docs'; // Profile falls under docs
    if (pathname.startsWith('/xp')) return 'docs'; // XP falls under docs
    if (pathname.startsWith('/settings')) return 'docs'; // Settings falls under docs
    if (pathname.startsWith('/metaverse')) return 'metaverse';
    if (pathname.startsWith('/docs')) return 'docs';
    if (pathname.startsWith('/community')) return 'docs'; // Community falls under docs
    return 'home';
  };

  const activeZone = getActiveZone();

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      cyan: isActive 
        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-lg shadow-cyan-400/10' 
        : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10',
      purple: isActive 
        ? 'bg-purple-500/20 text-purple-300 border-purple-400/50 shadow-lg shadow-purple-400/10' 
        : 'text-gray-400 hover:text-purple-300 hover:bg-purple-500/10',
      emerald: isActive 
        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-lg shadow-emerald-400/10' 
        : 'text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/10',
      blue: isActive 
        ? 'bg-blue-500/20 text-blue-300 border-blue-400/50 shadow-lg shadow-blue-400/10' 
        : 'text-gray-400 hover:text-blue-300 hover:bg-blue-500/10',
      green: isActive 
        ? 'bg-green-500/20 text-green-300 border-green-400/50 shadow-lg shadow-green-400/10' 
        : 'text-gray-400 hover:text-green-300 hover:bg-green-500/10',
      orange: isActive 
        ? 'bg-orange-500/20 text-orange-300 border-orange-400/50 shadow-lg shadow-orange-400/10' 
        : 'text-gray-400 hover:text-orange-300 hover:bg-orange-500/10',
      indigo: isActive 
        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/50 shadow-lg shadow-indigo-400/10' 
        : 'text-gray-400 hover:text-indigo-300 hover:bg-indigo-500/10'
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
            <div className="relative group">
              <Link
                href={zone.href}
                className={cn(
                  "group relative flex items-center space-x-2 px-4 py-2.5 rounded-lg",
                  "border transition-all duration-300 font-medium text-sm",
                  getColorClasses(zone.color, isActive)
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden sm:block">{zone.name}</span>
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg"
                    layoutId="activeZone"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
              
              {/* Sub-navigation for Agents */}
              {zone.id === 'agents' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-2">
                    <Link
                      href="/agents"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">🤖</span>
                      <div>
                        <div className="font-medium">All Agents</div>
                        <div className="text-xs text-gray-400">Master Agent Marketplace</div>
                      </div>
                    </Link>
                    <Link
                      href="/agents/sub-agents"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">🔧</span>
                      <div>
                        <div className="font-medium">Sub-Agents</div>
                        <div className="text-xs text-gray-400">Specialized AI Agents</div>
                      </div>
                    </Link>
                    <Link
                      href="/agents/care-orchestrator"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">🏥</span>
                      <div>
                        <div className="font-medium">Care Orchestrator</div>
                        <div className="text-xs text-gray-400">Health & Wellness</div>
                      </div>
                    </Link>
                    <Link
                      href="/agents/autonomous-cfo"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">💰</span>
                      <div>
                        <div className="font-medium">Autonomous CFO</div>
                        <div className="text-xs text-gray-400">Finance & DeFi</div>
                      </div>
                    </Link>
                    <Link
                      href="/agents/crypto-alpha-assistant"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">₿</span>
                      <div>
                        <div className="font-medium">Crypto Alpha Assistant</div>
                        <div className="text-xs text-gray-400">Crypto Intelligence</div>
                      </div>
                    </Link>
                    <Link
                      href="/marketplace"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">🛒</span>
                      <div>
                        <div className="font-medium">Marketplace</div>
                        <div className="text-xs text-gray-400">NFT Trading & Resale</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}

              {/* Sub-navigation for Hospital */}
              {zone.id === 'hospital' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-2">
                    <Link
                      href="/hospital"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">🏥</span>
                      <div>
                        <div className="font-medium">Hospital Hub</div>
                        <div className="text-xs text-gray-400">Integration Overview</div>
                      </div>
                    </Link>
                    <Link
                      href="/onboarding/hospital"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">🛠️</span>
                      <div>
                        <div className="font-medium">Onboarding Wizard</div>
                        <div className="text-xs text-gray-400">Hospital Setup & Activation</div>
                      </div>
                    </Link>
                    <Link
                      href="/admin/hospital"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">🧑‍💼</span>
                      <div>
                        <div className="font-medium">Admin Console</div>
                        <div className="text-xs text-gray-400">Hospital Management</div>
                      </div>
                    </Link>
                    <Link
                      href="/provider/workspace"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">👨‍⚕️</span>
                      <div>
                        <div className="font-medium">Provider Workspace</div>
                        <div className="text-xs text-gray-400">Doctor & Nurse Interface</div>
                      </div>
                    </Link>
                    <Link
                      href="/patient/pwa"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-lg">👩‍⚕️</span>
                      <div>
                        <div className="font-medium">Patient PWA</div>
                        <div className="text-xs text-gray-400">Patient Portal</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
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
              className={cn(
                "group relative flex items-center space-x-3 px-4 py-3 rounded-lg",
                "border transition-all duration-300 font-medium",
                getColorClasses(zone.color, isActive)
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{zone.name}</div>
                <div className="text-xs opacity-75">{zone.description}</div>
              </div>
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg"
                  layoutId="activeZoneVertical"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );

  const renderMobileNav = () => (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-cyan-900/20 transition-colors"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            className="absolute right-0 top-0 h-full w-80 bg-zinc-900 border-l border-cyan-400/20 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-xl flex items-center justify-center border border-cyan-400/30">
                  <Bot className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-cyan-300">DecentraMind</h1>
                  <p className="text-xs text-gray-400">5-Zone Platform</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
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
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "group relative flex items-center space-x-3 px-4 py-3 rounded-lg",
                        "border transition-all duration-300 font-medium",
                        getColorClasses(zone.color, isActive)
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{zone.name}</div>
                        <div className="text-xs opacity-75">{zone.description}</div>
                      </div>
                      <span className="text-lg">{zone.emoji}</span>
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-lg"
                          layoutId="activeZoneMobile"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="text-center text-xs text-gray-500">
                DecentraMind Labs • AI + Blockchain Platform
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );

  const renderNav = () => {
    switch (variant) {
      case 'vertical':
        return renderVerticalNav();
      case 'mobile':
        return renderMobileNav();
      case 'horizontal':
      default:
        return renderHorizontalNav();
    }
  };

  return (
    <div className="relative">
      {renderNav()}
    </div>
  );
};

export default ZoneNav;
