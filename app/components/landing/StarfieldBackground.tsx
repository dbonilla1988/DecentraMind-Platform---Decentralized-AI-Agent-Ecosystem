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

const StarfieldBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const starsRef = useRef<Star[]>([]);

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
      const numStars = Math.floor((canvas.width * canvas.height) / 10000);
      
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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      starsRef.current.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    animate();

    const handleResize = () => {
      resizeCanvas();
      createStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f23 50%, #000000 100%)' }}
      />
      
      {/* Floating particles overlay */}
      <div className="absolute inset-0">
        {[
          { left: 10, top: 20, delay: 0, duration: 3 },
          { left: 25, top: 60, delay: 0.5, duration: 4 },
          { left: 40, top: 30, delay: 1, duration: 3.5 },
          { left: 60, top: 80, delay: 1.5, duration: 4.5 },
          { left: 80, top: 15, delay: 2, duration: 3.2 },
          { left: 15, top: 75, delay: 0.8, duration: 4.2 },
          { left: 35, top: 45, delay: 1.2, duration: 3.8 },
          { left: 55, top: 25, delay: 1.8, duration: 4.8 },
          { left: 75, top: 65, delay: 2.2, duration: 3.3 },
          { left: 90, top: 40, delay: 2.5, duration: 4.1 },
          { left: 5, top: 50, delay: 0.3, duration: 3.7 },
          { left: 30, top: 10, delay: 0.7, duration: 4.3 },
          { left: 50, top: 70, delay: 1.3, duration: 3.9 },
          { left: 70, top: 35, delay: 1.7, duration: 4.4 },
          { left: 85, top: 55, delay: 2.1, duration: 3.6 },
          { left: 20, top: 85, delay: 0.9, duration: 4.6 },
          { left: 45, top: 5, delay: 1.4, duration: 3.4 },
          { left: 65, top: 90, delay: 1.9, duration: 4.7 },
          { left: 95, top: 25, delay: 2.3, duration: 3.1 },
          { left: 12, top: 40, delay: 0.6, duration: 4.9 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StarfieldBackground;
