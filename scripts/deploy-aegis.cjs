const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("====================================================");
  console.log("DEPLOYING AEGIS PROTOCOL ON ROBINHOOD CHAIN");
  console.log("====================================================");
  console.log("Deployer Address:", deployer.address);
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer Balance:", hre.ethers.formatEther(balance), "ETH");

  if (balance === 0n) {
    throw new Error("Deployer balance is 0 ETH. Please fund the wallet with ETH on Robinhood Chain.");
  }

  // 1. Official USDG Staking Token on Robinhood Chain Mainnet
  const stakingTokenAddress = process.env.STAKE_TOKEN_ADDRESS || "0x5fc5360D0400a0Fd4f2af552ADD042D716F1d168";
  console.log("\n1. Staking Token (USDG):", stakingTokenAddress);

  // 2. Deploy Aegis ($AEGIS) Reward Token
  console.log("\n2. Deploying Aegis ($AEGIS) Reward Token...");
  const MockToken = await hre.ethers.getContractFactory("MockToken");
  const aegisToken = await MockToken.deploy("Aegis", "AEGIS", 18);
  await aegisToken.waitForDeployment();
  const rewardTokenAddress = await aegisToken.getAddress();
  console.log(">>> SUCCESS! $AEGIS Token deployed to:", rewardTokenAddress);

  // 3. Deploy Layer5Staking Contract
  // Initial reward rate: 0.0005 AEGIS / second (~43.2 AEGIS/day)
  const initialRewardRate = hre.ethers.parseUnits("0.0005", 18);
  console.log("\n3. Deploying Aegis Staking Vault Contract...");
  const Layer5Staking = await hre.ethers.getContractFactory("Layer5Staking");
  const stakingContract = await Layer5Staking.deploy(
    stakingTokenAddress,
    rewardTokenAddress,
    initialRewardRate
  );
  await stakingContract.waitForDeployment();
  const stakingContractAddress = await stakingContract.getAddress();
  console.log(">>> SUCCESS! Aegis Staking Vault deployed to:", stakingContractAddress);

  // 4. Fund Staking Contract with initial reward pool (1,000,000 AEGIS)
  console.log("\n4. Funding Staking Vault with 1,000,000 $AEGIS rewards...");
  const fundAmount = hre.ethers.parseUnits("1000000", 18);
  const fundTx = await aegisToken.transfer(stakingContractAddress, fundAmount);
  await fundTx.wait();
  console.log(">>> SUCCESS! Staking Vault funded. TxHash:", fundTx.hash);

  // 5. Update .env file
  console.log("\n5. Updating .env configuration file...");
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");

    envContent = envContent.replace(
      /NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS="${stakingContractAddress}"`
    );
    envContent = envContent.replace(
      /STAKING_CONTRACT_ADDRESS=.*/,
      `STAKING_CONTRACT_ADDRESS="${stakingContractAddress}"`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_REWARD_TOKEN_ADDRESS=.*/,
      `NEXT_PUBLIC_REWARD_TOKEN_ADDRESS="${rewardTokenAddress}"`
    );
    envContent = envContent.replace(
      /REWARD_TOKEN_ADDRESS=.*/,
      `REWARD_TOKEN_ADDRESS="${rewardTokenAddress}"`
    );
    envContent = envContent.replace(
      /NEXT_PUBLIC_STAKE_TOKEN_ADDRESS=.*/,
      `NEXT_PUBLIC_STAKE_TOKEN_ADDRESS="${stakingTokenAddress}"`
    );
    envContent = envContent.replace(
      /STAKE_TOKEN_ADDRESS=.*/,
      `STAKE_TOKEN_ADDRESS="${stakingTokenAddress}"`
    );

    fs.writeFileSync(envPath, envContent, "utf-8");
    console.log(">>> SUCCESS! .env file updated.");
  }

  console.log("\n====================================================");
  console.log("DEPLOYMENT COMPLETE & LIVE!");
  console.log("====================================================");
  console.log("Network: Robinhood Chain (ID: 4663)");
  console.log("$AEGIS Token CA:", rewardTokenAddress);
  console.log("Staking Vault CA:", stakingContractAddress);
  console.log("Staked Asset (USDG):", stakingTokenAddress);
  console.log("====================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
