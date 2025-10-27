'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DecentraMindLogo from '../DecentraMindLogo';

const LogoPreview: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg' | 'xl' | '2xl'>('md');
  const [selectedVariant, setSelectedVariant] = useState<'default' | 'minimal' | 'text-only' | 'icon-only'>('default');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [withText, setWithText] = useState(true);
  const [animated, setAnimated] = useState(true);

  const sizes = [
    { key: 'sm', label: 'Small', description: 'Navigation bars, buttons' },
    { key: 'md', label: 'Medium', description: 'Headers, cards' },
    { key: 'lg', label: 'Large', description: 'Hero sections, banners' },
    { key: 'xl', label: 'Extra Large', description: 'Landing pages, presentations' },
    { key: '2xl', label: '2X Large', description: 'Hero sections, main branding' }
  ] as const;

  const variants = [
    { key: 'default', label: 'Default', description: 'Full logo with icon and text' },
    { key: 'minimal', label: 'Minimal', description: 'Clean, simplified version' },
    { key: 'text-only', label: 'Text Only', description: 'Just the text branding' },
    { key: 'icon-only', label: 'Icon Only', description: 'Just the logo icon' }
  ] as const;

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            DecentraMind Logo Preview
          </h1>
          <p className="text-gray-400 text-lg">
            Test different logo configurations and see how they look
          </p>
        </motion.div>

        {/* Controls */}
        <div className="bg-zinc-800/50 rounded-xl p-6 mb-8 border border-zinc-700/50">
          <h2 className="text-xl font-semibold mb-6 text-cyan-300">Configuration Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Size Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Size</label>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <label key={size.key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      value={size.key}
                      checked={selectedSize === size.key}
                      onChange={(e) => setSelectedSize(e.target.value as any)}
                      className="text-cyan-400 focus:ring-cyan-400"
                    />
                    <div>
                      <div className="text-sm font-medium text-white">{size.label}</div>
                      <div className="text-xs text-gray-400">{size.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Variant Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Variant</label>
              <div className="space-y-2">
                {variants.map((variant) => (
                  <label key={variant.key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="variant"
                      value={variant.key}
                      checked={selectedVariant === variant.key}
                      onChange={(e) => setSelectedVariant(e.target.value as any)}
                      className="text-cyan-400 focus:ring-cyan-400"
                    />
                    <div>
                      <div className="text-sm font-medium text-white">{variant.label}</div>
                      <div className="text-xs text-gray-400">{variant.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Orientation Control */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Orientation</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="orientation"
                    value="horizontal"
                    checked={orientation === 'horizontal'}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className="text-cyan-400 focus:ring-cyan-400"
                  />
                  <span className="text-sm text-white">Horizontal</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="orientation"
                    value="vertical"
                    checked={orientation === 'vertical'}
                    onChange={(e) => setOrientation(e.target.value as any)}
                    className="text-cyan-400 focus:ring-cyan-400"
                  />
                  <span className="text-sm text-white">Vertical</span>
                </label>
              </div>
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={withText}
                    onChange={(e) => setWithText(e.target.checked)}
                    className="text-cyan-400 focus:ring-cyan-400 rounded"
                  />
                  <span className="text-sm text-white">With Text</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animated}
                    onChange={(e) => setAnimated(e.target.checked)}
                    className="text-cyan-400 focus:ring-cyan-400 rounded"
                  />
                  <span className="text-sm text-white">Animated</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-zinc-800/30 rounded-xl p-8 mb-8 border border-zinc-700/50">
          <h2 className="text-xl font-semibold mb-6 text-cyan-300">Live Preview</h2>
          
          <div className="flex flex-col items-center justify-center min-h-[200px] bg-zinc-900/50 rounded-lg border border-zinc-700/30">
            <DecentraMindLogo
              size={selectedSize}
              variant={selectedVariant}
              orientation={orientation}
              withText={withText}
              animated={animated}
            />
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-zinc-800/30 rounded-xl p-8 border border-zinc-700/50">
          <h2 className="text-xl font-semibold mb-6 text-cyan-300">Usage Examples</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Navigation Example */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/30">
              <h3 className="text-lg font-medium mb-4 text-purple-300">Navigation Bar</h3>
              <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded border border-zinc-700/30">
                <DecentraMindLogo size="sm" variant="minimal" />
                <div className="flex space-x-4 text-sm text-gray-400">
                  <span>Home</span>
                  <span>Agents</span>
                  <span>Console</span>
                </div>
              </div>
            </div>

            {/* Hero Section Example */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/30">
              <h3 className="text-lg font-medium mb-4 text-purple-300">Hero Section</h3>
              <div className="text-center p-6 bg-zinc-800/50 rounded border border-zinc-700/30">
                <DecentraMindLogo size="xl" variant="default" className="mb-4" />
                <p className="text-sm text-gray-400">The Swiss Army of AI Agents</p>
              </div>
            </div>

            {/* Footer Example */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/30">
              <h3 className="text-lg font-medium mb-4 text-purple-300">Footer</h3>
              <div className="text-center p-4 bg-zinc-800/50 rounded border border-zinc-700/30">
                <DecentraMindLogo size="md" variant="minimal" className="mb-2" />
                <p className="text-xs text-gray-500">© 2024 DecentraMind Labs</p>
              </div>
            </div>

            {/* Card Header Example */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-700/30">
              <h3 className="text-lg font-medium mb-4 text-purple-300">Card Header</h3>
              <div className="p-4 bg-zinc-800/50 rounded border border-zinc-700/30">
                <div className="flex items-center space-x-3 mb-3">
                  <DecentraMindLogo size="sm" variant="icon-only" />
                  <div>
                    <h4 className="font-medium text-white">Agent Dashboard</h4>
                    <p className="text-xs text-gray-400">Manage your AI agents</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">Card content goes here...</div>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-zinc-800/30 rounded-xl p-8 mt-8 border border-zinc-700/50">
          <h2 className="text-xl font-semibold mb-6 text-cyan-300">Code Example</h2>
          <pre className="bg-zinc-900/50 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto border border-zinc-700/30">
            <code>{`<DecentraMindLogo
  size="${selectedSize}"
  variant="${selectedVariant}"
  orientation="${orientation}"
  withText={${withText}}
  animated={${animated}}
  className="custom-class"
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default LogoPreview;
