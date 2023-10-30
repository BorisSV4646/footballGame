const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HeadSoccerRubies Deploy", function () {
  async function deployOneYearLockFixture() {
    const [owner, otherAccount1] = await ethers.getSigners();

    const HeadSoccerRubies = await ethers.getContractFactory(
      "HeadSoccerRubies"
    );
    const RubiesToken = await HeadSoccerRubies.deploy(
      ethers.parseEther("100"),
      owner
    );

    return {
      owner,
      RubiesToken,
      otherAccount1,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { owner, RubiesToken } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await RubiesToken.balanceOf(owner.address)).to.equal(
        ethers.parseEther("100")
      );

      expect(await RubiesToken.owner()).to.equal(owner.address);
    });
  });
});
