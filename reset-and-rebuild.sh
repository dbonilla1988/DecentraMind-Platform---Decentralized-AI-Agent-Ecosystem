#!/bin/bash

echo "🔧 DECENTRAMIND PLATFORM RESET & REBUILD SCRIPT"
echo "================================================"

# Step 1: Stop all running processes
echo "📋 Step 1: Stopping running processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Step 2: Clean build artifacts
echo "📋 Step 2: Cleaning build artifacts..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo
rm -f tsconfig.tsbuildinfo

# Step 3: Clean environment
echo "📋 Step 3: Cleaning environment..."
rm -f .env.local
rm -f .env.development.local
rm -f .env.production.local

# Step 4: Reinstall dependencies
echo "📋 Step 4: Reinstalling dependencies..."
npm ci

# Step 5: Create fresh environment file
echo "📋 Step 5: Creating fresh environment file..."
cat > .env.local << 'EOF'
# DecentraMind Environment Variables
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_AI_AGENT_NFT_CONTRACT=11111111111111111111111111111111
NEXT_PUBLIC_TREASURY_ADDRESS=11111111111111111111111111111111

# Firebase Configuration (placeholder values - replace with actual credentials)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com

# AI API Keys (placeholder values - replace with actual keys)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_huggingface_api_key_here
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# Feature Flags (PRODUCTION READY - NO BYPASSES)
NEXT_PUBLIC_ENABLE_DAO=true
NEXT_PUBLIC_ENABLE_STAKING=true
NEXT_PUBLIC_ENABLE_GOVERNANCE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Firebase Admin SDK (for server-side authentication)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com

# Claude Code Hooks Configuration
CLAUDE_HOOKS_ENABLED=true
EOF

# Step 6: Remove debug bypasses
echo "📋 Step 6: Removing debug bypasses..."
sed -i '' 's/const FORCE_DASHBOARD = true; \/\/ Set to true to bypass authentication/const FORCE_DASHBOARD = false; \/\/ Production: no bypass/' app/page.tsx
sed -i '' 's/const ENABLE_DAO = true; \/\/ process.env.NEXT_PUBLIC_ENABLE_DAO === '\''true'\'';/const ENABLE_DAO = process.env.NEXT_PUBLIC_ENABLE_DAO === '\''true'\'';/' app/page.tsx
sed -i '' 's/const ENABLE_STAKING = true; \/\/ process.env.NEXT_PUBLIC_ENABLE_STAKING === '\''true'\'';/const ENABLE_STAKING = process.env.NEXT_PUBLIC_ENABLE_STAKING === '\''true'\'';/' app/page.tsx
sed -i '' 's/const ENABLE_GOVERNANCE = true; \/\/ process.env.NEXT_PUBLIC_ENABLE_GOVERNANCE === '\''true'\'';/const ENABLE_GOVERNANCE = process.env.NEXT_PUBLIC_ENABLE_GOVERNANCE === '\''true'\'';/' app/page.tsx
sed -i '' 's/const ENABLE_ANALYTICS = true; \/\/ process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === '\''true'\'';/const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === '\''true'\'';/' app/page.tsx

# Step 7: Remove debug logging
echo "📋 Step 7: Removing debug logging..."
sed -i '' '/console\.log.*🔍/d' app/page.tsx
sed -i '' '/console\.log.*📋/d' app/page.tsx
sed -i '' '/console\.log.*🚩/d' app/page.tsx
sed -i '' '/console\.log.*🔐/d' app/page.tsx
sed -i '' '/console\.log.*🎯/d' app/page.tsx
sed -i '' '/console\.log.*📱/d' app/page.tsx
sed -i '' '/console\.log.*⏳/d' app/page.tsx

# Step 8: Build the application
echo "📋 Step 8: Building the application..."
npm run build

# Step 9: Run tests
echo "📋 Step 9: Running tests..."
node test-runtime-check.js

# Step 10: Start development server
echo "📋 Step 10: Starting development server..."
echo "✅ RESET COMPLETE!"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Update .env.local with your real API keys"
echo "2. Connect your Solana wallet"
echo "3. Test all features at http://localhost:3000"
echo "4. Check browser console for any remaining issues"
echo ""
echo "🚀 Starting server..."
npm run dev 