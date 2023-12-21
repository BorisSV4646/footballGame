const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const HeadSoccerRubies = await ethers.getContractFactory("HeadSoccerRubies");
  const RubiesToken = await HeadSoccerRubies.deploy(
    process.env.WALLET_ADDRESS,
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
  );
  await RubiesToken.waitForDeployment();

  console.log(`Contract deployed ${await RubiesToken.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
