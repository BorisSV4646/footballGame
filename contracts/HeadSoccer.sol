// SPDX-License-Identifier: Apache-2.0 license
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

contract HeadSoccerRubies is ERC20, Ownable {
    address public constant USDT = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F;
    address public constant USDC = 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359;
    address public constant DAI = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;

    error NotValidToken(address token);

    error NotEnoughERC20(uint256 balanceOf, uint256 amount);

    error NotEnoughRubies(uint256 balanceOf, uint256 amount);

    constructor(
        uint256 initialSupply,
        address _owner
    ) ERC20("HeadSoccerRubies", "HSR") Ownable(_owner) {
        _mint(msg.sender, initialSupply);
    }

    function changeERC20toRubie(uint256 amount, address tokenAddress) external {
        IERC20 token = IERC20(tokenAddress);

        if (
            tokenAddress == USDT || tokenAddress == USDC || tokenAddress == DAI
        ) {
            revert NotValidToken(tokenAddress);
        }
        if (token.balanceOf(msg.sender) >= amount) {
            revert NotEnoughERC20(token.balanceOf(msg.sender), amount);
        }

        require(token.transferFrom(msg.sender, address(this), amount));

        _mint(msg.sender, amount);
    }

    function changeRubieToERC20(uint256 amount, address tokenAddress) external {
        if (
            tokenAddress == USDT || tokenAddress == USDC || tokenAddress == DAI
        ) {
            revert NotValidToken(tokenAddress);
        }
        if (balanceOf(msg.sender) >= amount) {
            revert NotEnoughRubies(balanceOf(msg.sender), amount);
        }

        _burn(msg.sender, amount);

        require(IERC20(tokenAddress).transfer(msg.sender, amount));
    }

    function mint(uint256 amount) external onlyOwner {
        _mint(_msgSender(), amount);
    }

    function burn(uint256 amount) external onlyOwner {
        _burn(_msgSender(), amount);
    }
}
