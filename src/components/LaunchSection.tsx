import { Card } from "@/components/ui/card";
import { Rocket, Shield, Zap, TrendingUp, Users, Lock } from "lucide-react";
import LaunchDialog from "@/components/LaunchDialog";

const features = [
  {
    icon: Rocket,
    title: "Instant Launch",
    description: "Deploy your meme token in seconds with our streamlined process",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Shield,
    title: "Secure LP Lock",
    description: "Automatic liquidity locking via Peapods for maximum security",
    color: "text-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Zap,
    title: "Uniswap V3 LP",
    description: "Automatic LP creation on Uniswap V3 with optimal range",
    color: "text-accent",
    glow: "glow-accent",
  },
  {
    icon: TrendingUp,
    title: "Fair Launch",
    description: "Permissionless and fair launch mechanism for everyone",
    color: "text-warning",
    glow: "glow-primary",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built for meme communities with social features",
    color: "text-success",
    glow: "glow-secondary",
  },
  {
    icon: Lock,
    title: "Pod Integration",
    description: "Leverage Peapods Finance for advanced DeFi features",
    color: "text-primary",
    glow: "glow-accent",
  },
];

const LaunchSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            Launch Your Meme Token
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
            The most advanced meme token launchpad with built-in Peapods integration. 
            No coding required, just pure meme magic.
          </p>
          <div className="mb-12">
            <LaunchDialog />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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

        {/* Launch Process */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-card-foreground">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Create Token", desc: "Name, symbol & image" },
              { step: "2", title: "Set Parameters", desc: "Cap, allocation & timing" },
              { step: "3", title: "Deploy Contracts", desc: "One-click deployment" },
              { step: "4", title: "Auto LP & Pod", desc: "Uniswap V3 + Peapods" },
            ].map((item, index) => (
              <Card key={index} className="gradient-card border-accent/20 p-6 text-center hover:scale-105 transition-transform">
                <div className="w-8 h-8 gradient-accent rounded-full flex items-center justify-center mx-auto mb-3 text-accent-foreground font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-2 text-card-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaunchSection;