# 🧠 Care Orchestrator Sub-Agent Components

## 📁 File Structure

```
app/
├── data/
│   └── agentMetadata.ts              # Central agent registry
├── components/
│   └── agents/
│       ├── cards/
│       │   └── AgentCard.tsx          # Generic agent card component
│       ├── modals/
│       │   └── AgentModal.tsx         # Generic agent modal component
│       └── integrations/
│           └── CareOrchestratorSubAgents.tsx # Main integration component
└── care-orchestrator-demo/
    └── page.tsx                      # Demo page
```

## 🎯 Key Features

### ✅ **Generic Component Architecture**
- **`AgentCard.tsx`** - Single reusable card component for all agents
- **`AgentModal.tsx`** - Single reusable modal component for all agents
- **Data-driven** - Components adapt based on `AgentMetadata` prop
- **DRY Principle** - No duplicate code for individual agents

### ✅ **Centralized Data Management**
- **`agentMetadata.ts`** - Single source of truth for all agent configurations
- Type-safe interfaces with `AgentMetadata`
- Helper functions for filtering and querying agents

### ✅ **Payment Model Support**
- **NFT Mint** (🎨) - One-time purchase
- **Subscription** (🔄) - Monthly recurring
- **Token Unlock** (🔓) - Hold tokens to access

### ✅ **XP & Level Requirements**
- Level-based access control
- Dynamic XP rewards based on agent cost
- Visual level requirement indicators

## 🚀 Usage Examples

### **Generic Card Usage**
```tsx
import AgentCard from '../components/agents/cards/AgentCard';
import { getAgentById } from '../data/agentMetadata';

const agentData = getAgentById('sleep-ai');

<AgentCard
  agentData={agentData}
  onClick={() => setSelectedAgent(agentData)}
/>
```

### **Generic Modal Usage**
```tsx
import AgentModal from '../components/agents/modals/AgentModal';

<AgentModal
  agentData={selectedAgent}
  isOpen={!!selectedAgent}
  onClose={() => setSelectedAgent(null)}
/>
```

### **Complete Integration**
```tsx
import CareOrchestratorSubAgents from '../components/agents/integrations/CareOrchestratorSubAgents';

<CareOrchestratorSubAgents />
```

## 📊 Agent Registry

### **Current Agents**
| ID | Name | Unlock Type | Cost | Level | Status |
|----|------|-------------|------|-------|--------|
| `sleep-ai` | Sleep AI | TokenUnlock | 3000 DMT | 2+ | coming-soon |
| `nutrition-coach` | Nutrition Coach | Subscription | 30 DMT/mo | 1+ | available |
| `meditation-guide` | Meditation Guide | NFT | 150 DMT | 1+ | available |
| `fitness-tracker` | Fitness Tracker | TokenUnlock | 4000 DMT | 3+ | coming-soon |
| `breathwork-tracker` | Breathwork Tracker | NFT | 120 DMT | 1+ | available |
| `cold-plunge-coach` | Cold Plunge Coach | Subscription | 20 DMT/mo | 1+ | available |

### **Helper Functions**
```tsx
import { 
  getAgentById, 
  getAgentsByCategory, 
  getAgentsByStatus, 
  getAvailableAgents 
} from '../data/agentMetadata';

// Get specific agent
const sleepAI = getAgentById('sleep-ai');

// Get all available agents
const availableAgents = getAvailableAgents();

// Get agents by category
const nutritionAgents = getAgentsByCategory('Nutrition');
```

## 🎨 Design System

### **Color Coding**
- **NFT**: Purple gradient (`from-purple-500 to-purple-600`)
- **Subscription**: Blue gradient (`from-blue-500 to-blue-600`)
- **TokenUnlock**: Emerald gradient (`from-emerald-500 to-emerald-600`)

### **Status Indicators**
- **Available**: Green (`bg-green-500/20 text-green-400`)
- **Coming Soon**: Yellow (`bg-yellow-500/20 text-yellow-400`)

### **Animations**
- **Framer Motion** for smooth transitions
- **Hover effects** with scale transforms
- **Staggered animations** for grid layouts

## 🔧 Technical Implementation

### **Dependencies**
- `framer-motion` - Animations
- `useWalletBalance` - Wallet integration
- `useXPLogging` - XP tracking
- `Tailwind CSS` - Styling

### **Type Safety**
- Full TypeScript support
- Centralized interfaces
- Runtime type checking

### **Future-Ready**
- Extensible architecture
- Easy to add new agents
- Modular component system
- Centralized data management

## 🚀 Demo

Visit `/care-orchestrator-demo` to see all components in action!

## 📝 Adding New Agents

1. **Add to `agentMetadata.ts`**:
```tsx
{
  id: "new-agent",
  name: "New Agent",
  description: "Agent description",
  unlockType: "NFT",
  cost: 200,
  levelRequired: 2,
  status: "available",
  category: "Category",
  icon: "🎯",
  features: ["Feature 1", "Feature 2"],
  metadataURI: "ipfs://QmNewAgent123"
}
```

2. **That's it!** The generic components will automatically handle the new agent.

## 🎯 Benefits of Generic Approach

### **Maintainability**
- Single source of truth for component logic
- Easy to update styling or behavior globally
- Consistent user experience across all agents

### **Scalability**
- Add unlimited agents without creating new components
- Automatic handling of new payment models
- Dynamic XP rewards based on agent cost

### **Performance**
- Smaller bundle size (no duplicate component code)
- Better tree-shaking
- Optimized re-renders

### **Developer Experience**
- Faster development (no need to create individual components)
- Consistent patterns
- Easy testing and debugging

The architecture is designed to be easily extensible while maintaining consistency and type safety!