# DecentraMind Sub-Agent System

A modular sub-agent ecosystem that extends the capabilities of DecentraMind's three Master Agents through specialized sub-agents with different payment models.

## 🏗️ Architecture

### Master Agents
1. **Autonomous CFO** (`autonomous-cfo`) - Financial intelligence and treasury management
2. **Care Orchestrator** (`care-orchestrator`) - Health and wellness coordination  
3. **Crypto Alpha Assistant** (`crypto-alpha-assistant`) - Market intelligence and alpha generation

### Payment Models
- **NFT Mint** - One-time purchase for permanent access
- **Subscription** - Monthly recurring access with updates
- **Token Unlock** - Hold required DMT tokens to unlock access

## 📁 File Structure

```
src/modules/subAgents/
├── AutonomousCFO/
│   ├── config.ts         # CFO sub-agent configurations
│   ├── SubAgentCard.tsx  # UI card component
│   └── SubAgentModal.tsx # Modal for minting/subscribing
├── CareOrchestrator/
│   ├── config.ts
│   ├── SubAgentCard.tsx
│   └── SubAgentModal.tsx
├── CryptoAlphaAssistant/
│   ├── config.ts
│   ├── SubAgentCard.tsx
│   └── SubAgentModal.tsx
├── utils/
│   └── subAgentTypes.ts  # Shared types and utilities
└── index.ts              # Main exports
```

## 🤖 Sub-Agents by Master Agent

### Autonomous CFO Sub-Agents
- **Portfolio Optimizer** (NFT - 180 DMT) - Automated portfolio rebalancing
- **Tax Helper** (Subscription - 25 DMT/mo) - Crypto tax reporting
- **Yield Farmer** (Token Unlock - 5000 DMT) - Yield farming optimization
- **Gas Fee Predictor** (Subscription - 15 DMT/mo) - Gas fee optimization
- **DeFi Scanner** (NFT - 250 DMT) - Protocol security analysis
- **Treasury Manager** (Token Unlock - 10000 DMT) - Advanced treasury management

### Care Orchestrator Sub-Agents
- **Breathwork Tracker** (NFT - 120 DMT) - Breathing session tracking
- **Cold Plunge Coach** (Subscription - 20 DMT/mo) - Cold therapy protocols
- **Sleep AI** (Token Unlock - 3000 DMT) - Sleep pattern analysis
- **Nutrition Coach** (Subscription - 30 DMT/mo) - AI nutrition guidance
- **Meditation Guide** (NFT - 150 DMT) - Personalized meditation
- **Fitness Tracker** (Token Unlock - 4000 DMT) - Workout optimization

### Crypto Alpha Assistant Sub-Agents
- **Alpha Sniper** (NFT - 300 DMT) - New token detection
- **DAO Sentinel** (Subscription - 35 DMT/mo) - Governance monitoring
- **Whale Radar** (Token Unlock - 7500 DMT) - Whale movement tracking
- **Protocol Scanner** (Subscription - 40 DMT/mo) - Protocol analysis
- **Arbitrage Hunter** (NFT - 400 DMT) - Cross-exchange arbitrage
- **Sentiment Analyzer** (Token Unlock - 6000 DMT) - Market sentiment analysis

## 🎨 Components

### SubAgentCard
- Displays sub-agent metadata and features
- Shows pricing based on payment model
- Handles different button states (Mint/Subscribe/Unlock)
- Token balance validation for Token Unlock model

### SubAgentModal
- Detailed sub-agent information
- Payment model explanation
- Terms and conditions
- Action confirmation with processing states

## 🔧 Usage

### Basic Integration
```tsx
import { SubAgentCard, SubAgentModal } from '@/src/modules/subAgents';
import { cfoSubAgents } from '@/src/modules/subAgents/AutonomousCFO/config';

// Render sub-agent cards
{cfoSubAgents.map(subAgent => (
  <SubAgentCard
    key={subAgent.id}
    subAgent={subAgent}
    onMint={handleMint}
    onSubscribe={handleSubscribe}
    onUnlock={handleUnlock}
    userTokens={userTokenBalance}
  />
))}
```

### Route Integration
Access the sub-agents page at `/agents/sub-agents` to see all available sub-agents organized by master agent.

## 💰 Payment Logic

### NFT Model
- One-time payment in DMT tokens
- Permanent access to sub-agent
- NFT ownership provides exclusive features

### Subscription Model
- Monthly recurring payment
- Continuous updates and support
- Cancel anytime from account settings

### Token Unlock Model
- Hold required DMT tokens in wallet
- No additional fees
- Permanent unlock once requirement met

## 🔮 Future Enhancements

- On-chain minting integration (Umi, Phantom)
- IPFS metadata fetching for NFT images
- Real-time token balance updates
- Subscription management dashboard
- Cross-chain token support
- Advanced filtering and search
- Sub-agent performance analytics

## 🧪 Testing

The system includes mock implementations for:
- User token balance (15,000 DMT)
- Payment processing states
- Modal interactions
- Filter toggles

All payment actions currently log to console and can be replaced with actual blockchain interactions.

















