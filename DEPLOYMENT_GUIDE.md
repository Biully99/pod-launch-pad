# 🚀 Contract Deployment Guide - Base Testnet

This guide will walk you through deploying the Peapods Token Launcher contracts to Base Sepolia testnet.

## 📋 Prerequisites

1. **Node.js & npm** installed
2. **MetaMask** wallet with Base Sepolia testnet configured
3. **Test ETH** on Base Sepolia (get from faucets)
4. **BaseScan API key** (optional, for contract verification)

## 🔧 Setup

### 1. Get Test ETH
- Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
- Connect your wallet and claim test ETH
- You'll need ~0.05 ETH for deployment

### 2. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your details:
# - Private key (without 0x prefix)
# - BaseScan API key (for verification)
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Compile Contracts
```bash
npx hardhat compile
```

## 🚀 Deploy Contracts

### Deploy to Base Sepolia Testnet
```bash
npm run deploy:sepolia
```

### Expected Output
```
🚀 Deploying contracts to Base Sepolia testnet...
Deploying with account: 0x...
Account balance: 0.05 ETH

📦 Deploying PodCreator contract...
✅ PodCreator deployed to: 0x...

🏭 Deploying TokenFactory contract...
✅ TokenFactory deployed to: 0x...

🔑 Authorizing TokenFactory to create pods...
✅ TokenFactory authorized

🎉 Deployment completed!
==========================================
📋 Contract Addresses:
PodCreator: 0x...
TokenFactory: 0x...
==========================================
```

## 🔐 Verify Contracts (Optional)

After deployment, verify your contracts on BaseScan:

```bash
# Copy the verification commands from deployment output
npx hardhat verify --network base-sepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 🔧 Update Frontend Configuration

After successful deployment, update the contract addresses in your frontend:

1. Open `src/lib/contracts.ts`
2. Update the `CONTRACT_ADDRESSES` object with your deployed addresses:

```typescript
export const CONTRACT_ADDRESSES = {
  TOKEN_FACTORY: "0x...", // Your deployed TokenFactory address
  POD_CREATOR: "0x...",   // Your deployed PodCreator address
  // ... other addresses
}
```

## 🧪 Test Your Deployment

1. **Update Frontend**: Make sure contract addresses are updated
2. **Connect Wallet**: Use MetaMask on Base Sepolia
3. **Deploy Test Token**: Try launching a token through the UI
4. **Verify Transaction**: Check BaseScan for successful deployment

## 📊 Network Details

**Base Sepolia Testnet:**
- Chain ID: 84532
- RPC URL: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org
- Faucet: https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet

## 🔥 Next Steps

1. **Test Token Deployment**: Launch your first test token
2. **Monitor Gas Usage**: Check deployment costs
3. **Deploy to Mainnet**: When ready, use `npm run deploy:mainnet`
4. **Set Up Monitoring**: Track contract performance

## 🆘 Troubleshooting

### Common Issues:

**"Insufficient funds for gas"**
- Get more test ETH from faucet
- Lower gas price in hardhat.config.js

**"Contract verification failed"**
- Wait a few minutes and try again
- Check constructor arguments match deployment

**"Transaction reverted"**
- Check account has sufficient ETH
- Verify network configuration

### Support
- Check deployment logs in `deployment-info.json`
- Review transaction details on BaseScan
- Ensure wallet is connected to correct network

## 💾 Deployment Info

After deployment, contract details are saved in `deployment-info.json` for reference.

---

**Ready to launch your tokens on Base! 🚀**
