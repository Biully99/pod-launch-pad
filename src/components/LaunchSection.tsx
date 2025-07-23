import { Card } from "@/components/ui/card";
import { Rocket, Shield, Zap, TrendingUp, Users, Lock } from "lucide-react";
import LaunchDialog from "@/components/LaunchDialog";

const features = [
  {
    icon: Rocket,
    title: "Anon-Proof Yield Farming",
    description: "Your memes generate actual yield through volatility farming. No more hoping for pumps, we farm the volatility itself",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Shield,
    title: "Rug-Proof Infrastructure", 
    description: "Built on $51M+ TVL. Can't rug what's already battle-tested by actual degens with real money",
    color: "text-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Zap,
    title: "Big Brain Strategy",
    description: "MicroStrategy for memes. Buy, hold, farm yield, repeat. Simple strategy, maximum autism execution",
    color: "text-accent",
    glow: "glow-accent",
  },
  {
    icon: TrendingUp,
    title: "Degen Community",
    description: "Join the most based community of yield farmers and meme strategists. No normies allowed",
    color: "text-primary",
    glow: "glow-primary",
  },
  {
    icon: Users,
    title: "Yield-First Memes",
    description: "Memes that actually make money through LVF integration. Finally, autism that pays dividends",
    color: "text-secondary",
    glow: "glow-secondary",
  },
  {
    icon: Lock,
    title: "Chad Pod Synergy",
    description: "Stack multiple pods like a true sigma. Multi-asset strategies for maximum portfolio domination",
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
            How It Works (For Smoothbrains)
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
            Step-by-step guide to launching memes that actually farm yield instead of hoping for lucky pumps. 
            Even your wife's boyfriend could understand this.
          </p>
          <div className="mb-12">
            <LaunchDialog />
          </div>
        </div>

        {/* How It Works Section - MOVED UP */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Create Your Meme", desc: "Deploy token with yield mechanics" },
              { step: "2", title: "Stack The Pods", desc: "Leverage $51M+ TVL infrastructure" },
              { step: "3", title: "Farm The Volatility", desc: "Turn market chaos into steady gains" },
              { step: "4", title: "Diamond Hand", desc: "Hold like Saylor, earn like a chad" },
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

        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
            Why This Isn't Another Rug
          </h3>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
            Built different. These features separate the chads from the jeets.
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