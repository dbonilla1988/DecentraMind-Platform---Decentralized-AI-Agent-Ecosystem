import { SubAgent } from '../utils/subAgentTypes';

export const alphaSubAgents: SubAgent[] = [
  {
    id: 'alpha-sniper',
    name: 'Alpha Sniper',
    description: 'Detects new token breakouts and early-stage opportunities across multiple chains',
    parent: 'Alpha',
    model: 'NFT',
    price: 300,
    status: 'Available',
    features: [
      'New token detection algorithms',
      'Early-stage opportunity scanning',
      'Cross-chain monitoring',
      'Risk-reward analysis'
    ],
    icon: '🎯',
    category: 'Token Discovery',
    metadataURI: 'ipfs://QmAlphaSniper123'
  },
  {
    id: 'dao-sentinel',
    name: 'DAO Sentinel',
    description: 'Monitors governance votes and alerts on important DAO proposals across protocols',
    parent: 'Alpha',
    model: 'Subscription',
    subscriptionMonthly: 35,
    status: 'Available',
    features: [
      'Governance proposal monitoring',
      'Voting deadline alerts',
      'DAO activity tracking',
      'Impact analysis reports'
    ],
    icon: '🛡️',
    category: 'Governance',
    metadataURI: 'ipfs://QmDAOSentinel456'
  },
  {
    id: 'whale-radar',
    name: 'Whale Radar',
    description: 'Monitors smart wallets and whale movements to identify market trends',
    parent: 'Alpha',
    model: 'TokenUnlock',
    tokenRequirement: 7500,
    status: 'ComingSoon',
    features: [
      'Whale wallet tracking',
      'Large transaction monitoring',
      'Market trend analysis',
      'Smart money following'
    ],
    icon: '🐋',
    category: 'Market Intelligence',
    metadataURI: 'ipfs://QmWhaleRadar789'
  },
  {
    id: 'protocol-scanner',
    name: 'Protocol Scanner',
    description: 'Scans new DeFi protocols for potential alpha opportunities and risks',
    parent: 'Alpha',
    model: 'Subscription',
    subscriptionMonthly: 40,
    status: 'Available',
    features: [
      'New protocol detection',
      'TVL and liquidity analysis',
      'Tokenomics evaluation',
      'Risk assessment scoring'
    ],
    icon: '🔬',
    category: 'Protocol Analysis',
    metadataURI: 'ipfs://QmProtocolScanner101'
  },
  {
    id: 'arbitrage-hunter',
    name: 'Arbitrage Hunter',
    description: 'Identifies cross-exchange arbitrage opportunities and MEV strategies',
    parent: 'Alpha',
    model: 'NFT',
    price: 400,
    status: 'Available',
    features: [
      'Cross-exchange price monitoring',
      'Arbitrage opportunity detection',
      'MEV strategy identification',
      'Profitability calculations'
    ],
    icon: '⚡',
    category: 'Arbitrage',
    metadataURI: 'ipfs://QmArbitrageHunter202'
  },
  {
    id: 'sentiment-analyzer',
    name: 'Sentiment Analyzer',
    description: 'Analyzes social media and news sentiment to predict market movements',
    parent: 'Alpha',
    model: 'TokenUnlock',
    tokenRequirement: 6000,
    status: 'ComingSoon',
    features: [
      'Social media sentiment tracking',
      'News impact analysis',
      'Market sentiment indicators',
      'Price prediction models'
    ],
    icon: '📈',
    category: 'Sentiment Analysis',
    metadataURI: 'ipfs://QmSentimentAnalyzer303'
  }
];

export const alphaConfig = {
  masterAgentId: 'crypto-alpha-assistant',
  masterAgentName: 'Crypto Alpha Assistant',
  subAgents: alphaSubAgents
};

















