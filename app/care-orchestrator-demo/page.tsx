'use client';

import React from 'react';
import CareOrchestratorSubAgents from '../components/agents/integrations/CareOrchestratorSubAgents';

const CareOrchestratorDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <CareOrchestratorSubAgents />
      </div>
    </div>
  );
};

export default CareOrchestratorDemoPage;
