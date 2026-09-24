const hre = require("hardhat");
async function main() {
  const [signer] = await hre.ethers.getSigners();
  console.log("Signer address:", signer.address);
  const bal = await hre.ethers.provider.getBalance(signer.address);
  console.log("Signer balance:", hre.ethers.formatEther(bal), "ETH");
}
main();
