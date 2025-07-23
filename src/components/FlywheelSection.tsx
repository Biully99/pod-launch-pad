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

        {/* Flywheel Diagram */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="relative">
            {/* Central Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-32 h-32 gradient-primary rounded-full flex items-center justify-center animate-pulse border-4 border-primary/30">
                <RefreshCw className="h-16 w-16 text-primary-foreground animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>

            {/* Wheel Container */}
            <div className="relative w-96 h-96 mx-auto">
              {[
                { 
                  icon: Coins, 
                  title: "Deposit Tokens", 
                  desc: "Single-sided deposit", 
                  color: "primary",
                  angle: 0 // 12 o'clock
                },
                { 
                  icon: TrendingUp, 
                  title: "Get LP Position", 
                  desc: "Automatic LP creation", 
                  color: "secondary",
                  angle: 90 // 3 o'clock
                },
                { 
                  icon: CreditCard, 
                  title: "Borrow USDC/WETH", 
                  desc: "Use LP as collateral", 
                  color: "accent",
                  angle: 180 // 6 o'clock
                },
                { 
                  icon: ShoppingCart, 
                  title: "Buy Back Tokens", 
                  desc: "Market buy your chart", 
                  color: "primary",
                  angle: 270 // 9 o'clock
                }
              ].map((step, index) => {
                const radius = 140;
                const angleInRadians = (step.angle * Math.PI) / 180;
                const x = radius * Math.cos(angleInRadians - Math.PI / 2);
                const y = radius * Math.sin(angleInRadians - Math.PI / 2);
                
                return (
                  <div 
                    key={index} 
                    className="absolute"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <Card className={`gradient-card border-${step.color}/20 p-4 text-center hover-scale transition-all duration-300 group w-32`}>
                      <div className={`w-12 h-12 gradient-${step.color} rounded-full flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                        <step.icon className={`h-6 w-6 text-${step.color}-foreground`} />
                      </div>
                      <h3 className="font-bold text-sm mb-1">{step.title}</h3>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                      <div className={`text-lg font-bold text-${step.color} mt-1`}>
                        {index + 1}
                      </div>
                    </Card>
                  </div>
                );
              })}

              {/* Connecting Arrows in Circle */}
              {[0, 1, 2, 3].map((index) => {
                const currentAngle = index * 90;
                const nextAngle = ((index + 1) % 4) * 90;
                const midAngle = currentAngle + 45;
                const radius = 120;
                const angleInRadians = (midAngle * Math.PI) / 180;
                const x = radius * Math.cos(angleInRadians - Math.PI / 2);
                const y = radius * Math.sin(angleInRadians - Math.PI / 2);
                
                return (
                  <div 
                    key={`arrow-${index}`}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: `translate(-50%, -50%) rotate(${midAngle + 90}deg)`
                    }}
                  >
                    <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* How It Works */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-primary">How The Flywheel Works</h3>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Single-Sided Token Deposit",
                  description: "Users deposit only your token (no paired assets needed). The protocol automatically creates LP positions using advanced AMM mechanics.",
                  icon: "🪙"
                },
                {
                  step: "2", 
                  title: "Automatic LP Position Creation",
                  description: "Each deposit generates liquidity provider positions. No impermanent loss risk since you're only depositing your own token.",
                  icon: "💧"
                },
                {
                  step: "3",
                  title: "Borrow Against LP Value",
                  description: "Use your LP positions as collateral to borrow USDC/WETH. Borrowing capacity grows as token price and LP value increase.",
                  icon: "🏦"
                },
                {
                  step: "4",
                  title: "Execute Market Buybacks",
                  description: "Use borrowed funds to buy back your token from the market. This creates upward price pressure and increases LP value.",
                  icon: "📈"
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center font-bold text-primary-foreground group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <span>{item.icon}</span>
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Benefits */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-accent">Why This Is Revolutionary</h3>
            <div className="space-y-4">
              {[
                {
                  title: "Zero Impermanent Loss",
                  description: "Single-sided deposits mean no IL exposure. You maintain full upside potential while earning LP fees.",
                  icon: "🛡️"
                },
                {
                  title: "Infinite Buyback Loops", 
                  description: "Higher token price → More LP value → Greater borrow capacity → More buybacks → Higher price.",
                  icon: "🔄"
                },
                {
                  title: "No Sell Pressure",
                  description: "Token holders never need to sell. They can borrow against their LP positions instead.",
                  icon: "💎"
                },
                {
                  title: "Compounding Returns",
                  description: "Each buyback increases token price, LP value, and borrowing capacity exponentially.",
                  icon: "📊"
                },
                {
                  title: "Automated Liquidity Growth",
                  description: "Every new deposit automatically adds liquidity without requiring paired assets.",
                  icon: "🌊"
                },
                {
                  title: "Diamond Hands Incentive",
                  description: "The system rewards holding and borrowing over selling, creating natural diamond hands.",
                  icon: "💎"
                }
              ].map((benefit, index) => (
                <Card key={index} className="gradient-card border-accent/20 p-4 hover-scale transition-all duration-300 group">
                  <div className="flex gap-3 items-start">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{benefit.icon}</span>
                    <div>
                      <h4 className="font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
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