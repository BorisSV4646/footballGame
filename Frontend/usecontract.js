let provider;
let signer;

async function getWallet() {
  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    const connectedAccount = await signer.getAddress();
    return connectedAccount;
  } else {
    alert(
      "Metamask не доступен, установите необходимое расширение https://chrome.google.com/webstore"
    );
    return;
  }
}

async function getTokenContract() {
  const tokenContractAddress = "0x5Ec8d136E4F4E5fBA63Fb1aC7679ee8C4fA3Ace7";
  const tokenContractABI = await readJSONFile("contracts/CanvaToken.json");
  const tokenContract = new ethers.Contract(
    tokenContractAddress,
    tokenContractABI,
    signer
  );
  return tokenContract;
}

inputField.addEventListener("input", async function () {
  const tokenContract = await getTokenContract();
  const walletAddress = await getWallet();
  const balance = await tokenContract.balanceOf(walletAddress);

  const selectedValue = parseInt(this.value);
  const percentage =
    (selectedValue / (balance / ethers.utils.parseUnits("1", 18))) * 100;

  slider.value = Math.floor(percentage);
  updateSliderAppearance(Math.floor(percentage));

  const price = Math.floor(selectedValue * 0.023);
  priceStaking.textContent = "~" + price.toLocaleString() + " USD";

  const allowance = await tokenContract.allowance(
    walletAddress,
    "0xa43fA2cfF564f70376b422AA3d3b45f63fCdbca2"
  );
  if (allowance.gt(ethers.utils.parseUnits(selectedValue.toString(), 18))) {
    spanElementStake.textContent = "deposit";
  } else {
    spanElementStake.textContent = "approve";
  }
});
