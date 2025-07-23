import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FlywheelSection from "@/components/FlywheelSection";
import WalletFlowSection from "@/components/WalletFlowSection";
import LaunchSection from "@/components/LaunchSection";
import TrendingTokens from "@/components/TrendingTokens";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FlywheelSection />
      <WalletFlowSection />
      <LaunchSection />
      <TrendingTokens />
      <Footer />
    </div>
  );
};

export default Index;
