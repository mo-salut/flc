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
		address inverser = address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
		uint amount = 2 * 1e27 * 12 / 100;
		_mint(inverser, amount);
		unlocktimes[inverser] = block.timestamp + 15552000;
		locks[inverser] = amount;

		// team 2,000,000,000.000 * 10%
		address team = address(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
		amount = 2 * 1e27 * 10 / 100;
		_mint(team, amount);
		unlocktimes[team] = block.timestamp + 31104000;
		locks[team] = amount;

		// builder repository 2,000,000,000.000 * 15%
		address repository = address(0x90F79bf6EB2c4f870365E785982E1f101E93b906);
		amount = 2 * 1e27 * 15 / 100;
		_mint(repository, amount);
		unlocktimes[repository] = block.timestamp + 15552000;
		locks[repository] = amount;

		// fund fund 2,000,000,000.000 * 5%
		address fund = address(0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65);
		_mint(fund, 2 * 1e27 * 5 / 100);

		// fund uni 2,000,000,000.000 * 5%
		address uni = address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc);
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
}
