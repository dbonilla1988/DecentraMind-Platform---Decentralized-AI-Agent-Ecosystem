'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface DecentraMindLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'minimal' | 'text-only' | 'icon-only' | 'image';
  orientation?: 'horizontal' | 'vertical';
  withText?: boolean;
  className?: string;
  animated?: boolean;
  showIcon?: boolean;
  forceInline?: boolean; // New prop to force single line
}

const DecentraMindLogo: React.FC<DecentraMindLogoProps> = ({
  size = 'md',
              variant = 'text-only', // Default to text-only for reliability
  orientation = 'horizontal',
  withText = true,
  className = '',
  animated = true,
  showIcon = false, // New prop to control icon display
  forceInline = true // Default to forcing single line
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-4xl'
  };

  const imageSizes = {
    sm: 'h-12',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32',
    '2xl': 'h-40'
  };

  const LogoIcon = () => (
    <motion.div
      className={`${sizeClasses[size]} bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-lg flex items-center justify-center border border-cyan-400/30 flex-shrink-0`}
      whileHover={animated ? { scale: 1.05 } : {}}
      whileTap={animated ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Official DecentraMind Logo */}
      <img 
        src="/logo.svg" 
        alt="DecentraMind Labs Logo" 
        className="h-auto w-full max-w-full object-contain"
        style={{ filter: 'brightness(1.2) saturate(1.1)' }}
      />
    </motion.div>
  );

  const LogoText = () => (
    <motion.div
      className={`${forceInline ? 'whitespace-nowrap' : ''}`}
      initial={animated ? { opacity: 0, x: 10 } : {}}
      animate={animated ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <span className={`font-bold ${textSizes[size]} tracking-tight whitespace-nowrap`}>
        <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
          DecentraMind
        </span>
        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ml-2">
          Labs
        </span>
      </span>
    </motion.div>
  );

  const LogoTextVertical = () => (
    <motion.div
      className="flex flex-col items-center"
      initial={animated ? { opacity: 0, y: 10 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <span className={`font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent ${textSizes[size]} tracking-tight`}>
        DecentraMind
      </span>
      <span className={`font-semibold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-xs tracking-tight -mt-1`}>
        Labs
      </span>
    </motion.div>
  );

  const LogoImage = () => {
    const [imageError, setImageError] = React.useState(true); // Start with true to force text fallback

    if (imageError) {
      // Fallback to text version if image fails to load
      return orientation === 'vertical' ? <LogoTextVertical /> : <LogoText />;
    }

    return (
      <motion.img
        src="/logo.svg"
        alt="DecentraMind Labs Logo"
        className={`${imageSizes[size]} w-auto object-contain ${animated ? 'animate-fade-in' : ''}`}
        initial={animated ? { opacity: 0, scale: 0.9 } : {}}
        animate={animated ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={animated ? { scale: 1.05 } : {}}
        whileTap={animated ? { scale: 0.95 } : {}}
        onError={() => {
          console.warn('Logo image failed to load, falling back to text version');
          setImageError(true);
        }}
        onLoad={() => {
          console.log('Logo image loaded successfully');
          setImageError(false);
        }}
      />
    );
  };

  const renderVariant = () => {
    switch (variant) {
      case 'minimal':
        return (
          <div className={`flex items-center ${orientation === 'vertical' ? 'flex-col space-y-2' : 'space-x-4'}`}>
            {showIcon && <LogoIcon />}
            {withText && (
              orientation === 'vertical' ? <LogoTextVertical /> : <LogoText />
            )}
          </div>
        );
      
      case 'text-only':
        return orientation === 'vertical' ? <LogoTextVertical /> : <LogoText />;
      
      case 'icon-only':
        return <LogoIcon />;
      
      case 'image':
        return <LogoImage />;
      
      case 'default':
      default:
        return (
          <div className={`flex items-center ${orientation === 'vertical' ? 'flex-col space-y-3' : 'space-x-5'}`}>
            {showIcon && <LogoIcon />}
            {withText && (
              orientation === 'vertical' ? <LogoTextVertical /> : <LogoText />
            )}
          </div>
        );
    }
  };

  return (
    <motion.div
      className={`flex items-center ${className}`}
      initial={animated ? { opacity: 0, scale: 0.9 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {renderVariant()}
    </motion.div>
  );
};

export default DecentraMindLogo;
