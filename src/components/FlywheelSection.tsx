import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowDown, RefreshCw, TrendingUp, Coins, CreditCard, ShoppingCart, Repeat } from "lucide-react";

const FlywheelSection = () => {
  return (
    <section id="flywheel" className="py-20 relative bg-card/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30">
            🔄 The Flywheel
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Single-Sided LP Flywheel Mechanics
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            The most advanced memecoin buyback system ever created. Deposit tokens, get LP positions, 
            borrow against them, and create infinite buyback loops with zero impermanent loss.
          </p>
        </div>

        {/* Modern Flywheel Diagram */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="relative bg-gradient-to-br from-background via-card/50 to-background rounded-3xl p-8 border border-border/50 shadow-2xl backdrop-blur-sm">
            
            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                {/* Outer Ring */}
                <div className="w-40 h-40 rounded-full border-4 border-primary/20 animate-spin" style={{ animationDuration: "20s" }}></div>
                
                {/* Inner Core */}
                <div className="absolute inset-4 bg-gradient-to-br from-primary via-primary/80 to-primary/60 rounded-full flex items-center justify-center shadow-lg border-2 border-primary/30">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 text-primary-foreground mx-auto mb-1 animate-spin" style={{ animationDuration: "4s" }} />
                    <div className="text-xs font-bold text-primary-foreground">INFINITE</div>
                    <div className="text-xs font-medium text-primary-foreground/80">LOOP</div>
                  </div>
                </div>
                
                {/* Pulsing Glow */}
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-md"></div>
              </div>
            </div>

            {/* Flow Steps Container */}
            <div className="relative w-[500px] h-[500px] mx-auto">
              {[
                { 
                  icon: Coins, 
                  title: "Deposit Tokens", 
                  desc: "Single-sided deposit", 
                  detail: "Zero IL risk",
                  type: "input",
                  angle: 270,
                  step: 1
                },
                { 
                  icon: TrendingUp, 
                  title: "Get LP Position", 
                  desc: "Automatic LP creation", 
                  detail: "Instant liquidity",
                  type: "process",
                  angle: 0,
                  step: 2
                },
                { 
                  icon: CreditCard, 
                  title: "Borrow USDC/WETH", 
                  desc: "Use LP as collateral", 
                  detail: "Leverage position",
                  type: "process",
                  angle: 90,
                  step: 3
                },
                { 
                  icon: ShoppingCart, 
                  title: "Buy Back Tokens", 
                  desc: "Market buy pressure", 
                  detail: "Price appreciation",
                  type: "output",
                  angle: 180,
                  step: 4
                }
              ].map((step, index) => {
                const radius = 180;
                const angleInRadians = (step.angle * Math.PI) / 180;
                const x = radius * Math.cos(angleInRadians - Math.PI / 2);
                const y = radius * Math.sin(angleInRadians - Math.PI / 2);
                
                const getStepColors = (type: string) => {
                  switch(type) {
                    case 'input': return 'from-emerald-500 to-emerald-600';
                    case 'output': return 'from-blue-500 to-blue-600';
                    default: return 'from-violet-500 to-violet-600';
                  }
                };
                
                return (
                  <div 
                    key={index} 
                    className="absolute group cursor-pointer"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Step Card */}
                    <div className="relative">
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${getStepColors(step.type)} rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 scale-110`}></div>
                      
                      {/* Main Card */}
                      <Card className="relative bg-card/80 backdrop-blur-sm border border-border/50 p-6 text-center hover:border-primary/50 transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl w-40 h-40 flex flex-col justify-between">
                        {/* Step Number Badge */}
                        <div className={`absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r ${getStepColors(step.type)} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform`}>
                          {step.step}
                        </div>
                        
                        {/* Icon */}
                        <div className={`w-14 h-14 bg-gradient-to-r ${getStepColors(step.type)} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <step.icon className="h-7 w-7 text-white" />
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-1">
                          <h3 className="font-bold text-sm leading-tight">{step.title}</h3>
                          <p className="text-xs text-muted-foreground">{step.desc}</p>
                          <p className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">{step.detail}</p>
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })}

              {/* Animated Flow Arrows */}
              {[0, 1, 2, 3].map((index) => {
                const currentAngle = index * 90;
                const midAngle = currentAngle + 45;
                const radius = 140;
                const angleInRadians = (midAngle * Math.PI) / 180;
                const x = radius * Math.cos(angleInRadians - Math.PI / 2);
                const y = radius * Math.sin(angleInRadians - Math.PI / 2);
                
                return (
                  <div 
                    key={`arrow-${index}`}
                    className="absolute z-10"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: `translate(-50%, -50%) rotate(${midAngle + 90}deg)`
                    }}
                  >
                    {/* Arrow Trail */}
                    <div className="relative">
                      <div className="w-8 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
                      <ArrowRight className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-bounce" style={{ animationDelay: `${index * 0.5}s` }} />
                    </div>
                  </div>
                );
              })}
              
              {/* Orbital Rings */}
              <div className="absolute inset-0 border border-primary/10 rounded-full animate-spin" style={{ animationDuration: "30s" }}></div>
              <div className="absolute inset-8 border border-primary/5 rounded-full animate-spin" style={{ animationDuration: "25s", animationDirection: "reverse" }}></div>
            </div>
            
            {/* Flow Direction Indicator */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground bg-card/50 backdrop-blur-sm px-3 py-2 rounded-full border border-border/30">
              <Repeat className="h-3 w-3" />
              <span>Continuous Loop</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="gradient-card border-primary/20 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ready to Launch Your Flywheel?
            </h3>
            <p className="text-muted-foreground mb-6">
              Deploy your memecoin with built-in single-sided LP mechanics and start the infinite buyback loop.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover-scale transition-all duration-300"
              >
                Launch Token Now 🚀
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FlywheelSection;