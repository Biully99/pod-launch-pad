import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, DollarSign } from "lucide-react";

const mockTokens = [
  {
    id: 1,
    name: "Based Pepe",
    symbol: "BPEPE",
    image: "🐸",
    marketCap: "$1.2M",
    change24h: 156.7,
    holders: 2847,
    volume24h: "$234K",
    isNew: true,
  },
  {
    id: 2,
    name: "Moon Doge",
    symbol: "MDOGE",
    image: "🐕",
    marketCap: "$890K",
    change24h: 89.3,
    holders: 1924,
    volume24h: "$156K",
    isNew: false,
  },
  {
    id: 3,
    name: "Rocket Cat",
    symbol: "RCAT",
    image: "🚀",
    marketCap: "$567K",
    change24h: -12.4,
    holders: 1456,
    volume24h: "$89K",
    isNew: false,
  },
  {
    id: 4,
    name: "Diamond Hands",
    symbol: "DIAMOND",
    image: "💎",
    marketCap: "$2.1M",
    change24h: 234.5,
    holders: 3892,
    volume24h: "$445K",
    isNew: true,
  },
];

const TrendingTokens = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Trending Now
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the hottest meme tokens launched on PeapodPump
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockTokens.map((token, index) => (
            <Card key={token.id} className="gradient-card border-primary/20 p-6 hover:scale-105 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{token.image}</div>
                  <div>
                    <h3 className="font-bold text-card-foreground">{token.name}</h3>
                    <p className="text-sm text-muted-foreground">${token.symbol}</p>
                  </div>
                </div>
                {token.isNew && (
                  <Badge variant="outline" className="border-secondary text-secondary">
                    NEW
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Market Cap</span>
                  <span className="font-semibold">{token.marketCap}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">24h Change</span>
                  <div className={`flex items-center gap-1 ${token.change24h > 0 ? 'text-success' : 'text-destructive'}`}>
                    {token.change24h > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="font-semibold">{Math.abs(token.change24h)}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{token.holders.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{token.volume24h}</span>
                  </div>
                </div>
              </div>

              <Button 
                variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"} 
                size="sm" 
                className="w-full group-hover:scale-105 transition-transform"
              >
                Trade Now
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Tokens
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TrendingTokens;