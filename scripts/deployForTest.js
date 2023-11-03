const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // const TestToken = await ethers.getContractFactory("TestToken");
  // const TestTokenContract = await TestToken.deploy(
  //   ethers.parseEther("100"),
  //   process.env.WALLET_ADDRESS
  // );
  // await TestTokenContract.waitForDeployment();

  // console.log(
  //   `TestToken contract deployed ${await TestTokenContract.getAddress()}`
  // );

  const HeadSoccerRubies = await ethers.getContractFactory("HeadSoccerRubies");
  const RubiesToken = await HeadSoccerRubies.deploy(
    ethers.parseEther("100"),
    process.env.WALLET_ADDRESS
  );
  await RubiesToken.waitForDeployment();

  console.log(`Poker contract deployed ${await RubiesToken.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
