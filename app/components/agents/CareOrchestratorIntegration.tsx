'use client';

import React from 'react';
import ColdPlungeSync from './ColdPlungeSync';

interface CareOrchestratorIntegrationProps {
  className?: string;
}

const CareOrchestratorIntegration: React.FC<CareOrchestratorIntegrationProps> = ({ className = '' }) => {
  return (
    <div className={className}>
      <ColdPlungeSync />
    </div>
  );
};

export default CareOrchestratorIntegration;
