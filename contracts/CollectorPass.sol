// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract CollectorPass is ERC721URIStorage {
	mapping (uint => uint8) private types; // token types: 0, 1, 2
	uint private _freeMintable; // the amount can be free minted
	uint private _cheapMintable; // the amount can be cheap minted
	uint private id; // token id
	address private _owner; // the contract owner address;
	mapping (address => uint8) private _freeLength; // accounts' free minted quantity 
	mapping (address => uint8) private _cheapLength; // accounts' cheap minted quantity

	uint16 private greenLength; 
	uint16 private goldLength; 
	uint16 private purpleLength; 

	string private green = "https://www.floorswap.info/green.json";
	string private gold = "https://www.floorswap.info/gold.json";
	string private purple = "https://www.floorswap.info/purple.json";

	event CheapMinted(uint data);

	modifier onlyOwner() {
		require(msg.sender == _owner, "Only owner can call this function.");
		_;
	}

	constructor() ERC721 ("FLC Collector Pass", "FLC-CP") {
		_freeMintable = 975;
		_cheapMintable = 2025;

		_owner = msg.sender;
	}

	receive() external payable {
		cheapMint();
		emit CheapMinted(id);
	}

	function freeMint() external {
		require(_freeLength[msg.sender] < 3, "you have had 3 free cards!");
		require(_freeMintable > 0, "there's no NFT to mint!");
		_safeMint(msg.sender, id);
		uint8 random = uint8(block.timestamp % 10); // random type in 3
		if(random >= 0 && random < 7) {
			if(greenLength >= 1000) {
				if(goldLength >= 1000) {
					_setTokenURI(id, purple);
					types[id] = 1;
				} else {
					_setTokenURI(id, gold);
					types[id] = 2;
				}
			}
			_setTokenURI(id, green);
			types[id] = 0;
		} else if(random >= 7 && random < 9) {
			if(goldLength >= 1000) {
				if(purpleLength >= 1000) {
					_setTokenURI(id, green);
					types[id] = 0;
				} else {
					_setTokenURI(id, purple);
					types[id] = 1;
				}
			}
			_setTokenURI(id, gold);
			types[id] = 2;
		} else {
			if(purpleLength >= 1000) {
				if(greenLength >= 1000) {
					_setTokenURI(id, gold);
					types[id] = 2;
				} else {
					_setTokenURI(id, green);
					types[id] = 0;
				}
			}
			_setTokenURI(id, purple);
			types[id] = 1;
		}
		_freeMintable--;
		_freeLength[msg.sender]++;
		id++;
	}

	function cheapMint() private {
		require(_cheapLength[msg.sender] < 3, "you have had 3 free cards!");
		require(_cheapMintable > 0, "there's no NFT to mint!");
console.log(id);
		_safeMint(msg.sender, id);
		uint8 random = uint8(block.timestamp % 10); // random type in 3
		if(random >= 0 && random < 7) {
			if(greenLength >= 1000) {
				if(goldLength >= 1000) {
					_setTokenURI(id, purple);
					types[id] = 1;
				} else {
					_setTokenURI(id, gold);
					types[id] = 2;
				}
			}
			_setTokenURI(id,green);
			types[id] = 0;
		} else if(random >= 7 && random < 9) {
			if(goldLength >= 1000) {
				if(purpleLength >= 1000) {
					_setTokenURI(id, green);
					types[id] = 0;
				} else {
					_setTokenURI(id, purple);
					types[id] = 1;
				}
			}
			_setTokenURI(id, gold);
			types[id] = 2;
		} else {
			if(purpleLength >= 1000) {
				if(greenLength >= 1000) {
					_setTokenURI(id, gold);
					types[id] = 2;
				} else {
					_setTokenURI(id, green);
					types[id] = 0;
				}
			}
			_setTokenURI(id, purple);
			types[id] = 1;
		}
		_cheapMintable--;
		_cheapLength[msg.sender]++;
		id++;
	}

	// total minted quantity or current token id
	function amount() external view returns(uint) {
		return id;
	}

	function safeMint(address to, uint8 _id) external onlyOwner {
		require(_id >=0 && _id < 3, "wrony type id!");
		_safeMint(to, id);
		types[id] = _id;
		if(_id == 0) {
			_setTokenURI(id, green);
		} else if(_id == 2) {
			_setTokenURI(id, gold);
		} else if(_id == 1) {
			_setTokenURI(id, purple);
		}
		id++;
	}

	function typeOf(uint _id) external view returns(uint) {
		return types[_id];
	}

	function freeMintable() external view returns(uint) {
		return _freeMintable;
	}

	function cheapMintable() external view returns(uint) {
		return _cheapMintable;
	}

	function freeLength(address account) external view returns(uint) {
		return _freeLength[account];
	}

	function cheapLength(address account) external view returns(uint) {
		return _cheapLength[account];
	}

	function burn(uint _id) external {
		require(msg.sender == ownerOf(_id), "You can burn other's NFT");
		safeTransferFrom(msg.sender, address(0x0), _id);
	}

	function withdraw(address payable account, uint _amount) external onlyOwner {
		require(address(this).balance >= _amount, "Not enough Ethereums!");
		account.transfer(_amount);
	}

	function owner() external view returns(address) {
		return _owner;
	}

	function changeContractOwner(address account) external onlyOwner {
		_owner = account;
	}
}
