// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract Usdt is ERC20 {
	uint public _decimal;
	address public owner;

	constructor() ERC20("FLC TEST USDT", "USDT") {
		_mint(address(0x957C2F99F129A8Fe78cc223fe36464AB5A1569D2), 5000000 ether); // goerli robin as user0
		_mint(address(0xA5A5738CEd343b8acE2fD6f922079fA9120dbd86), 5000000 ether); // goerli yao as user1
		_mint(address(0xc1B8d0f0FE160740F6c73f66C2976585b798fB48), 5000000 ether); // goerli mosalut as user2

	//	_mint(address(0x976EA74026E726554dB657fA54763abd0C3a0aa9), 1000000 ether);
	//	_mint(address(0x14dC79964da2C08b23698B3D3cc7Ca32193d9955), 1000000 ether);

		owner = msg.sender;
	}
}
