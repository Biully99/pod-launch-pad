import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, Hash, Activity } from 'lucide-react';
import { getWalletMetadata } from '@/lib/blockchain';

interface WalletMetadata {
  address: string;
  ethBalance: string;
  transactionCount: number;
  network: string;
}

const WalletMetadata = () => {
  const { user, authenticated } = usePrivy();
  const [metadata, setMetadata] = useState<WalletMetadata | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      if (!authenticated || !user?.wallet?.address) return;
      
      setLoading(true);
      try {
        const data = await getWalletMetadata(user.wallet.address);
        setMetadata(data);
      } catch (error) {
        console.error('Failed to fetch wallet metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [authenticated, user?.wallet?.address]);

  if (!authenticated || !user?.wallet?.address) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Wallet Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : metadata ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network</span>
              <Badge variant="secondary">{metadata.network}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Address
              </span>
              <span className="text-xs font-mono">
                {`${metadata.address.slice(0, 6)}...${metadata.address.slice(-4)}`}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ETH Balance</span>
              <span className="text-sm font-mono">
                {parseFloat(metadata.ethBalance).toFixed(4)} ETH
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Transactions
              </span>
              <span className="text-sm">{metadata.transactionCount}</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Failed to load wallet data</p>
        )}
      </CardContent>
    </Card>
  );
};

export default WalletMetadata;