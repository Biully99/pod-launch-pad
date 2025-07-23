import { usePrivy } from '@privy-io/react-auth';
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, User, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const WalletButton = () => {
  console.log('🔗 WalletButton rendering...')
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { toast } = useToast();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    const address = user?.wallet?.address;
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address Copied 🌱",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openExplorer = () => {
    const address = user?.wallet?.address;
    if (address) {
      window.open(`https://basescan.org/address/${address}`, '_blank');
    }
  };

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <Button variant="outline" disabled>
        <Wallet className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  // Show login button if not authenticated
  if (!authenticated) {
    return (
      <Button onClick={login} variant="hero" size="sm">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet 🌱
      </Button>
    );
  }

  // Show user info and logout option when authenticated
  const displayName = user?.email?.address || 
                     (user?.wallet?.address ? 
                       formatAddress(user.wallet.address) : 
                       'Connected');

  const hasWallet = !!user?.wallet?.address;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{displayName}</span>
          {user?.email && (
            <Badge variant="secondary" className="ml-1 hidden md:inline-flex">
              📧
            </Badge>
          )}
          {hasWallet && (
            <Badge variant="secondary" className="ml-1 hidden md:inline-flex">
              Base
            </Badge>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem disabled>
          <User className="h-4 w-4 mr-2" />
          {displayName}
        </DropdownMenuItem>
        {hasWallet && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
              <Copy className="h-4 w-4 mr-2" />
              Copy Address
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openExplorer} className="cursor-pointer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on BaseScan
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WalletButton;