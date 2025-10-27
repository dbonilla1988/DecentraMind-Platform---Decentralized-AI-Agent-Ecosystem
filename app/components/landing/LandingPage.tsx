'use client';

import React from 'react';
import HeroSection from './HeroSection';
import ZoneCards from './ZoneCards';
import LiveStatsSection from './LiveStatsSection';
import AgentShowcase from './AgentShowcase';
import LoreTeaser from './LoreTeaser';
import CallToAction from './CallToAction';
import Footer from './Footer';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <HeroSection />
      <ZoneCards />
      <LiveStatsSection />
      <AgentShowcase />
      <LoreTeaser />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;

