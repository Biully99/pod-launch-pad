import { Card } from "@/components/ui/card";
import { Rocket, Shield, Zap, TrendingUp, Users, Lock } from "lucide-react";
import LaunchDialog from "@/components/LaunchDialog";

const features = [
  {
    icon: Rocket,
    title: "The Flywheel Effect",
    description: "Create token → Pod it → Lenders deposit USDC/WETH → You borrow against treasury → Buy back your chart. Infinite money glitch unlocked.",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Shield,
    title: "Borrow Against Your Bag", 
    description: "Use your memecoin treasury as collateral to borrow USDC/WETH. No selling needed, just pure leverage autism.",
    color: "text-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Zap,
    title: "Lender Yield Farming",
    description: "Degens deposit USDC/WETH to earn yield from your borrows. They get paid, you get liquidity. Everyone wins except jeets.",
    color: "text-accent",
    glow: "glow-accent",
  },
  {
    icon: TrendingUp,
    title: "Chart Buyback Machine",
    description: "Borrow → Buy back your token → Price goes up → Repeat. The ultimate diamond hands strategy that pumps your own bags.",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Users,
    title: "Treasury Growth Loop",
    description: "As token price rises, treasury value increases, borrow capacity grows, more buybacks possible. It's like printing money but legal.",
    color: "text-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Lock,
    title: "No Rug Mechanics",
    description: "Everything's on-chain and automated. Can't rug what's coded into the smart contract. Pure trustless degeneracy.",
    color: "text-accent",
    glow: "glow-accent",
  },
];

const LaunchSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            The Memecoin Flywheel (For Smoothbrains)
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
            The most based borrowing mechanism ever created. Turn your meme treasury into infinite buyback fuel. 
            This is how you diamond hand like Saylor but with 100x more autism.
          </p>
          <div className="mb-12">
            <LaunchDialog />
          </div>
        </div>

        {/* How It Works Section - The Flywheel */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Create Your Meme", desc: "Deploy token with borrowing mechanics", detail: "Launch your memecoin with built-in treasury and borrowing capabilities" },
              { step: "2", title: "Pod The Token", desc: "Set up lending pool for degens", detail: "Create a pod where lenders can deposit USDC/WETH to earn yield from your borrows" },
              { step: "3", title: "Borrow & Buy", desc: "Use treasury as collateral", detail: "Borrow against your token holdings to buy back your own chart without selling" },
              { step: "4", title: "Flywheel Activated", desc: "Price up → Borrow more → Repeat", detail: "Higher price = bigger treasury = more borrow capacity = more buybacks = moon" },
            ].map((item, index) => (
              <Card key={index} className="gradient-card border-accent/20 p-6 text-center hover:scale-105 transition-transform group">
                <div className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 text-accent-foreground font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-2 text-card-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                <p className="text-xs text-muted-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity">{item.detail}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Why This Flywheel Is Different
          </h3>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
            Every other token dies because founders dump. This flywheel makes dumping impossible - you literally profit more by buying back your own chart.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="gradient-card border-primary/20 p-6 hover:scale-105 transition-all duration-300 group">
              <div className={`w-12 h-12 rounded-lg ${feature.glow} gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`h-6 w-6 text-primary-foreground`} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LaunchSection;