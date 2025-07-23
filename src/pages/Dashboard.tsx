import TokenDashboard from "@/components/TokenDashboard";
import ContributionBox from "@/components/ContributionBox";
import UserPortfolio from "@/components/UserPortfolio";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const { tokenAddress } = useParams();
  
  // If no token address, show user portfolio
  if (!tokenAddress) {
    return <UserPortfolio />;
  }
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock token data - in real app this would come from contract calls
  const mockTokenData = {
    name: "Based Pepe",
    symbol: "BPEPE", 
    totalSupply: "1,000,000",
    fundraisingTarget: "0.001",
    fundraisedAmount: "0.0007",
    hardcap: "0.001",
    contributorCount: 12,
    tradingEnabled: false,
    liquidityAdded: false,
    podCreated: false
  };

  useEffect(() => {
    // Simulate loading token data
    const loadTokenData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTokenData(mockTokenData);
      setLoading(false);
    };

    if (tokenAddress) {
      loadTokenData();
    }
  }, [tokenAddress]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading token data...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tokenData) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Token Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The token address {tokenAddress} could not be found or is invalid.
            </p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Launch
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Token Management Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your token's wallets, monitor fundraising, and track system status
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Token Dashboard */}
          <div className="lg:col-span-2">
            <TokenDashboard 
              tokenAddress={tokenAddress}
              tokenData={tokenData}
            />
          </div>
          
          {/* Right Column - Contribution Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <ContributionBox 
                tokenAddress={tokenAddress || ""}
                tokenData={tokenData}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;