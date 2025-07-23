import { base } from 'wagmi/chains'

// Base Chain Network Configuration
export const BASE_CHAIN_CONFIG = {
  chainId: 8453,
  name: 'Base',
  currency: 'ETH',
  explorerUrl: 'https://basescan.org',
  rpcUrl: 'https://mainnet.base.org'
}

// Contract Addresses on Base Chain
export const CONTRACT_ADDRESSES = {
  // Deployed Peapods Token Factory on Base
  TOKEN_FACTORY: '0x742d35Cc6C24d9c6F22e0b1b8d9ccb6E12345678', // Replace with actual deployed address
  
  // Base Chain DEX Contracts
  UNISWAP_V3_FACTORY: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
  UNISWAP_V3_ROUTER: '0x2626664c2603336E57B271c5C0b26F421741e481',
  UNISWAP_V3_POSITION_MANAGER: '0x03a520b32C04BF3bEEf7BF4ddf9D2Ff57Dd65EB1',
  
  // Peapods Protocol Contracts (would be deployed separately)
  PEAPODS_LVF_MANAGER: '0x1234567890123456789012345678901234567890', // Replace with actual
  PEAPODS_YIELD_FARM: '0x0987654321098765432109876543210987654321' // Replace with actual
} as const

// Token Factory ABI
export const TOKEN_FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_feeRecipient", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "symbol", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "fundraisingTarget", "type": "uint256" }
    ],
    "name": "TokenDeployed",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "maxSupply", "type": "uint256" },
      { "internalType": "uint256", "name": "fundraisingTargetETH", "type": "uint256" },
      { "internalType": "uint256", "name": "creatorAllocation", "type": "uint256" }
    ],
    "name": "deployToken",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "deploymentFee",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllTokens",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "creator", "type": "address" }],
    "name": "getTokensByCreator",
    "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDeploymentStats",
    "outputs": [
      { "internalType": "uint256", "name": "totalTokens", "type": "uint256" },
      { "internalType": "uint256", "name": "activeTokens", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Peapods Meme Token ABI (for interacting with deployed tokens)
export const PEAPODS_TOKEN_ABI = [
  {
    "inputs": [],
    "name": "name",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "contribute",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContributionDetails",
    "outputs": [
      { "internalType": "uint256", "name": "target", "type": "uint256" },
      { "internalType": "uint256", "name": "raised", "type": "uint256" },
      { "internalType": "uint256", "name": "contributorCount", "type": "uint256" },
      { "internalType": "bool", "name": "completed", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fundraisingTarget",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fundraisedAmount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "tradingEnabled",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_liquidityPool", "type": "address" }],
    "name": "addLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "enableTrading",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// Contract interaction helpers
export const formatTokenAmount = (amount: bigint, decimals: number = 18): string => {
  return (Number(amount) / Math.pow(10, decimals)).toFixed(4)
}

export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  return BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)))
}

export const formatEthAmount = (amount: bigint): string => {
  return formatTokenAmount(amount, 18)
}

export const parseEthAmount = (amount: string): bigint => {
  return parseTokenAmount(amount, 18)
}

// Get explorer URL for transaction
export const getExplorerUrl = (hash: string, type: 'tx' | 'address' = 'tx'): string => {
  return `${BASE_CHAIN_CONFIG.explorerUrl}/${type}/${hash}`
}

// Token deployment parameters interface
export interface TokenDeploymentParams {
  name: string
  symbol: string
  maxSupply: string
  fundraisingTarget: string
  creatorAllocation: string
  deploymentFee: string
}

// Token info interface
export interface TokenInfo {
  tokenAddress: string
  name: string
  symbol: string
  creator: string
  createdAt: number
  fundraisingTarget: bigint
  isActive: boolean
}

// Deployment stats interface
export interface DeploymentStats {
  totalTokens: bigint
  activeTokens: bigint
}