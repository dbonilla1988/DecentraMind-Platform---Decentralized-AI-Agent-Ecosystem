'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ZoneCard {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: 'purple' | 'emerald' | 'blue' | 'orange' | 'rose';
}

const zoneCards: ZoneCard[] = [
  {
    icon: '🤖',
    title: 'Explore Agents',
    description: 'Mint & manage intelligent agents.',
    href: '/agents',
    color: 'purple',
  },
  {
    icon: '🔧',
    title: 'Sub-Agents',
    description: 'Extend agents with specialized tools.',
    href: '/agents/sub-agents',
    color: 'emerald',
  },
  {
    icon: '📊',
    title: 'AI Console',
    description: 'Run, evolve, and control your agents.',
    href: '/ai-console',
    color: 'blue',
  },
  {
    icon: '🏛️',
    title: 'Governance',
    description: 'Vote, stake, and propose ecosystem changes.',
    href: '/governance',
    color: 'purple',
  },
  {
    icon: '🛠️',
    title: 'Services',
    description: 'Professional AI & blockchain services.',
    href: '/services',
    color: 'orange',
  },
  {
    icon: '📚',
    title: 'Docs',
    description: 'Read developer guides & tutorials.',
    href: '/docs',
    color: 'rose',
  },
  {
    icon: '👥',
    title: 'Community',
    description: 'Connect, share, and participate.',
    href: '/community',
    color: 'rose',
  },
];

const ZoneCards: React.FC = () => {
  const getColorClasses = (color: ZoneCard['color']) => {
    const colorMap = {
      purple: {
        gradient: 'from-purple-500/20 to-purple-600/20',
        border: 'border-purple-500/30',
        hoverBorder: 'hover:border-purple-400/50',
        text: 'text-purple-300',
        iconBg: 'bg-purple-500/20',
        iconBorder: 'border-purple-400/30',
      },
      emerald: {
        gradient: 'from-emerald-500/20 to-emerald-600/20',
        border: 'border-emerald-500/30',
        hoverBorder: 'hover:border-emerald-400/50',
        text: 'text-emerald-300',
        iconBg: 'bg-emerald-500/20',
        iconBorder: 'border-emerald-400/30',
      },
      blue: {
        gradient: 'from-blue-500/20 to-blue-600/20',
        border: 'border-blue-500/30',
        hoverBorder: 'hover:border-blue-400/50',
        text: 'text-blue-300',
        iconBg: 'bg-blue-500/20',
        iconBorder: 'border-blue-400/30',
      },
      orange: {
        gradient: 'from-orange-500/20 to-orange-600/20',
        border: 'border-orange-500/30',
        hoverBorder: 'hover:border-orange-400/50',
        text: 'text-orange-300',
        iconBg: 'bg-orange-500/20',
        iconBorder: 'border-orange-400/30',
      },
      rose: {
        gradient: 'from-rose-500/20 to-rose-600/20',
        border: 'border-rose-500/30',
        hoverBorder: 'hover:border-rose-400/50',
        text: 'text-rose-300',
        iconBg: 'bg-rose-500/20',
        iconBorder: 'border-rose-400/30',
      },
    };
    return colorMap[color];
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Explore the Ecosystem
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Navigate through our 5 core zones, each designed for specific aspects of the DecentraMind experience
          </p>
        </motion.div>

        {/* Zone Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {zoneCards.map((card, index) => {
            const colors = getColorClasses(card.color);
            
            return (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <Link href={card.href}>
                  <div className={`
                    relative p-8 bg-gradient-to-br ${colors.gradient} 
                    rounded-3xl border ${colors.border} ${colors.hoverBorder}
                    transition-all duration-500 hover:shadow-2xl backdrop-blur-sm
                    h-full flex flex-col
                  `}>
                    {/* Icon */}
                    <div className={`
                      w-16 h-16 ${colors.iconBg} rounded-2xl 
                      flex items-center justify-center border ${colors.iconBorder}
                      mb-6 group-hover:scale-110 transition-transform duration-300
                    `}>
                      <span className="text-3xl">{card.icon}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className={`text-2xl font-bold mb-4 ${colors.text} group-hover:text-white transition-colors duration-300`}>
                        {card.title}
                      </h3>
                      <p className="text-gray-300 mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                        {card.description}
                      </p>
                    </div>

                    {/* Arrow Indicator */}
                    <div className="flex items-center justify-end">
                      <motion.div
                        className={`${colors.text} group-hover:text-white transition-colors duration-300`}
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className={`
                      absolute inset-0 rounded-3xl bg-gradient-to-r ${colors.gradient}
                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                    `} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            Ready to dive deeper? Choose your starting point above.
          </p>
          <div className="flex justify-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-cyan-400 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ZoneCards;
