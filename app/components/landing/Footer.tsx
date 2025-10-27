'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DecentraMindLogo from '../DecentraMindLogo';

const Footer: React.FC = () => {
  const footerLinks = [
    { name: 'Dashboard', href: '/ai-console' },
    { name: 'Agents', href: '/agents' },
    { name: 'Governance', href: '/governance' },
    { name: 'Docs', href: '/docs' },
    { name: 'Community', href: '/community' },
    { name: 'Metaverse', href: '/metaverse' }, // Added Metaverse link
  ];

  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/50 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
                      {/* Logo */}
                      <div className="flex items-center justify-center mb-8">
                        <DecentraMindLogo size="sm" variant="text-only" />
                      </div>

          {/* Description */}
          <p className="text-gray-400 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
            Building the future of autonomous AI agents and decentralized intelligence.
          </p>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-400 hover:text-purple-300 transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-slate-800/50 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-sm text-gray-500 mb-4 md:mb-0">
              © 2024 DecentraMind Labs. All rights reserved.
            </div>

            {/* Status & Tech Stack */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                <span>Live on Devnet</span>
              </div>
              <div className="text-sm text-gray-500">
                <span>Powered by Solana & Firebase</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-40"
              style={{
                left: `${10 + i * 12}%`,
                bottom: `${20 + (i % 2) * 30}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;