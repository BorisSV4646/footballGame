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
    const RubiesToken = await HeadSoccerRubies.deploy(100, owner);
    await RubiesToken.transfer(otherAccount1.address, ethers.parseEther("10"));
    const user1 = await RubiesToken.connect(otherAccount1);

    return {
      owner,
      RubiesToken,
      otherAccount1,
      user1,
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
      expect(await RubiesToken.commissions()).to.equal(ethers.parseEther("33"));
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
      await expect(user1.playGameForRubie(11)).to.be.reverted;
      const playGame = await user1.playGameForRubie(5);
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
      await expect(user1.playGameForRubie(11)).to.be.reverted;
      const changeFings = await user1.changeRubieToThings(5);
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
});
