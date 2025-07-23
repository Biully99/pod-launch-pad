import { Card } from "@/components/ui/card";
import { Rocket, Shield, Zap, TrendingUp, Users, Lock } from "lucide-react";
import LaunchDialog from "@/components/LaunchDialog";

const features = [
  {
    icon: Rocket,
    title: "The LP Flywheel Effect",
    description: "Create token → Deposit single-sided → Get LP positions → Borrow against LP → Buy back chart → Repeat. Infinite liquidity machine.",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Shield,
    title: "Single-Sided LP Deposits", 
    description: "Deposit only your token to get LP positions. No need for paired assets. Your tokens automatically become liquidity providers.",
    color: "text-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Zap,
    title: "Borrow Against LP",
    description: "Use your LP positions as collateral to borrow USDC/WETH. Every deposit increases your borrowing power automatically.",
    color: "text-accent",
    glow: "glow-accent",
  },
  {
    icon: TrendingUp,
    title: "Automated Buyback Loop",
    description: "Borrow → Buy back tokens → Deposit new tokens → Get more LP → Borrow more → Repeat. Chart only goes up.",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Users,
    title: "LP Value Appreciation",
    description: "As token price rises, LP positions become worth more, borrow capacity grows, more buybacks possible. Exponential gains.",
    color: "text-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Lock,
    title: "No Impermanent Loss Risk",
    description: "Single-sided deposits mean no IL exposure. You only deposit your token, maintain full upside, while earning LP fees.",
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
            The Single-Sided LP Flywheel (For Big Brains)
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
            The most advanced single-sided liquidity system ever created. Deposit your tokens, get LP positions, 
            borrow against them, and create infinite buyback loops. This is how you farm your own chart to the moon.
          </p>
          <div className="mb-12">
            <LaunchDialog />
          </div>
        </div>

        {/* How It Works Section - The Flywheel */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "🌱", title: "Create & Deploy", desc: "Launch token with LP mechanics", detail: "Deploy your memecoin with built-in single-sided LP functionality" },
              { step: "💧", title: "Single-Sided Deposit", desc: "Deposit tokens for LP positions", detail: "Add liquidity using only your token - no paired assets needed" },
              { step: "💰", title: "Borrow Against LP", desc: "Use LP as collateral", detail: "Borrow USDC/WETH against your growing LP positions" },
              { step: "🚀", title: "Buyback & Repeat", desc: "Buy back → Deposit → Compound", detail: "Create infinite loops of buybacks and liquidity growth" },
            ].map((item, index) => (
              <Card key={index} className="gradient-card border-accent/20 p-6 text-center hover:scale-105 transition-transform group">
                <div className="w-12 h-12 gradient-accent rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
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
            Why Single-Sided LP is Superior
          </h3>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
            Traditional LP requires paired assets and exposes you to impermanent loss. Our system lets you deposit only your token while maintaining full upside.
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