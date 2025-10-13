'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  type: 'neural-node' | 'blockchain-block' | 'ai-agent' | 'data-stream' | 'quantum-particle';
  size: number;
  opacity: number;
  speed: number;
  rotation: number;
}

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);
  const floatingElementsRef = useRef<FloatingElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      const stars: Star[] = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 8000);
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.5 + 0.1,
        });
      }
      starsRef.current = stars;
    };

    const createFloatingElements = () => {
      const elements: FloatingElement[] = [];
      const numElements = 25;
      
      const elementTypes: FloatingElement['type'][] = [
        'neural-node', 'blockchain-block', 'ai-agent', 'data-stream', 'quantum-particle'
      ];
      
      for (let i = 0; i < numElements; i++) {
        elements.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          type: elementTypes[Math.floor(Math.random() * elementTypes.length)],
          size: Math.random() * 8 + 4,
          opacity: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.3 + 0.1,
          rotation: Math.random() * 360,
        });
      }
      floatingElementsRef.current = elements;
    };

    const drawStar = (star: Star) => {
      ctx.save();
      ctx.globalAlpha = star.opacity;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#60a5fa';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawNeuralNode = (element: FloatingElement) => {
      ctx.save();
      ctx.globalAlpha = element.opacity;
      ctx.translate(element.x, element.y);
      ctx.rotate((element.rotation * Math.PI) / 180);
      
      // Main node
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, element.size);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(0.5, '#3b82f6');
      gradient.addColorStop(1, '#06b6d4');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, element.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Neural connections
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 1;
      ctx.globalAlpha = element.opacity * 0.5;
      
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI * 2) / 4;
        const endX = Math.cos(angle) * element.size * 2;
        const endY = Math.sin(angle) * element.size * 2;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
      
      ctx.restore();
    };

    const drawBlockchainBlock = (element: FloatingElement) => {
      ctx.save();
      ctx.globalAlpha = element.opacity;
      ctx.translate(element.x, element.y);
      ctx.rotate((element.rotation * Math.PI) / 180);
      
      // Block body
      ctx.fillStyle = '#10b981';
      ctx.fillRect(-element.size, -element.size * 0.6, element.size * 2, element.size * 1.2);
      
      // Block details
      ctx.fillStyle = '#059669';
      ctx.fillRect(-element.size * 0.8, -element.size * 0.4, element.size * 1.6, element.size * 0.2);
      ctx.fillRect(-element.size * 0.8, element.size * 0.2, element.size * 1.6, element.size * 0.2);
      
      // Chain link
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(element.size * 1.2, 0, element.size * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.restore();
    };

    const drawAIAgent = (element: FloatingElement) => {
      ctx.save();
      ctx.globalAlpha = element.opacity;
      ctx.translate(element.x, element.y);
      ctx.rotate((element.rotation * Math.PI) / 180);
      
      // Agent body (hexagon)
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, element.size);
      gradient.addColorStop(0, '#f59e0b');
      gradient.addColorStop(1, '#d97706');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const x = Math.cos(angle) * element.size;
        const y = Math.sin(angle) * element.size;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      
      // AI eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, element.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(0, 0, element.size * 0.15, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const drawDataStream = (element: FloatingElement) => {
      ctx.save();
      ctx.globalAlpha = element.opacity;
      ctx.translate(element.x, element.y);
      
      // Data particles
      ctx.fillStyle = '#06b6d4';
      for (let i = 0; i < 5; i++) {
        const offset = (i * element.size * 0.5) - (element.size * 0.5);
        ctx.beginPath();
        ctx.arc(offset, Math.sin(element.rotation * 0.1 + i) * 10, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Connection line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1;
      ctx.globalAlpha = element.opacity * 0.3;
      ctx.beginPath();
      ctx.moveTo(-element.size, 0);
      ctx.lineTo(element.size, 0);
      ctx.stroke();
      
      ctx.restore();
    };

    const drawQuantumParticle = (element: FloatingElement) => {
      ctx.save();
      ctx.globalAlpha = element.opacity;
      ctx.translate(element.x, element.y);
      
      // Quantum core
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, element.size);
      gradient.addColorStop(0, '#ec4899');
      gradient.addColorStop(0.5, '#8b5cf6');
      gradient.addColorStop(1, '#3b82f6');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, element.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Quantum trail
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 2;
      ctx.globalAlpha = element.opacity * 0.5;
      ctx.beginPath();
      ctx.moveTo(-element.size * 2, 0);
      ctx.lineTo(element.size * 2, 0);
      ctx.stroke();
      
      ctx.restore();
    };

    const drawFloatingElement = (element: FloatingElement) => {
      switch (element.type) {
        case 'neural-node':
          drawNeuralNode(element);
          break;
        case 'blockchain-block':
          drawBlockchainBlock(element);
          break;
        case 'ai-agent':
          drawAIAgent(element);
          break;
        case 'data-stream':
          drawDataStream(element);
          break;
        case 'quantum-particle':
          drawQuantumParticle(element);
          break;
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      starsRef.current.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        drawStar(star);
      });
      
      // Draw floating elements
      floatingElementsRef.current.forEach(element => {
        element.y += element.speed;
        element.rotation += element.speed * 2;
        
        if (element.y > canvas.height) {
          element.y = -element.size;
          element.x = Math.random() * canvas.width;
        }
        
        drawFloatingElement(element);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    createFloatingElements();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createStars();
      createFloatingElements();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Deep space gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 via-blue-900 to-slate-900" />
      
      {/* Animated nebula layers */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-cyan-500/30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
      </div>
      
      {/* Holographic grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Canvas for animated elements */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />
      
      {/* Additional floating CSS elements */}
      <div className="absolute inset-0">
        {/* Large floating neural networks */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`neural-${i}`}
            className="absolute w-32 h-32 opacity-20"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="3" fill="#8b5cf6" />
              <circle cx="20" cy="30" r="2" fill="#3b82f6" />
              <circle cx="80" cy="30" r="2" fill="#06b6d4" />
              <circle cx="20" cy="70" r="2" fill="#10b981" />
              <circle cx="80" cy="70" r="2" fill="#f59e0b" />
              <line x1="50" y1="50" x2="20" y2="30" stroke="#8b5cf6" strokeWidth="0.5" opacity="0.6" />
              <line x1="50" y1="50" x2="80" y2="30" stroke="#3b82f6" strokeWidth="0.5" opacity="0.6" />
              <line x1="50" y1="50" x2="20" y2="70" stroke="#06b6d4" strokeWidth="0.5" opacity="0.6" />
              <line x1="50" y1="50" x2="80" y2="70" stroke="#10b981" strokeWidth="0.5" opacity="0.6" />
            </svg>
          </motion.div>
        ))}
        
        {/* Floating blockchain blocks */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`block-${i}`}
            className="absolute w-8 h-6 bg-gradient-to-r from-emerald-500/30 to-green-500/30 rounded-sm"
            style={{
              left: `${15 + i * 20}%`,
              top: `${60 + i * 10}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1,
            }}
          />
        ))}
        
        {/* Quantum particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`quantum-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + i * 12}%`,
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 6 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StarfieldBackground;