const connectButton = document.getElementById("connect_metamask");
connectButton.addEventListener("click", connectToMetamask);

async function connectToMetamask() {
  if (typeof window.ethereum === "undefined") {
    console.error("MetaMask is not installed!");
    return;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const networkSwitched = await switchToMumbaiNetwork(provider);
  if (networkSwitched) {
    await requestAccounts(provider);
  }
}

async function requestAccounts(provider) {
  try {
    const accounts = await provider.send("eth_requestAccounts", []);
    console.log("Connected accounts:", accounts);
    return accounts[0];
  } catch (error) {
    console.error("Error while connecting to MetaMask:", error);
  }
}

async function switchToMumbaiNetwork(provider) {
  const mumbaiChainId = "0x13881";
  try {
    await provider.send("wallet_switchEthereumChain", [
      { chainId: mumbaiChainId },
    ]);
    console.log("Successfully switched to the Mumbai network");
    return true;
  } catch (switchError) {
    if (switchError.code === 4902) {
      return await addMumbaiNetwork(provider);
    } else {
      console.error("Cannot switch to the Mumbai network", switchError);
      return false;
    }
  }
}

async function addMumbaiNetwork(provider) {
  try {
    await provider.send("wallet_addEthereumChain", [
      {
        chainId: "0x13881",
        chainName: "Mumbai",
        rpcUrls: ["https://polygon-mumbai-bor.publicnode.com"],
        blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
      },
    ]);
    console.log("Mumbai network added to MetaMask");
    return true;
  } catch (addError) {
    console.error("Error while adding the Mumbai network:", addError);
    return false;
  }
}
