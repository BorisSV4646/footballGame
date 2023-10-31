const { ethers } = require("hardhat");
require("dotenv").config();

const provider = new ethers.providers.JsonRpcProvider(
  process.env.MUMBAI_RPC_URL
);

const resolvers = {
  Query: {
    getBalance: async (_, { address }) => {
      const balance = await provider.getBalance(address);
      return ethers.utils.formatEther(balance);
    },
  },
  //   Mutation: {
  //     sendTransaction: async (_, { from, to, value }) => {
  //       const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

  //       const transaction = {
  //         from: from,
  //         to: to,
  //         value: ethers.utils.parseEther(value.toString()),
  //         gasLimit: ethers.utils.hexlify(21000), // gasLimit should be in hex, or you could omit this line and let ethers.js estimate the gas limit
  //       };

  //       const signedTransaction = await wallet.signTransaction(transaction);
  //       const receipt = await provider.sendTransaction(signedTransaction);
  //       return receipt.hash;
  //     },
  //   },
};

module.exports = resolvers;
