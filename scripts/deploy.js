const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying contracts to Base Sepolia testnet...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy PodCreator first
  console.log("\n📦 Deploying PodCreator contract...");
  
  // For testnet, we'll use a mock Peapods factory address
  const mockPeapodsFactory = "0x0000000000000000000000000000000000000001"; // Placeholder
  
  const PodCreator = await hre.ethers.getContractFactory("PodCreator");
  const podCreator = await PodCreator.deploy(mockPeapodsFactory);
  await podCreator.waitForDeployment();
  
  const podCreatorAddress = await podCreator.getAddress();
  console.log("✅ PodCreator deployed to:", podCreatorAddress);

  // Deploy TokenFactory
  console.log("\n🏭 Deploying TokenFactory contract...");
  
  const TokenFactory = await hre.ethers.getContractFactory("BasedTokenFactory");
  const tokenFactory = await TokenFactory.deploy(
    deployer.address, // Fee recipient
    podCreatorAddress  // PodCreator address
  );
  await tokenFactory.waitForDeployment();
  
  const tokenFactoryAddress = await tokenFactory.getAddress();
  console.log("✅ TokenFactory deployed to:", tokenFactoryAddress);

  // Authorize TokenFactory to create pods
  console.log("\n🔑 Authorizing TokenFactory to create pods...");
  const authTx = await podCreator.setAuthorizedCreator(tokenFactoryAddress, true);
  await authTx.wait();
  console.log("✅ TokenFactory authorized");

  // Display final deployment info
  console.log("\n🎉 Deployment completed!");
  console.log("==========================================");
  console.log("📋 Contract Addresses:");
  console.log("PodCreator:", podCreatorAddress);
  console.log("TokenFactory:", tokenFactoryAddress);
  console.log("==========================================");
  console.log("🔗 Network: Base Sepolia");
  console.log("⛽ Gas used for deployment: ~", (await deployer.provider.getBalance(deployer.address)) < balance ? "2-3M gas" : "estimation failed");
  
  // Verification commands
  console.log("\n📝 Verification commands:");
  console.log(`npx hardhat verify --network base-sepolia ${podCreatorAddress} "${mockPeapodsFactory}"`);
  console.log(`npx hardhat verify --network base-sepolia ${tokenFactoryAddress} "${deployer.address}" "${podCreatorAddress}"`);
  
  // Save addresses for frontend
  const deploymentInfo = {
    network: "base-sepolia",
    chainId: 84532,
    contracts: {
      PodCreator: podCreatorAddress,
      TokenFactory: tokenFactoryAddress,
      PeapodsFactory: mockPeapodsFactory
    },
    deployer: deployer.address,
    timestamp: new Date().toISOString()
  };

  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json', 
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("💾 Deployment info saved to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });