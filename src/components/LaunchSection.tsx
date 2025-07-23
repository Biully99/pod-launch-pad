import { Card } from "@/components/ui/card";
import { Rocket, Shield, Zap, TrendingUp, Users, Lock } from "lucide-react";
import LaunchDialog from "@/components/LaunchDialog";

const features = [
  {
    icon: Rocket,
    title: "Volatility Farming Ready",
    description: "Launch memecoins designed for Peapods' proven volatility farming strategies and yield generation",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Shield,
    title: "Institutional Security",
    description: "Battle-tested infrastructure managing $51M+ TVL with audited smart contracts and risk management",
    color: "text-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Zap,
    title: "MicroStrategy Philosophy",
    description: "Think beyond quick pumps - build lasting value with institutional-grade tokenomics and strategy",
    color: "text-accent",
    glow: "glow-accent",
  },
  {
    icon: TrendingUp,
    title: "Peapods Ecosystem",
    description: "Tap into the existing Peapods community of sophisticated DeFi users and yield farmers",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Users,
    title: "Yield-First Design",
    description: "Memecoins that generate real yield through integration with Peapods' LVF (Leveraged Volatility Farming)",
    color: "text-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Lock,
    title: "Cross-Pod Synergy",
    description: "Integrate with existing Peapods pods and leverage multi-asset strategies for sustained growth",
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
            Why Peapods for Memecoins?
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
            Leverage Peapods' proven DeFi infrastructure and volatility farming expertise to launch memecoins that last. 
            The institutional way to turn memes into sustainable assets.
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
            The Peapods Advantage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Design Yield Strategy", desc: "Create volatility farming mechanisms" },
              { step: "2", title: "Deploy on Peapods", desc: "Leverage $51M+ TVL infrastructure" },
              { step: "3", title: "Create LVF Pod", desc: "Turn volatility into yield" },
              { step: "4", title: "Scale Institutionally", desc: "Build MicroStrategy-level conviction" },
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