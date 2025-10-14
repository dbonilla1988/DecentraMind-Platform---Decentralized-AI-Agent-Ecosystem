'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const WorkflowsPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to AI Console since workflows are managed there
    router.push('/ai-console');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">⚡</div>
        <h1 className="text-2xl font-bold text-white mb-2">Redirecting to AI Console</h1>
        <p className="text-gray-400 mb-6">Agent workflows are managed in the unified AI Console</p>
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </motion.div>
    </div>
  );
};

export default WorkflowsPage;
