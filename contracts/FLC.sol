// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Flc is ERC20 {
	uint public _decimal;
	address public owner;
	mapping (address => uint) public unlocktimes;
	mapping (address => uint) public locks;
	
	constructor() ERC20("Floorswap coin", "FLC") {
		// inverser 2,000,000,000.000 * 12%
		address inverser = address(0xfdFF374eF46e1da9b5258481c6E75F112D9Dd8a9);
		uint amount = 2 * 1e27 * 12 / 100;
		_mint(inverser, amount);
		unlocktimes[inverser] = block.timestamp + 15552000;
		locks[inverser] = amount;

		// team 2,000,000,000.000 * 10%
		address team = address(0x1C6fFE0e40aadE49b10Ddc79eC055CA5CE9AB249);
		amount = 2 * 1e27 * 10 / 100;
		_mint(team, amount);
		unlocktimes[team] = block.timestamp + 31104000;
		locks[team] = amount;

		// builder repository 2,000,000,000.000 * 15%
		address repository = address(0x4f785Dc67B31065aF7b3a4b37F9A91FF452f5D5c);
		amount = 2 * 1e27 * 15 / 100;
		_mint(repository, amount);
		unlocktimes[repository] = block.timestamp + 15552000;
		locks[repository] = amount;

		// fund fund 2,000,000,000.000 * 5%
		address fund = address(0x981172a86836c9E0Ce85E1a0B7932449A2aAE2A2);
		_mint(fund, 2 * 1e27 * 5 / 100);

		// fund uni 2,000,000,000.000 * 5%
		address uni = address(0xab4e5594e940b82C207BfC1f766Dbb6D9B8D53aA);
		_mint(uni, 2 * 1e27 * 15 / 1000);

		owner = msg.sender;
	}

	/**
		get the locks value
	*/
	function lockOf(address account) public view returns(uint) {
		return locks[account];
	}

	/**
		get the release time
	*/
	function unlocktimeOf(address account) public view returns(uint) {
		return unlocktimes[account];
	}

	/**
		transfer with lock checking
	*/
	function transfer(address to, uint amount) public override returns(bool) {
		require(balanceOf(msg.sender) >= locks[msg.sender], "The locks > the balance!");

		if (unlocktimes[msg.sender] > block.timestamp) {
			require(balanceOf(msg.sender) - locks[msg.sender] >= amount, "The part of balance is locked!");
		} else {
			if (unlocktimes[msg.sender] != 0) {
				unlocktimes[msg.sender] = 0;
			}
		}

		return ERC20.transfer(to, amount);
	}

	/**
		transferFrom with lock checking
	*/
	function transferFrom(address from, address to, uint amount) public override returns(bool) {
		require(balanceOf(from) >= locks[from], "The locks > the balance!");

		if (unlocktimes[from] > block.timestamp) {
			require(balanceOf(from) - locks[from] >= amount, "The part of balance is locked!");
		} else {
			if (unlocktimes[from] != 0) {
				unlocktimes[from] = 0;
			}
		}

		return ERC20.transferFrom(from, to, amount);
	}

	function burn(uint amount) public {
		ERC20._burn(msg.sender, amount);
	}
}
