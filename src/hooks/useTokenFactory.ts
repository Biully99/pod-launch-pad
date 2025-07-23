import { useState, useCallback } from 'react'
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { base } from 'wagmi/chains'
import { 
  CONTRACT_ADDRESSES, 
  TOKEN_FACTORY_ABI, 
  TokenDeploymentParams,
  TokenInfo,
  DeploymentStats
} from '@/lib/contracts'

export const useTokenFactory = () => {
  const { address, isConnected } = useAccount()
  const [isDeploying, setIsDeploying] = useState(false)

  // Write contract hook for token deployment
  const { writeContractAsync, data: deployTxHash, error: deployError } = useWriteContract()

  // Wait for deployment transaction
  const { data: deployReceipt, isLoading: isWaitingForReceipt } = useWaitForTransactionReceipt({
    hash: deployTxHash,
    chainId: base.id
  })

  // Read deployment fee
  const { data: deploymentFee } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_FACTORY as `0x${string}`,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'deploymentFee',
    chainId: base.id
  })

  // Read deployment stats
  const { data: deploymentStats, refetch: refetchStats } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_FACTORY as `0x${string}`,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'getDeploymentStats',
    chainId: base.id
  })

  // Read all deployed tokens
  const { data: allTokens, refetch: refetchTokens } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_FACTORY as `0x${string}`,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'getAllTokens',
    chainId: base.id
  })

  // Read tokens by creator
  const { data: creatorTokens, refetch: refetchCreatorTokens } = useReadContract({
    address: CONTRACT_ADDRESSES.TOKEN_FACTORY as `0x${string}`,
    abi: TOKEN_FACTORY_ABI,
    functionName: 'getTokensByCreator',
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: !!address
    }
  })

  // Deploy token function
  const deployToken = useCallback(async (params: TokenDeploymentParams) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected')
    }

    if (!deploymentFee) {
      throw new Error('Deployment fee not loaded')
    }

    setIsDeploying(true)
    
    try {
      const maxSupplyBigInt = parseEther(params.maxSupply)
      const fundraisingTargetBigInt = parseEther(params.fundraisingTarget)
      const creatorAllocationNumber = BigInt(parseInt(params.creatorAllocation))
      const deploymentFeeBigInt = deploymentFee as bigint

      const txHash = await writeContractAsync({
        address: CONTRACT_ADDRESSES.TOKEN_FACTORY as `0x${string}`,
        abi: TOKEN_FACTORY_ABI,
        functionName: 'deployToken',
        args: [
          params.name,
          params.symbol,
          maxSupplyBigInt,
          fundraisingTargetBigInt,
          creatorAllocationNumber
        ],
        value: deploymentFeeBigInt
      })

      return txHash
    } catch (error) {
      console.error('Token deployment failed:', error)
      throw error
    } finally {
      setIsDeploying(false)
    }
  }, [isConnected, address, deploymentFee, writeContractAsync])

  // Get token info by address
  const getTokenInfo = useCallback(async (tokenAddress: string): Promise<TokenInfo | null> => {
    try {
      // This would require a separate read contract call
      // For now, we'll return null and implement this when needed
      return null
    } catch (error) {
      console.error('Failed to get token info:', error)
      return null
    }
  }, [])

  // Format deployment stats
  const formattedStats: DeploymentStats | null = deploymentStats ? {
    totalTokens: deploymentStats[0] as bigint,
    activeTokens: deploymentStats[1] as bigint
  } : null

  // Format deployment fee
  const formattedDeploymentFee = deploymentFee ? formatEther(deploymentFee as bigint) : '0'

  return {
    // State
    isDeploying: isDeploying || isWaitingForReceipt,
    deployReceipt,
    deployError,
    
    // Data
    deploymentFee: formattedDeploymentFee,
    deploymentStats: formattedStats,
    allTokens: allTokens as string[] || [],
    creatorTokens: creatorTokens as string[] || [],
    
    // Functions
    deployToken,
    getTokenInfo,
    refetchStats,
    refetchTokens,
    refetchCreatorTokens,
    
    // Status
    isConnected,
    address
  }
}

// Hook for interacting with individual tokens
export const useTokenContract = (tokenAddress: string) => {
  // This would contain functions for interacting with individual token contracts
  // Such as contributing to fundraising, checking balances, etc.
  
  return {
    // Placeholder for token-specific functions
    contribute: useCallback(async (amount: string) => {
      // Implementation for contributing to token fundraising
    }, [tokenAddress]),
    
    getTokenDetails: useCallback(async () => {
      // Implementation for getting token details
    }, [tokenAddress])
  }
}