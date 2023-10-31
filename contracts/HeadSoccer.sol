// SPDX-License-Identifier: Apache-2.0 license
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract HeadSoccerRubies is ERC20, Ownable {
    uint256 private constant ONE_ETHER_IN_WEI = 1 ether;

    /**
     * @dev The amount of the commission for the game - default 20%.
     */
    uint256 public commissions = 20 ether;

    /**
     * @dev Addresses of tokens for which rubies can be exchanged.
     */
    address public constant USDT = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    address public constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;
    address public constant DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;

    /**
     * @dev Invalid token to exchange.
     */
    error NotValidToken(address token);

    /**
     * @dev There are not enough ERC20 tokens to exchange.
     */
    error NotEnoughERC20(uint256 balanceOf, uint256 amount);

    /**
     * @dev There are not enough rubies tokens to exchange.
     */
    error NotEnoughRubies(uint256 balanceOf, uint256 amount);

    /**
     * @dev The commission is too small or too large.
     */
    error NotRightCommission(uint256 newCommission);

    event ChangeERC20toRubies(uint256 amount, address token);
    event ChangeRubiesToERC20(uint256 amount, address token);
    event ChangeRubies(uint256 amount);
    event PlayGame(uint256 amount);

    /**
     * @dev The modifier checks whether the token address is valid for exchange.
     */
    modifier validAddress(address tokenAddress) {
        if (
            tokenAddress != USDT || tokenAddress != USDC || tokenAddress != DAI
        ) {
            revert NotValidToken(tokenAddress);
        }
        _;
    }

    /**
     * @dev The modifier checks whether the balance of rubies is sufficient for the operation.
     */
    modifier hasEnoughBalance(uint256 amount) {
        if (balanceOf(msg.sender) <= amount) {
            revert NotEnoughRubies(balanceOf(msg.sender), amount);
        }
        _;
    }

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     * @param _initialSupply The number of tokens on the owner's wallet.
     * @param _owner The owner of the contract and the wallet for forwarding commissions.
     */
    constructor(
        uint256 _initialSupply,
        address _owner
    ) ERC20("HeadSoccerRubies", "HSR") Ownable(_owner) {
        _mint(msg.sender, _initialSupply * ONE_ETHER_IN_WEI);
    }

    /**
     * @notice Before the exchange, it is necessary to give the specified contract permission to dispose of the token.
     * @dev The function of exchanging ERC20 tokens for rubies.
     * @param amount The number of tokens.
     * @param tokenAddress Which tokens the user wants to exchange.
     */
    function changeERC20toRubie(
        uint256 amount,
        address tokenAddress
    ) external validAddress(tokenAddress) {
        IERC20 token = IERC20(tokenAddress);
        if (token.balanceOf(msg.sender) >= amount) {
            revert NotEnoughERC20(token.balanceOf(msg.sender), amount);
        }
        require(token.transferFrom(msg.sender, address(this), amount));
        _mint(msg.sender, amount);
        emit ChangeERC20toRubies(amount, tokenAddress);
    }

    /**
     * @dev The function of exchanging rubies for ERC20 tokens.
     * @param amount The number of tokens.
     * @param tokenAddress Which token the user wants to exchange rubies for.
     */
    function changeRubieToERC20(
        uint256 amount,
        address tokenAddress
    ) external validAddress(tokenAddress) hasEnoughBalance(amount) {
        _burn(msg.sender, amount);
        require(IERC20(tokenAddress).transfer(msg.sender, amount));
        emit ChangeRubiesToERC20(amount, tokenAddress);
    }

    /**
     * @dev The function of exchanging rubies for any other items.
     * @param amount The number of tokens.
     */
    function changeRubieToThings(
        uint256 amount
    ) external hasEnoughBalance(amount * ONE_ETHER_IN_WEI) {
        _burn(msg.sender, amount * ONE_ETHER_IN_WEI);
        emit ChangeRubies(amount * ONE_ETHER_IN_WEI);
    }

    /**
     * @dev The function of participating in the game for rubies.
     * @param amount The number of tokens.
     */
    function playGameForRubie(
        uint256 amount
    ) external hasEnoughBalance(amount * ONE_ETHER_IN_WEI) {
        uint256 commissionForGame = (amount * commissions) / 100;
        require(transfer(owner(), commissionForGame));
        _burn(msg.sender, amount * ONE_ETHER_IN_WEI - commissionForGame);
        emit PlayGame(amount * ONE_ETHER_IN_WEI);
    }

    /**
     * @dev A function for the owner to change the commission.
     * @param newCommission The amount of the new commission..
     */
    function changeCommission(uint256 newCommission) external onlyOwner {
        if (newCommission <= 0 || newCommission >= 100) {
            revert NotRightCommission(newCommission);
        }
        commissions = newCommission * ONE_ETHER_IN_WEI;
    }
}
