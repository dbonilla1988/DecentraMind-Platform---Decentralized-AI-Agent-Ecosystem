'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  background: string;
}

interface AudioTheme {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: number;
}

const ThemeCustomizer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('cosmic');
  const [selectedAudio, setSelectedAudio] = useState('meditation');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.08);

  const themeOptions: ThemeOption[] = [
    {
      id: 'cosmic',
      name: 'Cosmic',
      description: 'Deep space with stars and nebulas',
      icon: '🌌',
      color: 'from-blue-500 to-purple-500',
      background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f23 50%, #000000 100%)',
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Organic elements with natural patterns',
      icon: '🌿',
      color: 'from-green-500 to-emerald-500',
      background: 'radial-gradient(ellipse at center, #0f2e0f 0%, #0a1a0a 50%, #000000 100%)',
    },
    {
      id: 'neon',
      name: 'Neon',
      description: 'Cyberpunk with glowing elements',
      icon: '⚡',
      color: 'from-cyan-500 to-pink-500',
      background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #050510 50%, #000000 100%)',
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple design',
      icon: '⚪',
      color: 'from-gray-500 to-slate-500',
      background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0f0f0f 50%, #000000 100%)',
    },
  ];

  const audioThemes: AudioTheme[] = [
    {
      id: 'meditation',
      name: 'Meditation',
      description: 'Calm, wind-like frequencies',
      icon: '🧘',
      color: 'from-green-500 to-blue-500',
      frequency: 60,
    },
    {
      id: 'synthwave',
      name: 'Synthwave',
      description: 'Retro electronic vibes',
      icon: '🎵',
      color: 'from-pink-500 to-purple-500',
      frequency: 120,
    },
    {
      id: 'ambient',
      name: 'Ambient',
      description: 'Atmospheric soundscapes',
      icon: '🌊',
      color: 'from-cyan-500 to-teal-500',
      frequency: 80,
    },
    {
      id: 'silence',
      name: 'Silence',
      description: 'No audio',
      icon: '🔇',
      color: 'from-gray-500 to-slate-500',
      frequency: 0,
    },
  ];

  const createAudioDataUrl = (frequency: number, duration: number = 8) => {
    if (frequency === 0) return null;
    
    const sampleRate = 44100;
    const samples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    view.setUint32(12, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate audio based on theme
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      if (selectedAudio === 'meditation') {
        // Wind-like frequencies
        for (let band = 0; band < 5; band++) {
          const freq = frequency + band * 40;
          const amplitude = 0.02 / (band + 1);
          const randomPhase = Math.sin(t * 0.05 + band) * 0.1;
          const wave = Math.sin(2 * Math.PI * freq * t + randomPhase) * amplitude;
          const envelope = Math.sin(Math.PI * t / duration) * 0.6 + 0.4;
          sample += wave * envelope;
        }
      } else if (selectedAudio === 'synthwave') {
        // Retro electronic sound
        const wave1 = Math.sin(2 * Math.PI * frequency * t) * 0.1;
        const wave2 = Math.sin(2 * Math.PI * frequency * 2 * t) * 0.05;
        const wave3 = Math.sin(2 * Math.PI * frequency * 4 * t) * 0.025;
        sample = wave1 + wave2 + wave3;
      } else if (selectedAudio === 'ambient') {
        // Atmospheric sound
        const wave1 = Math.sin(2 * Math.PI * frequency * t) * 0.08;
        const wave2 = Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.04;
        const noise = (Math.random() - 0.5) * 0.02;
        sample = wave1 + wave2 + noise;
      }
      
      sample = Math.tanh(sample * 2) * 0.5;
      view.setInt16(44 + i * 2, sample * 32767, true);
    }
    
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  const toggleAudio = () => {
    if (selectedAudio === 'silence') return;
    
    setIsAudioPlaying(!isAudioPlaying);
    
    if (!isAudioPlaying) {
      const audioDataUrl = createAudioDataUrl(audioThemes.find(a => a.id === selectedAudio)?.frequency || 60);
      if (audioDataUrl) {
        const audio = new Audio(audioDataUrl);
        audio.loop = true;
        audio.volume = audioVolume;
        audio.play().catch(() => {
          console.log('Audio playback not supported');
        });
      }
    }
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    // In a real app, this would update the global theme context
    console.log('Theme changed to:', themeId);
  };

  const handleAudioChange = (audioId: string) => {
    setSelectedAudio(audioId);
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      // Stop current audio and start new one
      setTimeout(() => {
        setIsAudioPlaying(true);
      }, 100);
    }
  };

  return (
    <>
      {/* Theme Customizer Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            "0 0 20px rgba(139, 92, 246, 0.4)",
            "0 0 40px rgba(139, 92, 246, 0.6)",
            "0 0 20px rgba(139, 92, 246, 0.4)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-2xl">🎨</span>
      </motion.button>

      {/* Theme Customizer Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border border-slate-700/50 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Theme Customizer</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Visual Themes */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Visual Themes</h3>
                  <div className="space-y-4">
                    {themeOptions.map((theme) => (
                      <motion.button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                          selectedTheme === theme.id
                            ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50'
                            : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-slate-600/50 hover:border-slate-500/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${theme.color} flex items-center justify-center mr-4`}>
                            <span className="text-xl">{theme.icon}</span>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-white">{theme.name}</div>
                            <div className="text-sm text-gray-400">{theme.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Audio Themes */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-6">Audio Themes</h3>
                  <div className="space-y-4">
                    {audioThemes.map((audio) => (
                      <motion.button
                        key={audio.id}
                        onClick={() => handleAudioChange(audio.id)}
                        className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                          selectedAudio === audio.id
                            ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/50'
                            : 'bg-gradient-to-br from-slate-700/50 to-slate-800/50 border-slate-600/50 hover:border-slate-500/50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${audio.color} flex items-center justify-center mr-4`}>
                              <span className="text-xl">{audio.icon}</span>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-white">{audio.name}</div>
                              <div className="text-sm text-gray-400">{audio.description}</div>
                            </div>
                          </div>
                          {audio.id !== 'silence' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAudio();
                              }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isAudioPlaying && selectedAudio === audio.id
                                  ? 'bg-green-500 text-white'
                                  : 'bg-slate-600 text-gray-400 hover:bg-slate-500'
                              }`}
                            >
                              {isAudioPlaying && selectedAudio === audio.id ? '⏸️' : '▶️'}
                            </button>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Volume Control */}
                  {selectedAudio !== 'silence' && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Volume: {Math.round(audioVolume * 100)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="0.2"
                        step="0.01"
                        value={audioVolume}
                        onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="mt-8 p-6 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-slate-600/50">
                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${themeOptions.find(t => t.id === selectedTheme)?.color} flex items-center justify-center`}>
                    <span className="text-2xl">{themeOptions.find(t => t.id === selectedTheme)?.icon}</span>
                  </div>
                  <div>
                    <div className="text-white font-semibold">
                      {themeOptions.find(t => t.id === selectedTheme)?.name} + {audioThemes.find(a => a.id === selectedAudio)?.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {themeOptions.find(t => t.id === selectedTheme)?.description}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ThemeCustomizer;


