const hre = require("hardhat");

async function main() {
  const [owner] = await hre.ethers.getSigners();
  const vaultAddress = process.env.STAKING_CONTRACT_ADDRESS || "0xFFcE33D1deFeC8fa9E9606B398922DCC74eA81B8";
  const tokenAddress = "0x072cbbe76b64851af9b527abdbf1ce0039b1f09d";

  console.log("====================================================");
  console.log("RECOVERING TOKEN FROM VAULT");
  console.log("====================================================");
  console.log("Owner Address:", owner.address);
  console.log("Vault Address:", vaultAddress);
  console.log("Token Address to Recover:", tokenAddress);

  // 1. Check Vault Contract & Owner
  const vault = await hre.ethers.getContractAt("Layer5Staking", vaultAddress);
  const vaultOwner = await vault.owner();
  console.log("Vault Registered Owner:", vaultOwner);

  if (vaultOwner.toLowerCase() !== owner.address.toLowerCase()) {
    throw new Error(`Owner mismatch! Vault owner is ${vaultOwner}, but signer is ${owner.address}`);
  }

  // 2. Check Token Balance inside Vault
  const token = await hre.ethers.getContractAt([
    "function balanceOf(address) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
  ], tokenAddress);

  const decimals = await token.decimals();
  const symbol = await token.symbol();
  const vaultBalance = await token.balanceOf(vaultAddress);
  console.log(`Vault Balance of ${symbol}:`, hre.ethers.formatUnits(vaultBalance, decimals));

  if (vaultBalance === 0n) {
    console.log("No balance found in vault for this token!");
    return;
  }

  // 3. Execute recoverERC20
  console.log(`\nExecuting recoverERC20 to transfer all ${hre.ethers.formatUnits(vaultBalance, decimals)} ${symbol} to ${owner.address}...`);
  const tx = await vault.recoverERC20(tokenAddress, vaultBalance);
  console.log("Transaction sent! TxHash:", tx.hash);
  console.log("Waiting for confirmation...");
  await tx.wait();

  // 4. Verify Owner Balance
  const ownerBalance = await token.balanceOf(owner.address);
  console.log("\n====================================================");
  console.log("RECOVERY SUCCESSFUL!");
  console.log(`Owner (${owner.address}) New Balance:`, hre.ethers.formatUnits(ownerBalance, decimals), symbol);
  console.log("====================================================");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Recovery failed:", err);
    process.exit(1);
  });
