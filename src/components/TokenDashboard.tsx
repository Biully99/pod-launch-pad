import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  ExternalLink,
  Settings,
  Eye,
  RotateCcw,
  Zap
} from "lucide-react";

interface TokenDashboardProps {
  tokenAddress?: string;
  tokenData?: {
    name: string;
    symbol: string;
    totalSupply: string;
    fundraisingTarget: string;
    fundraisedAmount: string;
    tradingEnabled: boolean;
    liquidityAdded: boolean;
    podCreated: boolean;
  };
}

const TokenDashboard = ({ tokenAddress, tokenData }: TokenDashboardProps) => {
  // Mock data if no real data provided
  const defaultData = {
    name: "Based Pepe",
    symbol: "BPEPE",
    totalSupply: "1,000,000",
    fundraisingTarget: "0.001",
    fundraisedAmount: "0.0007",
    tradingEnabled: false,
    liquidityAdded: false,
    podCreated: false
  };

  const data = tokenData || defaultData;
  const progressPercentage = (parseFloat(data.fundraisedAmount) / parseFloat(data.fundraisingTarget)) * 100;

  // Wallet states based on the flowchart
  const walletStates = [
    {
      id: 'lp',
      name: 'LP Wallet',
      description: 'Automatic LP migration & lock',
      icon: TrendingUp,
      status: data.liquidityAdded ? 'active' : 'pending',
      amount: '90% of ETH raised',
      action: 'Auto-lock when token hits mcap',
      color: 'emerald'
    },
    {
      id: 'bribes',
      name: 'Bribes Wallet', 
      description: 'Listen to PodKeep/LP reward accordingly',
      icon: DollarSign,
      status: data.podCreated ? 'active' : 'pending',
      amount: 'Dynamic based on Pod activity',
      action: 'Maybe use me as the sebseed',
      color: 'blue'
    },
    {
      id: 'team',
      name: 'Team/Dev Wallet',
      description: 'Dev functions and team allocation',
      icon: Users,
      status: 'active',
      amount: `${data.name ? '5%' : '0%'} of total supply`,
      action: 'Initial dev allocation & functions',
      color: 'violet'
    },
    {
      id: 'buyback',
      name: 'Buyback Wallet',
      description: 'Function for Incen to liquid new',
      icon: ShoppingCart,
      status: data.tradingEnabled ? 'active' : 'pending',
      amount: 'Variable based on Pod activity',
      action: 'Back the close in advance',
      color: 'orange'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30';
      case 'pending': return 'bg-amber-500/20 text-amber-600 border-amber-500/30';
      default: return 'bg-muted/20 text-muted-foreground border-border';
    }
  };

  const getWalletColor = (color: string) => {
    switch (color) {
      case 'emerald': return 'from-emerald-500 to-emerald-600';
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'violet': return 'from-violet-500 to-violet-600';
      case 'orange': return 'from-orange-500 to-orange-600';
      default: return 'from-primary to-primary/80';
    }
  };

  return (
    <div className="space-y-6">
      {/* Token Overview */}
      <Card className="p-6 gradient-card border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">{data.name} ({data.symbol})</h2>
            <p className="text-muted-foreground">Token Dashboard & Wallet Management</p>
          </div>
          {tokenAddress && (
            <Badge variant="outline" className="text-xs font-mono">
              {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
            </Badge>
          )}
        </div>

        {/* Fundraising Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fundraising Progress</span>
            <span className="font-medium">{data.fundraisedAmount} / {data.fundraisingTarget} ETH</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{progressPercentage.toFixed(1)}% Complete</span>
            <span>{data.tradingEnabled ? 'Trading Active' : 'Fundraising Active'}</span>
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card className="p-6 gradient-card border-secondary/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
            <div className={`w-3 h-3 rounded-full ${data.liquidityAdded ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div>
              <p className="text-sm font-medium">Uniswap V3 LP</p>
              <p className="text-xs text-muted-foreground">
                {data.liquidityAdded ? 'Active' : 'Pending'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
            <div className={`w-3 h-3 rounded-full ${data.podCreated ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div>
              <p className="text-sm font-medium">Peapods Pod</p>
              <p className="text-xs text-muted-foreground">
                {data.podCreated ? 'Created' : 'Pending'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
            <div className={`w-3 h-3 rounded-full ${data.tradingEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div>
              <p className="text-sm font-medium">Trading</p>
              <p className="text-xs text-muted-foreground">
                {data.tradingEnabled ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Wallet States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {walletStates.map((wallet) => {
          const IconComponent = wallet.icon;
          return (
            <Card key={wallet.id} className="p-6 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${getWalletColor(wallet.color)} text-white group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{wallet.name}</h4>
                    <p className="text-sm text-muted-foreground">{wallet.description}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(wallet.status)} text-xs`}>
                  {wallet.status}
                </Badge>
              </div>

              <Separator className="mb-4" />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Amount:</span>
                  <span className="text-sm font-medium">{wallet.amount}</span>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground italic">
                    "{wallet.action}"
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Integration Flow */}
      <Card className="p-6 gradient-card border-accent/20">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <RotateCcw className="h-5 w-5" />
          Integration Flow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-card/50">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
              <DollarSign className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-1">USDC Supplier</h4>
            <p className="text-xs text-muted-foreground">External liquidity source</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-card/50">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
              <Zap className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-1">Pod</h4>
            <p className="text-xs text-muted-foreground">Peapods Finance integration</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-card/50">
            <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
              <Wallet className="h-6 w-6" />
            </div>
            <h4 className="font-medium mb-1">Token Supplier</h4>
            <p className="text-xs text-muted-foreground">Token distribution mechanism</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            View Timeline
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Dextools
          </Button>
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Settings
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TokenDashboard;