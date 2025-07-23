import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrendingTokens from "@/components/TrendingTokens";
import LaunchSection from "@/components/LaunchSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrendingTokens />
      <LaunchSection />
      <Footer />
    </div>
  );
};

export default Index;
