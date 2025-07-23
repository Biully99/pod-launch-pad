import { usePrivy } from '@privy-io/react-auth';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Copy,
  ExternalLink,
  RefreshCw,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Link } from "react-router-dom";

// Mock user token data
const mockUserTokens = [
  {
    id: 1,
    name: "Based Pepe",
    symbol: "BPEPE",
    image: "🐸",
    balance: "15,420.69",
    value: "$2,834.52",
    change24h: 45.7,
    address: "0x1234...5678"
  },
  {
    id: 2,
    name: "Moon Doge", 
    symbol: "MDOGE",
    image: "🐕",
    balance: "8,888.88",
    value: "$1,567.23",
    change24h: -12.3,
    address: "0x9876...4321"
  }
];

const Dashboard = () => {
  console.log('📊 Dashboard rendering...');
  const { ready, authenticated, user } = usePrivy();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!ready) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 container mx-auto px-4">
          <Card className="max-w-md mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to view your token portfolio 🌱
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleCopyAddress = () => {
    const address = user?.wallet?.address || user?.email?.address;
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied 🌱",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
    toast({
      title: "Portfolio Refreshed 🔄",
      description: "Your token balances have been updated",
    });
  };

  const handleViewOnExplorer = (address: string) => {
    window.open(`https://basescan.org/token/${address}`, '_blank');
  };

  const totalPortfolioValue = mockUserTokens.reduce((sum, token) => {
    return sum + parseFloat(token.value.replace('$', '').replace(',', ''));
  }, 0);

  const displayName = user?.email?.address || 
                     (user?.wallet?.address ? 
                       `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : 
                       'Connected');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Your Portfolio 🌱
                </h1>
                <p className="text-muted-foreground mt-2">
                  Manage your based memecoin holdings
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Link to="/">
                  <Button variant="hero" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Launch Token
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <Card className="gradient-card border-primary/20 p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Connected Wallet</h3>
                  <p className="text-muted-foreground">{displayName}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
                {user?.wallet?.address && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://basescan.org/address/${user.wallet.address}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="gradient-card border-primary/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted-foreground">Total Value</span>
              </div>
              <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
            </Card>
            
            <Card className="gradient-card border-secondary/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-secondary" />
                <span className="text-sm text-muted-foreground">Tokens Held</span>
              </div>
              <p className="text-2xl font-bold">{mockUserTokens.length}</p>
            </Card>
            
            <Card className="gradient-card border-accent/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">24h P&L</span>
              </div>
              <p className="text-2xl font-bold text-success">+$234.56</p>
            </Card>
          </div>

          {/* Token Holdings */}
          <Card className="gradient-card border-primary/20 p-6">
            <h2 className="text-xl font-bold mb-6">Your Tokens</h2>
            
            {mockUserTokens.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌱</div>
                <h3 className="text-lg font-semibold mb-2">No Tokens Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Launch your first memecoin or contribute to existing ones
                </p>
                <Link to="/">
                  <Button variant="hero">
                    <Plus className="h-4 w-4 mr-2" />
                    Launch Your First Token
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {mockUserTokens.map((token) => (
                  <div 
                    key={token.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border hover:bg-card/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{token.image}</div>
                      <div>
                        <h3 className="font-semibold">{token.name}</h3>
                        <p className="text-sm text-muted-foreground">${token.symbol}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">{token.balance} {token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.value}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`flex items-center gap-1 ${token.change24h > 0 ? 'text-success' : 'text-destructive'}`}>
                        {token.change24h > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingUp className="h-4 w-4 rotate-180" />
                        )}
                        <span className="font-semibold">{Math.abs(token.change24h)}%</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewOnExplorer(token.address)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="default" size="sm">
                        Trade
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;