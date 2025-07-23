import { useState } from 'react'
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  TrendingUp,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface ContributionBoxProps {
  tokenAddress: string;
  tokenData: {
    name: string;
    symbol: string;
    fundraisingTarget: string;
    fundraisedAmount: string;
    hardcap: string;
    contributorCount: number;
    liquidityAdded: boolean;
    tradingEnabled: boolean;
  };
}

const ContributionBox = ({ tokenAddress, tokenData }: ContributionBoxProps) => {
  const [contributionAmount, setContributionAmount] = useState('')
  const [isContributing, setIsContributing] = useState(false)
  const { toast } = useToast()

  const progressPercentage = (parseFloat(tokenData.fundraisedAmount) / parseFloat(tokenData.hardcap)) * 100;
  const isCompleted = tokenData.liquidityAdded;
  const timeRemaining = "2h 45m"; // Mock time

  const handleContribute = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Enter a valid contribution amount",
        variant: "destructive"
      });
      return;
    }

    setIsContributing(true);
    
    try {
      // Simulate contribution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Contribution Successful! 🎉",
        description: `Contributed ${contributionAmount} ETH to ${tokenData.name}`,
      });
      
      setContributionAmount('');
    } catch (error) {
      toast({
        title: "Contribution Failed",
        description: "Something went wrong with your contribution",
        variant: "destructive"
      });
    } finally {
      setIsContributing(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(tokenAddress);
    toast({
      title: "Address Copied",
      description: "Token address copied to clipboard",
    });
  };

  return (
    <Card className="p-6 gradient-card border-primary/20 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
            {isCompleted ? "Completed" : "Active"}
          </Badge>
          {!isCompleted && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold">{tokenData.name}</h3>
        <p className="text-sm text-muted-foreground">{tokenData.symbol}</p>
        
        <button 
          onClick={copyAddress}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors mx-auto mt-1"
        >
          {tokenAddress.slice(0, 6)}...{tokenAddress.slice(-4)}
          <Copy className="h-3 w-3" />
        </button>
      </div>

      {/* Progress Section */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {tokenData.fundraisedAmount} / {tokenData.hardcap} ETH
          </span>
        </div>
        
        <Progress value={progressPercentage} className="h-3" />
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-card/50 rounded-lg">
            <div className="text-sm font-medium">{progressPercentage.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
          <div className="p-3 bg-card/50 rounded-lg">
            <div className="text-sm font-medium">{tokenData.contributorCount}</div>
            <div className="text-xs text-muted-foreground">Contributors</div>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Status or Contribution Section */}
      {isCompleted ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-emerald-600 bg-emerald-500/10 p-3 rounded-lg">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium">Fundraising Complete!</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Liquidity Added:</span>
              <span className="font-medium text-emerald-600">✓ Yes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trading Status:</span>
              <span className="font-medium text-emerald-600">
                {tokenData.tradingEnabled ? "✓ Enabled" : "⏳ Pending"}
              </span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Uniswap
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Contribution Input */}
          <div className="space-y-2">
            <Label htmlFor="contribution">Contribution Amount (ETH)</Label>
            <div className="relative">
              <Input
                id="contribution"
                type="number"
                step="0.0001"
                min="0.0001"
                max={tokenData.hardcap}
                placeholder="0.001"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                className="pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                ETH
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Min: 0.0001 ETH</span>
              <span>Max: {tokenData.hardcap} ETH</span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {['0.001', '0.005', '0.01'].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setContributionAmount(amount)}
                className="text-xs"
              >
                {amount} ETH
              </Button>
            ))}
          </div>

          {/* Contribution Button */}
          <Button 
            onClick={handleContribute}
            disabled={isContributing || !contributionAmount}
            className="w-full"
            size="lg"
          >
            {isContributing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Contributing...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Contribute {contributionAmount || '...'} ETH
              </>
            )}
          </Button>

          {/* Info Box */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Single-Sided LP Mechanism</p>
                <p>You'll receive tokens based on your contribution percentage and get automatic LP positions when target is reached.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <Separator className="mt-6 mb-4" />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Target: {tokenData.fundraisingTarget} ETH</span>
        <span>Hardcap: {tokenData.hardcap} ETH</span>
      </div>
    </Card>
  );
};

export default ContributionBox;