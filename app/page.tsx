'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the consolidated dashboard
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">DM</span>
        </div>
        <h1 className="text-2xl font-bold text-cyan-300 mb-2">DecentraMind Labs</h1>
        <p className="text-gray-400">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}