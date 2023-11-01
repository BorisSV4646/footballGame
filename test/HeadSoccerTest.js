const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HeadSoccerRubies Deploy", function () {
  async function deployFixture() {
    const [owner, otherAccount1] = await ethers.getSigners();
    const HeadSoccerRubies = await ethers.getContractFactory(
      "HeadSoccerRubies"
    );
    const RubiesToken = await HeadSoccerRubies.deploy(
      ethers.parseEther("100"),
      owner
    );
    await RubiesToken.transfer(otherAccount1.address, ethers.parseEther("10"));
    const user1 = await RubiesToken.connect(otherAccount1);

    const TestToken = await ethers.getContractFactory("TestToken");
    const tokenTest = await TestToken.deploy(ethers.parseEther("100"), owner);

    return {
      owner,
      RubiesToken,
      otherAccount1,
      user1,
      tokenTest,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { owner, RubiesToken } = await loadFixture(deployFixture);
      expect(await RubiesToken.balanceOf(owner.address)).to.equal(
        ethers.parseEther("90")
      );
      expect(await RubiesToken.owner()).to.equal(owner.address);
    });
  });

  describe("ChangeCommission", function () {
    it("Function changeCommission work right", async function () {
      const { RubiesToken } = await loadFixture(deployFixture);
      await RubiesToken.changeCommission(33);
      expect(await RubiesToken.commissions()).to.equal(33);
    });

    it("Function changeCommission to be revert", async function () {
      const { otherAccount1, RubiesToken } = await loadFixture(deployFixture);
      await expect(RubiesToken.changeCommission(101)).to.be.reverted;
      const user1 = await RubiesToken.connect(otherAccount1);
      await expect(user1.changeCommission(10)).to.be.reverted;
    });
  });

  describe("playGameForRubie", function () {
    it("Function playGameForRubie work right", async function () {
      const { owner, otherAccount1, user1, RubiesToken } = await loadFixture(
        deployFixture
      );
      await expect(user1.playGameForRubie(ethers.parseEther("11"))).to.be
        .reverted;
      const playGame = await user1.playGameForRubie(ethers.parseEther("5"));
      await expect(playGame).to.changeTokenBalances(
        RubiesToken,
        [otherAccount1.address, owner.address],
        [-ethers.parseEther("5"), ethers.parseEther("1")]
      );

      await expect(playGame)
        .to.emit(RubiesToken, "PlayGame")
        .withArgs(ethers.parseEther("5"));
    });
  });

  describe("changeRubieToThings", function () {
    it("Function changeRubieToThings work right", async function () {
      const { otherAccount1, user1, RubiesToken } = await loadFixture(
        deployFixture
      );
      await expect(user1.playGameForRubie(ethers.parseEther("11"))).to.be
        .reverted;
      const changeFings = await user1.changeRubieToThings(
        ethers.parseEther("5")
      );
      await expect(changeFings).to.changeTokenBalance(
        RubiesToken,
        otherAccount1.address,
        -ethers.parseEther("5")
      );
      await expect(changeFings)
        .to.emit(RubiesToken, "ChangeRubies")
        .withArgs(ethers.parseEther("5"));
    });
  });

  // !You can test these functions after disabling the modifier validAddress(tokenAddress).
  /* describe("ChangeERC20toRubie and changeRubieToERC20", function () {
    it("Function changeERC20toRubie work right", async function () {
      const { RubiesToken, tokenTest, owner } = await loadFixture(
        deployFixture
      );
      const tokenTestAddress = await tokenTest.getAddress();
      const tokenRubiesAddress = await RubiesToken.getAddress();

      await tokenTest.approve(tokenRubiesAddress, ethers.parseEther("10"));
      const changeTokens = await RubiesToken.changeERC20toRubie(
        ethers.parseEther("10"),
        tokenTestAddress
      );

      await expect(changeTokens).to.changeTokenBalances(
        RubiesToken,
        [owner.address, tokenRubiesAddress],
        [ethers.parseEther("10"), 0]
      );
      await expect(changeTokens).to.changeTokenBalances(
        tokenTest,
        [owner.address, tokenRubiesAddress],
        [-10000000, 10000000]
      );

      await expect(changeTokens)
        .to.emit(RubiesToken, "ChangeERC20toRubies")
        .withArgs(ethers.parseEther("10"), tokenTestAddress);

      await expect(
        RubiesToken.changeRubieToERC20(
          ethers.parseEther("11"),
          tokenTestAddress
        )
      ).to.be.reverted;
      const changeTokensToRubie = await RubiesToken.changeRubieToERC20(
        ethers.parseEther("10"),
        tokenTestAddress
      );

      await expect(changeTokensToRubie).to.changeTokenBalances(
        RubiesToken,
        [owner.address, tokenRubiesAddress],
        [-ethers.parseEther("10"), 0]
      );
      await expect(changeTokensToRubie).to.changeTokenBalances(
        tokenTest,
        [owner.address, tokenRubiesAddress],
        [10000000, -10000000]
      );

      await expect(changeTokensToRubie)
        .to.emit(RubiesToken, "ChangeRubiesToERC20")
        .withArgs(ethers.parseEther("10"), tokenTestAddress);
    });
  }); */
});
