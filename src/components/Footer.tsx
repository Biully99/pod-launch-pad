import { Zap, Twitter, Github, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Peapods Meme Launchpad
            </span>
            </div>
            <p className="text-muted-foreground mb-4">
              The ultimate permissionless meme token launchpad with Peapods integration.
            </p>
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                <Twitter className="h-4 w-4 text-primary" />
              </div>
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center hover:bg-accent/30 transition-colors cursor-pointer">
                <Github className="h-4 w-4 text-accent" />
              </div>
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center hover:bg-secondary/30 transition-colors cursor-pointer">
                <MessageCircle className="h-4 w-4 text-secondary" />
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-card-foreground">Platform</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Launch Token</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Trending</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Analytics</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Portfolio</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-card-foreground">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Documentation</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">API</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Support</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-accent transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-card-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-secondary transition-colors">Risk Disclaimer</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 PeapodPump. All rights reserved. Trade responsibly.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;