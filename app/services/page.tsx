export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cyan-300 mb-4">Services</h1>
          <p className="text-gray-400 text-lg">
            Professional tools, automation services, and premium support for your Web3 journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Smart Contract Tools</h3>
            <p className="text-gray-400 mb-4">Blockchain development and deployment tools</p>
            <a href="/services/contracts" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              View Tools →
            </a>
          </div>
          
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">AI Automation</h3>
            <p className="text-gray-400 mb-4">Advanced AI automation services</p>
            <a href="/services/automation" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Explore Automation →
            </a>
          </div>
          
          <div className="bg-zinc-800/50 border border-cyan-400/20 rounded-xl p-6 hover:border-cyan-400/40 transition-all duration-300">
            <h3 className="text-xl font-semibold text-cyan-300 mb-2">Professional Services</h3>
            <p className="text-gray-400 mb-4">Premium AI and blockchain consulting</p>
            <a href="/services/professional" className="text-cyan-400 hover:text-cyan-300 transition-colors">
              Get Support →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

