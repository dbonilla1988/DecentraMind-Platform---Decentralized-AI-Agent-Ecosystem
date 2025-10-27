import { SubAgent } from '../utils/subAgentTypes';

export const cfoSubAgents: SubAgent[] = [
  {
    id: 'portfolio-optimizer',
    name: 'Portfolio Optimizer',
    description: 'Automatically rebalances portfolio allocations across DeFi protocols for optimal returns',
    parent: 'CFO',
    model: 'NFT',
    price: 180,
    status: 'Available',
    features: [
      'Multi-chain portfolio tracking',
      'Automated rebalancing',
      'Risk assessment algorithms',
      'Yield optimization strategies'
    ],
    icon: '📊',
    category: 'Portfolio Management',
    metadataURI: 'ipfs://QmPortfolioOptimizer123'
  },
  {
    id: 'tax-helper',
    name: 'Tax Helper',
    description: 'Generates comprehensive tax reports for all connected wallets and DeFi activities',
    parent: 'CFO',
    model: 'Subscription',
    subscriptionMonthly: 25,
    status: 'Available',
    features: [
      'Multi-wallet tax reporting',
      'DeFi transaction categorization',
      'Regulatory compliance checks',
      'Export to tax software'
    ],
    icon: '📋',
    category: 'Tax Management',
    metadataURI: 'ipfs://QmTaxHelper456'
  },
  {
    id: 'yield-farmer',
    name: 'Yield Farmer',
    description: 'Finds and monitors the best yield farming opportunities across multiple chains',
    parent: 'CFO',
    model: 'TokenUnlock',
    tokenRequirement: 5000,
    status: 'ComingSoon',
    features: [
      'Cross-chain yield monitoring',
      'Impermanent loss calculations',
      'APY comparison tools',
      'Automated farming strategies'
    ],
    icon: '🌾',
    category: 'Yield Farming',
    metadataURI: 'ipfs://QmYieldFarmer789'
  },
  {
    id: 'gas-fee-predictor',
    name: 'Gas Fee Predictor',
    description: 'Predicts ETH gas fee spikes and suggests optimal transaction timing',
    parent: 'CFO',
    model: 'Subscription',
    subscriptionMonthly: 15,
    status: 'Available',
    features: [
      'Real-time gas fee predictions',
      'Transaction timing optimization',
      'Network congestion analysis',
      'Cost-saving recommendations'
    ],
    icon: '⛽',
    category: 'Gas Optimization',
    metadataURI: 'ipfs://QmGasPredictor101'
  },
  {
    id: 'defi-scanner',
    name: 'DeFi Scanner',
    description: 'Scans and analyzes DeFi protocols for security risks and opportunities',
    parent: 'CFO',
    model: 'NFT',
    price: 250,
    status: 'Available',
    features: [
      'Smart contract security analysis',
      'Protocol risk assessment',
      'Liquidity pool monitoring',
      'Rug pull detection'
    ],
    icon: '🔍',
    category: 'Security Analysis',
    metadataURI: 'ipfs://QmDeFiScanner202'
  },
  {
    id: 'treasury-manager',
    name: 'Treasury Manager',
    description: 'Advanced treasury management with multi-signature wallet integration',
    parent: 'CFO',
    model: 'TokenUnlock',
    tokenRequirement: 10000,
    status: 'ComingSoon',
    features: [
      'Multi-sig wallet management',
      'Treasury allocation strategies',
      'Emergency fund protocols',
      'Governance integration'
    ],
    icon: '🏦',
    category: 'Treasury Management',
    metadataURI: 'ipfs://QmTreasuryManager303'
  }
];

export const cfoConfig = {
  masterAgentId: 'autonomous-cfo',
  masterAgentName: 'Autonomous CFO',
  subAgents: cfoSubAgents
};

















