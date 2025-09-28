export default function AIAgentsPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-300 mb-4">AI Agents</h1>
          <p className="text-gray-400 text-lg">
            Manage and interact with your AI agents, create workflows, and explore the marketplace.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Agent Management</h3>
            <p className="text-gray-400 mb-4">Manage and interact with your AI agents</p>
            <a href="/ai-agents/management" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              View Agents →
            </a>
          </div>
          
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Agent Workflows</h3>
            <p className="text-gray-400 mb-4">Create and manage AI automation workflows</p>
            <a href="/ai-agents/workflows" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Create Workflow →
            </a>
          </div>
          
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Mint New Agent</h3>
            <p className="text-gray-400 mb-4">Create new AI agents with custom capabilities</p>
            <a href="/ai-agents/mint" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Mint Agent →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

