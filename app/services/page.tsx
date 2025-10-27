'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ServicesPage: React.FC = () => {
  const services = [
    {
      id: '1',
      name: 'Agent Development',
      description: 'Custom AI agent development and deployment',
      icon: '🤖',
      price: 'Starting at 500 DMT',
      status: 'Available'
    },
    {
      id: '2',
      name: 'Smart Contract Audit',
      description: 'Comprehensive smart contract security analysis',
      icon: '🔍',
      price: 'Starting at 1000 DMT',
      status: 'Available'
    },
    {
      id: '3',
      name: 'DeFi Integration',
      description: 'Integrate your agents with DeFi protocols',
      icon: '💰',
      price: 'Starting at 750 DMT',
      status: 'Coming Soon'
    },
    {
      id: '4',
      name: 'NFT Minting Service',
      description: 'Professional NFT creation and minting',
      icon: '🎨',
      price: 'Starting at 200 DMT',
      status: 'Available'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Professional services to enhance your DecentraMind experience. From custom agent development 
            to smart contract audits, we've got you covered.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span className="text-white font-semibold">{service.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-semibold ${
                    service.status === 'Available' ? 'text-emerald-400' : 'text-yellow-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={service.status === 'Coming Soon'}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                  service.status === 'Available'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                    : 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                }`}
              >
                {service.status === 'Available' ? 'Request Service' : 'Coming Soon'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Need Custom Services?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Don't see what you're looking for? Contact our team for custom solutions tailored to your specific needs.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg font-medium text-white transition-all duration-300"
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesPage;