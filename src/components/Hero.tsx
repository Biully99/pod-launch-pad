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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight animate-fade-in">
            Single-Sided LP
            <br />
            <span className="text-4xl md:text-6xl">Flywheel</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Launch tokens with automated buyback mechanics. Users add single-sided liquidity, borrow against their LP positions, and the protocol uses fees to continuously buy back tokens - creating an infinite loop that drives price up.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-4 text-center">
              <div className="text-lg font-semibold text-primary mb-1">1. Add Liquidity</div>
              <div className="text-sm text-muted-foreground">Single-sided deposits, no impermanent loss</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-secondary/20 rounded-lg p-4 text-center">
              <div className="text-lg font-semibold text-secondary mb-1">2. Borrow & Earn</div>
              <div className="text-sm text-muted-foreground">Use LP as collateral for leveraged positions</div>
            </div>
            <div className="bg-card/50 backdrop-blur-sm border border-accent/20 rounded-lg p-4 text-center">
              <div className="text-lg font-semibold text-accent mb-1">3. Auto Buyback</div>
              <div className="text-sm text-muted-foreground">Protocol fees continuously pump your bags</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <LaunchDialog />
            <Button variant="outline" size="xl" className="hover-scale" onClick={() => document.getElementById('flywheel')?.scrollIntoView({ behavior: 'smooth' })}>
              <TrendingUp className="h-5 w-5" />
              Learn The Flywheel
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Card className="gradient-card border-primary/20 p-6 text-center hover-scale transition-all duration-300 group">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground">Buyback Loops</div>
            </Card>
            
            <Card className="gradient-card border-secondary/20 p-6 text-center hover-scale transition-all duration-300 group">
              <Zap className="h-8 w-8 text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold text-secondary">📈</div>
              <div className="text-sm text-muted-foreground">Only Number Go Up</div>
            </Card>
            
            <Card className="gradient-card border-accent/20 p-6 text-center hover-scale transition-all duration-300 group">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold text-accent">💎</div>
              <div className="text-sm text-muted-foreground">Diamond Hands Tech</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;