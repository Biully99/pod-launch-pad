import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Zap, TrendingUp, DollarSign } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Meme Launchpad Hero" 
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
            Launch Memes,
            <br />
            Create Legends
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The ultimate permissionless launchpad. Create tokens instantly, build communities, 
            and ride the wave to the moon with Peapods integration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl" className="group">
              <Rocket className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Launch Your Token
            </Button>
            <Button variant="outline" size="xl">
              <TrendingUp className="h-5 w-5" />
              Explore Trending
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="gradient-card border-primary/20 p-6 text-center hover:scale-105 transition-transform">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">$2.4M+</div>
              <div className="text-sm text-muted-foreground">Total Volume</div>
            </Card>
            
            <Card className="gradient-card border-secondary/20 p-6 text-center hover:scale-105 transition-transform">
              <Zap className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">1,247</div>
              <div className="text-sm text-muted-foreground">Tokens Launched</div>
            </Card>
            
            <Card className="gradient-card border-accent/20 p-6 text-center hover:scale-105 transition-transform">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-accent">156%</div>
              <div className="text-sm text-muted-foreground">Avg. ROI</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;