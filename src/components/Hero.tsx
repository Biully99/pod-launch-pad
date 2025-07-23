import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, DollarSign, Zap } from "lucide-react";
import farmerPepeHero from "@/assets/farmer-pepe-hero.jpg";
import LaunchDialog from "@/components/LaunchDialog";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <img 
          src={farmerPepeHero} 
          alt="Farmer Pepe Cultivating Peas" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 gradient-hero" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 gradient-secondary rounded-full glow-secondary opacity-60" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: "1s" }}>
        <div className="w-12 h-12 gradient-accent rounded-full glow-accent opacity-60" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: "2s" }}>
        <div className="w-20 h-20 gradient-primary rounded-full glow-primary opacity-40" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
            Meme Market 
            <br />
            MicroStrategy
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Diamond hands only. Borrow against your meme treasury, buy back your chart, activate the flywheel. No selling, just infinite buyback loops.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <LaunchDialog />
            <Button variant="outline" size="xl">
              <TrendingUp className="h-5 w-5" />
              Check The Vault
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="gradient-card border-primary/20 p-6 text-center hover:scale-105 transition-transform">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Flywheel Loops</div>
            </Card>
            
            <Card className="gradient-card border-secondary/20 p-6 text-center hover:scale-105 transition-transform">
              <Zap className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">0%</div>
              <div className="text-sm text-muted-foreground">Sell Pressure</div>
            </Card>
            
            <Card className="gradient-card border-accent/20 p-6 text-center hover:scale-105 transition-transform">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">💎🙌</div>
              <div className="text-sm text-muted-foreground">Only Diamond Hands</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;