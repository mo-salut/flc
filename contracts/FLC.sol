// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Flc is ERC20 {
	address public owner;

	IERC20 private usdt;

	// for inverser
	mapping (address => uint) private unlockTimesInverser;
	uint private releaseEachInverser; // the release amount on each day
	mapping (address => uint) private releasedInverser; // inverser released
	uint inversementPrice; // USDT amount for inverse FLC

	// for team
	mapping (address => uint) private unlockTimesTeam;
	uint private releaseEachTeam; // the release amount on each day
	mapping (address => uint) private releasedTeam; // team released

	// for repository
	mapping (address => uint) private unlockTimesRepository;
	uint private releaseEachRepository; // the release amount on each day
	mapping (address => uint) private releasedRepository; // repository released

	// for private
	mapping (address => uint) private unlockTimesPrivate;
	uint private releaseEachPrivate; // the release amount on each day
	mapping (address => uint) private releasedPrivate; // private released

	mapping (address => uint) private locksInverser;
	mapping (address => uint) private locksTeam;
	mapping (address => uint) private locksRepository;
	mapping (address => uint) private locksPrivate;

	uint private maxInverserLot;
	uint private maxPrivateLot;

	uint private buyPool;

	modifier onlyOwner() {
		require(msg.sender == owner, "Only owner can call this function.");
		_;
	}
	
	constructor(address _super) ERC20("Floorswap coin", "FLC") {
		// inverser 2,000,000,000 ether * 12% to mint by inversement
		releaseEachInverser = 219178 ether; // for in 3 years, that each day should release 219178 FLC
		maxInverserLot = 2000000000 * 12 / 100 / 2000; // a lot is 2000 ether

		// team 2,000,000,000 ether * 10%
	//	address team = address(0x1C6fFE0e40aadE49b10Ddc79eC055CA5CE9AB249); // mainnet
		address team = address(0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
		uint amount = 2000000000 ether * 10 / 100;
		_mint(team, amount);
		unlockTimesTeam[team] = block.timestamp + 31104000;
		locksTeam[team] = amount;
		releaseEachTeam = 182648 ether; // for in 3 years, that each day should release 182648 FLC

		// builder repository 2,000,000,000 ether * 15%
	//	address repository = address(0x4f785Dc67B31065aF7b3a4b37F9A91FF452f5D5c); // mainnet
		address repository = address(0x90F79bf6EB2c4f870365E785982E1f101E93b906);
		amount = 2000000000 ether * 15 / 100;
		_mint(repository, amount);
		unlockTimesRepository[repository] = block.timestamp + 15552000;
		locksRepository[repository] = amount;
		releaseEachRepository = 273973 ether; // for in 3 years, that each day should release 273973 FLC

		// fund 2,000,000,000 ether * 3.25%
	//	address fund = address(0x981172a86836c9E0Ce85E1a0B7932449A2aAE2A2); // mainnet
		address fund = address(0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65);
		_mint(fund, 2000000000 ether * 3.25 / 100);

		// private 2,000,000,000 ether * 3.25% to mint by buy
		releaseEachPrivate = 82192 ether; // for in 3 months, that each day should release 82192 FLC
		maxPrivateLot = 2000000000 * 3.25 / 100 / 2000; // a lot is 2000 ether

		// uni 2,000,000,000 ether * 1.5%
	//	address uni = address(0xab4e5594e940b82C207BfC1f766Dbb6D9B8D53aA); // mainnet
		address uni = address(0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc);
		_mint(uni, 2000000000 ether * 1.5 / 100);

		owner = _super;
	//	usdt = IERC20(address(0xdAC17F958D2ee523a2206206994597C13D831ec7));
		usdt = IERC20(address(0x1c85638e118b37167e9298c2268758e058DdfDA0));
	}

	/**
		get the inverser locks value
	*/
	function locksInverserOf(address account) public view returns(uint) {
		return locksInverser[account];
	}

	/**
		get the team locks value
	*/
	function locksTeamOf(address account) public view returns(uint) {
		return locksTeam[account];
	}

	/**
		get the repository locks value
	*/
	function locksRepositoryOf(address account) public view returns(uint) {
		return locksRepository[account];
	}

	/**
		get the private locks value
	*/
	function locksPrivateOf(address account) public view returns(uint) {
		return locksPrivate[account];
	}

	/**
		get the inverser released value
	*/
	function releasedInverserOf(address account) public view returns(uint) {
		return releasedInverser[account];
	}

	/**
		get the team released value
	*/
	function releasedTeamOf(address account) public view returns(uint) {
		return releasedTeam[account];
	}

	/**
		get the repository released value
	*/
	function releasedRepositoryOf(address account) public view returns(uint) {
		return releasedRepository[account];
	}

	/**
		get the private released value
	*/
	function releasedPrivateOf(address account) public view returns(uint) {
		return releasedPrivate[account];
	}

	/**
		get the inverser unlock time
	*/
	function unlockTimeInverserOf(address account) public view returns(uint) {
		return unlockTimesInverser[account];
	}

	/**
		get the team unlock time
	*/
	function unlockTimeTeamOf(address account) public view returns(uint) {
		return unlockTimesTeam[account];
	}

	/**
		get the repository unlock time
	*/
	function unlockTimeRepositoryOf(address account) public view returns(uint) {
		return unlockTimesRepository[account];
	}

	/**
		get the private unlock time
	*/
	function unlockTimePrivateOf(address account) public view returns(uint) {
		return unlockTimesPrivate[account];
	}

	/**
		get the inverser releaseEach
	*/
	function getReleaseEachInverser() public view returns(uint) {
		return releaseEachInverser;
	}

	/**
		get the team releaseEach
	*/
	function getReleaseEachTeam() public view returns(uint) {
		return releaseEachTeam;
	}

	/**
		get the repository releaseEach
	*/
	function getReleaseEachRepository() public view returns(uint) {
		return releaseEachRepository;
	}

	/**
		get the private releaseEach
	*/
	function getReleaseEachPrivate() public view returns(uint) {
		return releaseEachPrivate;
	}

	/**
		get the max inverser lot
	*/
	function getMaxInverserLot() public view returns(uint) {
		return maxInverserLot;
	}

	/**
		get the max private lot
	*/
	function getMaxPrivateLot() public view returns(uint) {
		return maxPrivateLot;
	}

	/**
		transfer
		call transferFrom by msg.sender as params from
	*/
	function transfer(address to, uint amount) public override returns(bool) {
		lockReleaseCheck(msg.sender, amount);
		return ERC20.transfer(to, amount);
	}

	/**
		transferFrom with lock checking and release checking
	*/
	function transferFrom(address from, address to, uint amount) public override returns(bool) {
		lockReleaseCheck(from, amount);
		return ERC20.transferFrom(from, to, amount);
	}

	function lockReleaseCheck(address from, uint amount) internal {
		// The balance should always >= lock amount
		uint locks = locksInverser[from] + locksTeam[from] + locksRepository[from] + locksPrivate[from];
		require(balanceOf(from) >= locks, "The locks > the balance!");

		uint secs;
		uint ds;
		uint release;

		if (block.timestamp > unlockTimesInverser[from] && locksInverser[from] != 0) {
			secs = block.timestamp - unlockTimesInverser[from];
			if(secs % 86400 == 0) {
				ds = secs / 86400;
			} else {
				ds = secs / 86400 + 1;
			}
			release = ds * releaseEachInverser - releasedInverser[from];
			releasedInverser[from] += release;
			if(locksInverser[from] > release) {
				locksInverser[from] -= release;
			} else {
				delete locksInverser[from];
				delete unlockTimesInverser[from];
			}
		}

		if (block.timestamp > unlockTimesTeam[from] && locksTeam[from] != 0) {
			secs = block.timestamp - unlockTimesTeam[from];
			if(secs % 86400 == 0) {
				ds = secs / 86400;
			} else {
				ds = secs / 86400 + 1;
			}
			release = ds * releaseEachTeam - releasedTeam[from];
			releasedTeam[from] += release;
			if(locksTeam[from] > release) {
				locksTeam[from] -= release;
			} else {
				delete locksTeam[from];
				delete unlockTimesTeam[from];
			}
		}

		if (block.timestamp > unlockTimesRepository[from] && locksRepository[from] != 0) {
			secs = block.timestamp - unlockTimesRepository[from];
			if(secs % 86400 == 0) {
				ds = secs / 86400;
			} else {
				ds = secs / 86400 + 1;
			}
			release = ds * releaseEachRepository - releasedRepository[from];
			releasedRepository[from] += release;
			if(locksRepository[from] > release) {
				locksRepository[from] -= release;
			} else {
				delete locksRepository[from];
				delete unlockTimesRepository[from];
			}
		}

		if (block.timestamp > unlockTimesPrivate[from] && locksPrivate[from] != 0) {
			secs = block.timestamp - unlockTimesPrivate[from];
			if(secs % 86400 == 0) {
				ds = secs / 86400;
			} else {
				ds = secs / 86400 + 1;
			}
			release = ds * releaseEachPrivate - releasedPrivate[from];
			releasedPrivate[from] += release;
			if(locksPrivate[from] > release) {
				locksPrivate[from] -= release;
			} else {
				delete locksPrivate[from];
				delete unlockTimesPrivate[from];
			}
		}

		locks = locksInverser[from] + locksTeam[from] + locksRepository[from] + locksPrivate[from];
		require(balanceOf(from) - locks >= amount, "The part of balance is locked!");
	}

	function getLocksPrivateOf(address account) external view returns(uint) {
		return locksPrivate[account];
	}

	// private buy
	function buy(uint lot) external returns(bool, uint) {
		require(usdt.transferFrom(msg.sender, owner, lot * 10 ether), "Pay USDT failed!");
		require(maxPrivateLot >= lot, "Not enough board lot!"); 
		require(locksPrivate[msg.sender] == 0, "The account has bought!");
		maxPrivateLot -= lot;
		uint amount = lot * 2000 ether;
		_mint(msg.sender, amount);

		locksPrivate[msg.sender] = amount;
		unlockTimesPrivate[msg.sender] = block.timestamp + 7776000; // 7776000 = 90 days
		buyPool += amount;
		releaseEachPrivate = amount / 365;

		return (true, maxInverserLot);
	}

	function inversementRun(uint price) external onlyOwner returns(bool) {
		inversementPrice = price;
		return true;
	}

	function inversementStop() external onlyOwner returns(bool) {
		inversementPrice = 0;
		return true;
	}

	function getInversementPrice() external view returns(uint) {
		return inversementPrice;
	}

	function getLocksInverserOf(address account) external view returns(uint) {
		return locksInverser[account];
	}

	// inversement
	function inversement(uint lot) external returns(bool) {
		require(inversementPrice != 0, "there's no inversement running!");
		require(maxInverserLot >= lot, "Not enough board lot!"); 
		require(usdt.transferFrom(msg.sender, owner, lot * inversementPrice), "Pay USDT failed!");
		require(locksInverser[msg.sender] == 0, "The account has bought!");
		maxInverserLot -= lot;
		uint amount = lot * 2000 ether;
		_mint(msg.sender, amount);

		locksInverser[msg.sender] = amount;
		unlockTimesInverser[msg.sender] = block.timestamp + 7776000; // 7776000 = 90 days
		buyPool += amount;
		releaseEachInverser = amount / 365 / 3;

		return true;
	}

	function burn(uint amount) public {
		ERC20._burn(msg.sender, amount);
	}

	function changeOwner(address account) external onlyOwner returns(bool) {
		owner = account;
		return true;
	}
}
