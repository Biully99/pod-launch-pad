import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Wallet, PiggyBank, Users, RotateCcw, TrendingUp, DollarSign } from "lucide-react";

const WalletFlowSection = () => {
  const walletTypes = [
    {
      icon: TrendingUp,
      name: "LP Wallet",
      percentage: "75%",
      description: "Liquidity provision & trading fees",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: DollarSign,
      name: "Bribes Wallet", 
      percentage: "10%",
      description: "Governance incentives & rewards",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Users,
      name: "Team/Dev Wallet",
      percentage: "10%",
      description: "Development & maintenance fund",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: RotateCcw,
      name: "Buyback Wallet",
      percentage: "5%",
      description: "Automated token buybacks",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <section id="wallet-flow" className="py-20 relative bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            💰 Wallet Architecture
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Smart Token Distribution
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Every token launch creates a sophisticated multi-wallet ecosystem designed for sustainable growth and value creation.
          </p>
        </div>

        {/* Wallet Flow Visualization */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="relative bg-gradient-to-br from-background via-card/50 to-background rounded-3xl p-8 border border-border/50 shadow-2xl backdrop-blur-sm">
            
            {/* Central Token */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full shadow-lg mb-4">
                <Wallet className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">Your Token Launch</h3>
              <p className="text-sm text-muted-foreground">100% of supply distributed</p>
            </div>

            {/* Wallet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {walletTypes.map((wallet, index) => (
                <div key={index} className="relative group">
                  {/* Connection Line */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute -top-16 left-1/2 transform -translate-x-1/2">
                      <ArrowRight className="h-6 w-6 text-primary animate-pulse" style={{ animationDelay: `${index * 0.5}s` }} />
                    </div>
                  )}
                  {index >= 2 && (
                    <div className="hidden lg:block absolute -bottom-16 left-1/2 transform -translate-x-1/2 rotate-180">
                      <ArrowRight className="h-6 w-6 text-primary animate-pulse" style={{ animationDelay: `${index * 0.5}s` }} />
                    </div>
                  )}
                  
                  <Card className="relative bg-card/80 backdrop-blur-sm border border-border/50 p-6 text-center hover:border-primary/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl h-48">
                    {/* Percentage Badge */}
                    <div className={`absolute -top-3 -right-3 px-3 py-1 bg-gradient-to-r ${wallet.color} rounded-full text-white font-bold text-sm shadow-lg`}>
                      {wallet.percentage}
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-r ${wallet.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <wallet.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{wallet.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{wallet.description}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Flow Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="bg-card/40 backdrop-blur-sm border border-border/30 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h4 className="font-semibold">Automated Distribution</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Token supply is automatically distributed across specialized wallets upon launch completion.
                </p>
              </Card>
              
              <Card className="bg-card/40 backdrop-blur-sm border border-border/30 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h4 className="font-semibold">Smart Mechanics</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  Each wallet serves a specific purpose in creating sustainable token economics and growth.
                </p>
              </Card>
              
              <Card className="bg-card/40 backdrop-blur-sm border border-border/30 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h4 className="font-semibold">Continuous Value</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  The system creates ongoing value through LP rewards, buybacks, and community incentives.
                </p>
              </Card>
            </div>
          </div>
        </div>

        {/* Integration Note */}
        <div className="text-center">
          <Card className="gradient-card border-primary/20 p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-4">
              <PiggyBank className="h-8 w-8 text-primary" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Peapods Integration
              </h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Each token automatically creates a Peapods Pod for advanced DeFi mechanics including single-sided LP positions and zero impermanent loss strategies.
            </p>
            <Badge variant="secondary" className="text-sm">
              🟢 Fully Automated
            </Badge>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WalletFlowSection;