// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Usdt is ERC20 {
	uint public _decimal;
	address public owner;

	constructor() ERC20("Floorswap coin", "FLC") {
		_mint(address(0x976EA74026E726554dB657fA54763abd0C3a0aa9), 1000000 ether);
		_mint(address(0x14dC79964da2C08b23698B3D3cc7Ca32193d9955), 1000000 ether);
		owner = msg.sender;
	}
}
