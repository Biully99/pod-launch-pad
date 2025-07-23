// Simple blockchain utilities for Base network
export const BASE_RPC_URL = 'https://mainnet.base.org';

// Simple fetch-based ETH balance
export const getEthBalance = async (address: string): Promise<string> => {
  console.log('🔗 Fetching ETH balance for:', address);
  try {
    const response = await fetch(BASE_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      }),
    });

    const data = await response.json();
    console.log('🔗 RPC Response:', data);
    
    if (data.result) {
      // Convert hex to decimal and then to ETH
      const balanceWei = BigInt(data.result);
      const balanceEth = Number(balanceWei) / 1e18;
      console.log('✅ Balance converted:', balanceEth.toString());
      return balanceEth.toString();
    }
    console.log('❌ No result in RPC response');
    return '0';
  } catch (error) {
    console.error('❌ Error fetching ETH balance:', error);
    return '0';
  }
};

// Get basic wallet metadata
export const getWalletMetadata = async (address: string) => {
  try {
    const balance = await getEthBalance(address);
    
    // Get transaction count
    const response = await fetch(BASE_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionCount',
        params: [address, 'latest'],
        id: 2,
      }),
    });

    const data = await response.json();
    const transactionCount = data.result ? parseInt(data.result, 16) : 0;
    
    return {
      address,
      ethBalance: balance,
      transactionCount,
      network: 'Base'
    };
  } catch (error) {
    console.error('Error fetching wallet metadata:', error);
    return {
      address,
      ethBalance: '0',
      transactionCount: 0,
      network: 'Base'
    };
  }
};