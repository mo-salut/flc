// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CollectorPass is ERC721 {
	mapping (uint => uint8) private types; // token types: 0, 1, 2
	uint private _freeMintable; // the amount can be free minted
	uint private _cheapMintable; // the amount can be cheap minted
	uint private id; // token id
	address private _owner; // the contract owner address;
	mapping (address => uint8) private _freeLength; // accounts' free minted quantity 
	mapping (address => uint8) private _cheapLength; // accounts' cheap minted quantity

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
		types[id] = uint8(block.timestamp % 3); // random type in 3
		_freeMintable--;
		_freeLength[msg.sender]++;
		id++;
	}

	function cheapMint() private {
		require(_cheapLength[msg.sender] < 3, "you have had 3 free cards!");
		require(_cheapMintable > 0, "there's no NFT to mint!");
		_safeMint(msg.sender, id);
		types[id] = uint8(block.timestamp % 3); // random type in 3
		_cheapMintable--;
		_cheapLength[msg.sender]++;
		id++;
	}

	// total minted quantity or current token id
	function amount() external view returns(uint) {
		return id;
	}

	function safeMint(address to, uint _id) external onlyOwner {
		_safeMint(to, _id);
		types[_id] = uint8(block.timestamp % 3); // random type in 3
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

	function withdraw(address payable account, uint amount) external onlyOwner {
		require(address(this).balance >= amount, "Not enough Ethereums!");
		account.transfer(amount);
	}

	function owner() external view returns(address) {
		return _owner;
	}

	function changeContractOwner(address account) external onlyOwner {
		_owner = account;
	}
}
