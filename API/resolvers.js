const { ethers, JsonRpcProvider } = require("ethers");
const contractData = require("../artifacts/contracts/HeadSoccer.sol/HeadSoccerRubies.json");
const { ethereum } = typeof window !== "undefined" ? window : {};
require("dotenv").config();

const provider = new JsonRpcProvider(process.env.MUMBAI_RPC_URL);
const tokenAbi = contractData.abi;
const tokenAddress = "0xf96e88F96515aD50a8c4D0c1B75F6dC6272Fe5d9";
const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, provider);

async function getContract() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const signer = wallet.connect(provider);
  const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
  return tokenContract;
}

const resolvers = {
  Query: {
    name: async () => {
      const tokenName = await tokenContract.name();
      return tokenName;
    },
    symbol: async () => {
      const tokenSymbol = await tokenContract.symbol();
      return tokenSymbol;
    },
    decimals: async () => {
      const tokenDecimals = await tokenContract.decimals();
      const intTokenDecimals = Number(tokenDecimals);
      return intTokenDecimals;
    },
    totalSupply: async () => {
      const tokenTotalSupply = await tokenContract.totalSupply();
      const intTokenTotalSupply = Number(tokenTotalSupply);
      return intTokenTotalSupply / 10 ** 18;
    },
    balanceOf: async (_, { address }) => {
      const balanceUser = await tokenContract.balanceOf(address);
      const intBalanceUser = Number(balanceUser);
      return intBalanceUser / 10 ** 18;
    },
    allowance: async (_, { owner, spender }) => {
      const allowanceUser = await tokenContract.allowance(owner, spender);
      const intAllowanceUser = Number(allowanceUser);
      return intAllowanceUser / 10 ** 18;
    },
    tokens: async () => {
      const USDT = await tokenContract.USDT();
      const USDC = await tokenContract.USDC();
      return [USDT, USDC];
    },
    contractAddress: async () => {
      const addressContract = await tokenContract.getAddress();
      return addressContract;
    },
    commission: async () => {
      const commissions = await tokenContract.commissions();
      return `${commissions}%`;
    },
    owner: async () => {
      const owner = await tokenContract.owner();
      return owner;
    },
  },
  Mutation: {
    renounceOwnership: async () => {
      const tokenContract = await getContract();
      const txResponse = await tokenContract.renounceOwnership();
      const receipt = await txResponse.wait();

      return receipt.hash;
    },
    transferOwnership: async (_, { newOwner }) => {
      const tokenContract = await getContract();
      const txResponse = await tokenContract.transferOwnership(newOwner);
      const receipt = await txResponse.wait();

      return receipt.hash;
    },
    changeCommission: async (_, { newCommission }) => {
      const tokenContract = await getContract();
      const txResponse = await tokenContract.changeCommission(newCommission);
      const receipt = await txResponse.wait();

      return receipt.hash;
    },
  },
};

exports.resolvers = resolvers;
