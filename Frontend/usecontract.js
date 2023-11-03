// Переменные для хранения подписчика и контракта
let signer, tokenContract;

function readJSONFile(url) {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.abi;
    })
    .catch((error) => {
      console.error("Ошибка чтения файла JSON:", error);
    });
}

// Функция для получения кошелька
async function getWallet() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    return await signer.getAddress();
  } else {
    alert("Metamask не доступен, установите необходимое расширение");
  }
}

// Функция для получения контракта токена
async function getTokenContract() {
  if (!tokenContract) {
    const tokenContractAddress = "0x4C182B9B26a7C5Fe5E27D8827F162D2632957549";
    const tokenContractABI = await readJSONFile(
      "/artifacts/contracts/HeadSoccer.sol/HeadSoccerRubies.json"
    );
    tokenContract = new ethers.Contract(
      tokenContractAddress,
      tokenContractABI,
      signer
    );
  }
  return tokenContract;
}

// Объединенная функция для отправки транзакций
async function performTransaction(action, amount, address) {
  try {
    const walletAddress = await getWallet();
    if (!walletAddress) throw new Error("Кошелек не подключен.");

    const tokenContract = await getTokenContract();
    const txResponse = await tokenContract[action](
      ethers.utils.parseEther(`${amount}`),
      ...(address ? [address.toString()] : []),
      { from: walletAddress, gasLimit: 2000000 }
    );

    console.log("Транзакция отправлена! Ожидание подтверждения...");
    const txReceipt = await txResponse.wait();
    console.log("Транзакция подтверждена!", txReceipt);
  } catch (error) {
    console.error("Ошибка:", error);
  }
}

// Получаем элементы формы и вешаем слушателей на кнопки
document.addEventListener("DOMContentLoaded", function () {
  const amountInput = document.getElementById("amountInput");
  const addressInput = document.getElementById("addressInput");

  document.getElementById("playGame").addEventListener("click", function () {
    performTransaction("playGameForRubie", amountInput.value);
  });

  document
    .getElementById("changeRubiesToThings")
    .addEventListener("click", function () {
      performTransaction("changeRubieToThings", amountInput.value);
    });

  document
    .getElementById("changeRubiesToErc20")
    .addEventListener("click", function () {
      performTransaction(
        "changeRubieToERC20",
        amountInput.value,
        addressInput.value
      );
    });

  document
    .getElementById("changeErc20ToRubies")
    .addEventListener("click", function () {
      performTransaction(
        "changeERC20toRubie",
        amountInput.value,
        addressInput.value
      );
    });
});
