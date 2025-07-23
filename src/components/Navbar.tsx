import { Button } from "@/components/ui/button";
import { Zap, TrendingUp } from "lucide-react";
import WalletButton from "@/components/WalletButton";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Peapods Meme Launchpad
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            Launch
          </a>
          <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
            Trending
          </a>
          <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
            Portfolio
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </Button>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;