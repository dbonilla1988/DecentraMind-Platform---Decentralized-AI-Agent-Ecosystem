'use client';

import React from 'react';
import { useSubAgentAccess } from '../hooks/useSubAgentAccess';
import { SubAgent } from '../utils/subAgentTypes';

interface SubAgentMiddlewareProps {
  subAgentId: string;
  children: React.ReactNode;
  onAccessDenied?: (subAgent: SubAgent, reason: string) => void;
  fallback?: React.ReactNode;
}

const SubAgentMiddleware: React.FC<SubAgentMiddlewareProps> = ({
  subAgentId,
  children,
  onAccessDenied,
  fallback
}) => {
  const access = useSubAgentAccess(subAgentId);

  const handleAccessDenied = (reason: string) => {
    if (onAccessDenied) {
      // Create a mock sub-agent object for the callback
      const mockSubAgent: SubAgent = {
        id: subAgentId,
        name: 'Unknown Agent',
        description: '',
        parent: 'CFO',
        model: 'NFT',
        price: 0,
        status: 'Available'
      };
      onAccessDenied(mockSubAgent, reason);
    } else {
      // Default toast notification
      showAccessDeniedToast(reason);
    }
  };

  const showAccessDeniedToast = (reason: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 bg-red-500';
    toast.textContent = `Access Denied: ${reason}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  if (!access.hasAccess) {
    const reason = access.reason || 'Please unlock this agent first';
    handleAccessDenied(reason);
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex items-center justify-center p-8 bg-slate-800/50 rounded-xl border border-red-500/30">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-white mb-2">Access Required</h3>
          <p className="text-gray-400 text-sm mb-4">{reason}</p>
          <div className="text-xs text-gray-500">
            Unlock this agent to access its features
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Hook for sub-agent execution with access control
export const useSubAgentExecution = (subAgentId: string) => {
  const access = useSubAgentAccess(subAgentId);

  const executeSubAgent = (action: string, params?: any) => {
    if (!access.hasAccess) {
      const reason = access.reason || 'Please unlock this agent first';
      showAccessDeniedToast(reason);
      return false;
    }

    console.log(`Executing ${action} on sub-agent ${subAgentId}:`, params);
    
    // Show success toast
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 bg-emerald-500';
    toast.textContent = `Sub-agent ${subAgentId} executed successfully`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);

    return true;
  };

  const showAccessDeniedToast = (reason: string) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium z-50 bg-red-500';
    toast.textContent = `Access Denied: ${reason}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  return {
    executeSubAgent,
    hasAccess: access.hasAccess,
    accessType: access.accessType,
    reason: access.reason
  };
};

// Higher-order component for wrapping sub-agent features
export const withSubAgentAccess = <P extends object>(
  Component: React.ComponentType<P>,
  subAgentId: string
) => {
  return (props: P) => (
    <SubAgentMiddleware subAgentId={subAgentId}>
      <Component {...props} />
    </SubAgentMiddleware>
  );
};

export default SubAgentMiddleware;

















