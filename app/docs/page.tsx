'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  BookOpen, 
  Code, 
  Users, 
  Zap, 
  Shield, 
  Coins, 
  Bot, 
  FileText,
  ArrowRight,
  ExternalLink,
  Download,
  Play,
  CheckCircle
} from 'lucide-react';

import ZoneLayout from '../components/layout/ZoneLayout';

const DocsPage = () => {
  const docSections = [
    {
      title: 'Getting Started',
      description: 'Quick start guide for new users',
      icon: Play,
      color: 'emerald',
      items: [
        { title: 'Installation Guide', href: '/docs/installation', status: 'ready' },
        { title: 'First Agent Creation', href: '/docs/first-agent', status: 'ready' },
        { title: 'Wallet Connection', href: '/docs/wallet-setup', status: 'ready' },
        { title: 'Basic Workflows', href: '/docs/basic-workflows', status: 'ready' }
      ]
    },
    {
      title: 'AI Agents',
      description: 'Comprehensive agent documentation',
      icon: Bot,
      color: 'purple',
      items: [
        { title: 'Agent Architecture', href: '/docs/agent-architecture', status: 'ready' },
        { title: 'Agent Types & Capabilities', href: '/docs/agent-types', status: 'ready' },
        { title: 'Custom Agent Development', href: '/docs/custom-agents', status: 'ready' },
        { title: 'Agent Marketplace', href: '/docs/agent-marketplace', status: 'ready' },
        { title: 'Agent Evolution & Learning', href: '/docs/agent-evolution', status: 'ready' }
      ]
    },
    {
      title: 'Tokenomics & Governance',
      description: 'Token economics and DAO governance',
      icon: Coins,
      color: 'cyan',
      items: [
        { title: 'Token Economics Whitepaper', href: '/docs/tokenomics-whitepaper', status: 'ready' },
        { title: 'Staking Mechanisms', href: '/docs/staking', status: 'ready' },
        { title: 'DAO Governance Process', href: '/docs/dao-governance', status: 'ready' },
        { title: 'Voting & Proposals', href: '/docs/voting', status: 'ready' },
        { title: 'Treasury Management', href: '/docs/treasury', status: 'ready' }
      ]
    },
    {
      title: 'Developer Resources',
      description: 'Technical documentation for developers',
      icon: Code,
      color: 'blue',
      items: [
        { title: 'API Reference', href: '/docs/api-reference', status: 'ready' },
        { title: 'SDK Documentation', href: '/docs/sdk', status: 'ready' },
        { title: 'Smart Contract Integration', href: '/docs/smart-contracts', status: 'ready' },
        { title: 'Webhook Configuration', href: '/docs/webhooks', status: 'ready' },
        { title: 'Testing & Debugging', href: '/docs/testing', status: 'ready' }
      ]
    },
    {
      title: 'Community & Support',
      description: 'Community resources and support',
      icon: Users,
      color: 'rose',
      items: [
        { title: 'Community Guidelines', href: '/docs/community-guidelines', status: 'ready' },
        { title: 'Contributing Guide', href: '/docs/contributing', status: 'ready' },
        { title: 'FAQ & Troubleshooting', href: '/docs/faq', status: 'ready' },
        { title: 'Support Channels', href: '/docs/support', status: 'ready' },
        { title: 'Bug Reports', href: '/docs/bug-reports', status: 'ready' }
      ]
    },
    {
      title: 'Security & Compliance',
      description: 'Security best practices and compliance',
      icon: Shield,
      color: 'orange',
      items: [
        { title: 'Security Audit Reports', href: '/docs/security-audits', status: 'ready' },
        { title: 'Privacy Policy', href: '/docs/privacy', status: 'ready' },
        { title: 'Terms of Service', href: '/docs/terms', status: 'ready' },
        { title: 'Compliance Framework', href: '/docs/compliance', status: 'ready' }
      ]
    }
  ];

  const quickLinks = [
    { title: 'API Documentation', href: '/docs/api', icon: Code, description: 'Complete API reference' },
    { title: 'Agent SDK', href: '/docs/sdk', icon: Bot, description: 'Build custom agents' },
    { title: 'Tokenomics Whitepaper', href: '/docs/tokenomics', icon: FileText, description: 'Economic model details' },
    { title: 'Community Forum', href: '/community/forum', icon: Users, description: 'Get help from community' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'coming-soon':
        return <div className="w-4 h-4 bg-yellow-400 rounded-full" />;
      case 'draft':
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <ZoneLayout zone="docs">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-2xl flex items-center justify-center border border-cyan-400/30 mr-4">
                <BookOpen className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Documentation
                </h1>
                <p className="text-gray-400 text-lg mt-2">
                  Everything you need to build with DecentraMind
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Link
                  href={link.href}
                  className="block bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <link.icon className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {link.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-gray-400 text-sm">{link.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Documentation Sections */}
        <div className="space-y-8">
          {docSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + sectionIndex * 0.1 }}
              className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-br from-${section.color}-500/20 to-${section.color}-600/20 rounded-xl flex items-center justify-center border border-${section.color}-400/30`}>
                  <section.icon className={`w-6 h-6 text-${section.color}-400`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  <p className="text-gray-400">{section.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + sectionIndex * 0.1 + itemIndex * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Link
                      href={item.href}
                      className="block bg-slate-700/30 rounded-xl p-4 border border-slate-600/30 hover:border-cyan-400/50 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-white group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {item.status === 'ready' ? 'Ready to read' : 
                         item.status === 'coming-soon' ? 'Coming soon' : 
                         'In development'}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-2xl p-8 border border-cyan-400/30"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center border border-emerald-400/30 mx-auto mb-4">
                <Download className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Download SDK</h3>
              <p className="text-gray-400 text-sm mb-4">Get the latest SDK and start building</p>
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors">
                Download
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-purple-400/30 mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">GitHub Repository</h3>
              <p className="text-gray-400 text-sm mb-4">View source code and contribute</p>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
                View on GitHub
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-blue-400/30 mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Join Community</h3>
              <p className="text-gray-400 text-sm mb-4">Connect with other developers</p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                Join Discord
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </ZoneLayout>
  );
};

export default DocsPage;
