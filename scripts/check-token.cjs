const hre = require("hardhat");

async function main() {
  const tokenAddr = "0x072cbbe76b64851af9b527abdbf1ce0039b1f09d";
  console.log("Checking token:", tokenAddr);
  const code = await hre.ethers.provider.getCode(tokenAddr);
  console.log("Code length:", code.length);

  if (code.length > 2) {
    const token = await hre.ethers.getContractAt([
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)"
    ], tokenAddr);

    try {
      const name = await token.name();
      const symbol = await token.symbol();
      const decimals = await token.decimals();
      const total = await token.totalSupply();
      console.log(`Verified Token: ${name} (${symbol}), Decimals: ${decimals}`);
      console.log("Total Supply:", hre.ethers.formatUnits(total, decimals));
      
      const [signer] = await hre.ethers.getSigners();
      const bal = await token.balanceOf(signer.address);
      console.log("Deployer balance:", hre.ethers.formatUnits(bal, decimals));
    } catch (e) {
      console.error("Error reading token:", e.message);
    }
  } else {
    console.log("No code at this address!");
  }
}

main().catch(console.error);
