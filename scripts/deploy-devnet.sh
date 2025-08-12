#!/bin/bash

# DecentraMind Devnet Deployment Script
# This script deploys all smart contracts to Solana devnet

set -e

echo "🚀 Starting DecentraMind Devnet Deployment..."

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install it first."
    exit 1
fi

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor CLI not found. Please install it first."
    exit 1
fi

# Set network to devnet
echo "📡 Setting network to devnet..."
solana config set --url https://api.devnet.solana.com

# Check wallet
echo "💰 Checking wallet..."
WALLET_ADDRESS=$(solana address)
echo "Using wallet: $WALLET_ADDRESS"

# Request airdrop if needed
BALANCE=$(solana balance)
echo "Current balance: $BALANCE"

if (( $(echo "$BALANCE < 2" | bc -l) )); then
    echo "💸 Requesting airdrop..."
    solana airdrop 2
    sleep 5
fi

# Build all programs
echo "🔨 Building programs..."

cd onchain/programs/dmt-token
anchor build
cd ../subscription
anchor build
cd ../agent
anchor build
cd ../dao
anchor build
cd ../staking
anchor build

cd ../../..

# Deploy DMT Token Contract
echo "🪙 Deploying DMT Token Contract..."
cd onchain/programs/dmt-token
anchor deploy --provider.cluster devnet
DMT_TOKEN_ADDRESS=$(solana address -k target/deploy/dmt_token-keypair.json)
echo "DMT Token deployed at: $DMT_TOKEN_ADDRESS"

# Deploy Subscription Contract
echo "📦 Deploying Subscription Contract..."
cd ../subscription
anchor deploy --provider.cluster devnet
SUBSCRIPTION_ADDRESS=$(solana address -k target/deploy/subscription-keypair.json)
echo "Subscription Contract deployed at: $SUBSCRIPTION_ADDRESS"

# Deploy Agent Contract
echo "🤖 Deploying Agent Contract..."
cd ../agent
anchor deploy --provider.cluster devnet
AGENT_ADDRESS=$(solana address -k target/deploy/agent-keypair.json)
echo "Agent Contract deployed at: $AGENT_ADDRESS"

# Deploy DAO Contract
echo "🏛️ Deploying DAO Contract..."
cd ../dao
anchor deploy --provider.cluster devnet
DAO_ADDRESS=$(solana address -k target/deploy/dao-keypair.json)
echo "DAO Contract deployed at: $DAO_ADDRESS"

# Deploy Staking Contract
echo "💰 Deploying Staking Contract..."
cd ../staking
anchor deploy --provider.cluster devnet
STAKING_ADDRESS=$(solana address -k target/deploy/staking-keypair.json)
echo "Staking Contract deployed at: $STAKING_ADDRESS"

cd ../../..

# Create .env.local with devnet addresses
echo "📝 Creating .env.local with devnet addresses..."
cat > .env.local << EOF
# Solana Configuration
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Contract Addresses (Devnet)
NEXT_PUBLIC_DMT_CONTRACT_ADDRESS=$DMT_TOKEN_ADDRESS
NEXT_PUBLIC_DMTX_CONTRACT_ADDRESS=$DMT_TOKEN_ADDRESS
NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=$STAKING_ADDRESS
NEXT_PUBLIC_AGENT_CONTRACT_ADDRESS=$AGENT_ADDRESS
NEXT_PUBLIC_DAO_CONTRACT_ADDRESS=$DAO_ADDRESS
NEXT_PUBLIC_TREASURY_CONTRACT_ADDRESS=$DAO_ADDRESS
NEXT_PUBLIC_BURNING_CONTRACT_ADDRESS=$DMT_TOKEN_ADDRESS
NEXT_PUBLIC_SUBSCRIPTION_CONTRACT_ADDRESS=$SUBSCRIPTION_ADDRESS
NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS=$AGENT_ADDRESS

# Feature Flags
NEXT_PUBLIC_ENABLE_SUBSCRIPTION=true
NEXT_PUBLIC_ENABLE_BURNING=true
NEXT_PUBLIC_ENABLE_AGENT_MINTING=true
NEXT_PUBLIC_ENABLE_AGENT_EVOLUTION=true
NEXT_PUBLIC_ENABLE_STAKING=true
NEXT_PUBLIC_ENABLE_DAO_GOVERNANCE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# AI Configuration
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_api_key
EOF

echo "✅ .env.local created with devnet addresses"

# Create deployment summary
echo "📊 Creating deployment summary..."
cat > DEPLOYMENT_SUMMARY.md << EOF
# DecentraMind Devnet Deployment Summary

**Deployment Date**: $(date)
**Network**: Solana Devnet
**Wallet**: $WALLET_ADDRESS

## Contract Addresses

| Contract | Address |
|----------|---------|
| DMT Token | \`$DMT_TOKEN_ADDRESS\` |
| Subscription | \`$SUBSCRIPTION_ADDRESS\` |
| Agent | \`$AGENT_ADDRESS\` |
| DAO | \`$DAO_ADDRESS\` |
| Staking | \`$STAKING_ADDRESS\` |

## Environment Configuration

All contract addresses have been configured in \`.env.local\` for devnet deployment.

## Next Steps

1. Test all contracts on devnet
2. Verify all economic flows work correctly
3. Run comprehensive test suite
4. Update documentation with devnet addresses
5. Prepare for mainnet deployment

## Verification Commands

\`\`\`bash
# Check contract deployment
solana program show $DMT_TOKEN_ADDRESS
solana program show $SUBSCRIPTION_ADDRESS
solana program show $AGENT_ADDRESS
solana program show $DAO_ADDRESS
solana program show $STAKING_ADDRESS

# Check account balances
solana balance
\`\`\`
EOF

echo "✅ Deployment summary created: DEPLOYMENT_SUMMARY.md"

echo "🎉 Devnet deployment completed successfully!"
echo "📋 Check DEPLOYMENT_SUMMARY.md for contract addresses and next steps" 