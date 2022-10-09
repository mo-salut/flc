const {time, _} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");
console.log(waffle);

describe("CollectorPass", function () {
	let owner = ethers.provider.getSigner(0);
	let users = [ethers.provider.getSigner(6), ethers.provider.getSigner(7)];
	let withdraw = ethers.provider.getSigner(8);

	beforeEach(async function() {
		const [owner, otherAccount] = await ethers.getSigners();
		const CollectorPass = await ethers.getContractFactory("CollectorPass");
		cp = await CollectorPass.deploy();
		await cp.deployed();

		const Test = await ethers.getContractFactory("Test");
		test = await Test.deploy();
		await test.deployed();
	});

	describe("nft", function () {
		/*
		it("mint free", async function () {
			await expect((await cp.balanceOf(owner.getAddress())).toNumber()).to.equal(0);
			await cp.freeMint();
			await expect((await cp.balanceOf(owner.getAddress())).toNumber()).to.equal(1);
			console.log(await cp.freeMintable(owner.getAddress()));
			console.log(await cp.freeLength(owner.getAddress()));
			console.log(await cp.typeOf(0));
			console.log(await cp.ownerOf(0));
			console.log(await cp.amount());
		});
		*/

		/*
		it("mint cheap", async function () {
			await expect((await cp.balanceOf(owner.getAddress())).toNumber()).to.equal(0);
			cp.on("CheapMinted", async (data) => {
				console.log(await ethers.provider.getBalance(cp.address));
			//	await expect((await cp.balanceOf(owner.getAddress())).toNumber()).to.equal(1);
				console.log(await cp.cheapMintable(owner.getAddress()));
				console.log(await cp.cheapLength(owner.getAddress()));
				console.log(await cp.typeOf(0));
				console.log(await cp.ownerOf(0));
				console.log(await cp.amount());
				console.log(data);
				if(data == 3) {
					console.log(await cp.withdraw(withdraw.getBalance()));
				}
			});
			console.log(await owner.sendTransaction({
				to: cp.address,
				value: ethers.utils.parseEther("0.1")
			}));
			console.log(await owner.sendTransaction({
				to: cp.address,
				value: ethers.utils.parseEther("0.1")
			}));
			console.log(await owner.sendTransaction({
				to: cp.address,
				value: ethers.utils.parseEther("0.1")
			}));
			console.log(await owner.sendTransaction({
				to: cp.address,
				value: ethers.utils.parseEther("0.1")
			}));

			await new Promise(res => setTimeout(() => res(null), 30000));
		});
		*/

		it("withdraw", async function () {
			console.log("user0 balance:", await users[0].getBalance());
			console.log("user1 balance:", await users[1].getBalance());
			console.log("contract balance:", await ethers.provider.getBalance(cp.address));
			console.log();
			console.log(await users[0].sendTransaction({
				to: cp.address,
				value: ethers.utils.parseEther("10")
			}));
			console.log(await users[0].getBalance());

			console.log("user0 balance:", await users[0].getBalance());
			console.log("user1 balance:", await users[1].getBalance());
			console.log("contract balance:", await ethers.provider.getBalance(cp.address));
			console.log();

			console.log(await cp.withdraw(users[1].getAddress(), ethers.utils.parseEther("5")));
			console.log("user0 balance:", await users[0].getBalance());
			console.log("user1 balance:", await users[1].getBalance());
			console.log("contract balance:", await ethers.provider.getBalance(cp.address));
			console.log();

			let balance = await ethers.provider.getBalance(cp.address);
			console.log(await cp.withdraw(users[1].getAddress(), balance));
			balance = await ethers.provider.getBalance(cp.address);
			console.log("user0 balance:", await users[0].getBalance());
			console.log("user1 balance:", await users[1].getBalance());
			console.log("contract balance:", balance);
		});

		/*
		it("test", async function () {
			console.log(cp.address);
		//	await test.transfer()
			console.log(cp.address);
		});
		*/

		/*
		it("test", async function () {
			console.log("balance:", await test.getBalance());
			console.log(await owner.sendTransaction({
				to: test.address,
				value: ethers.utils.parseEther("1.0")
			}));
			console.log("balance:", await test.getBalance());
		});
		*/

		/*
		it("test", async function () {
			console.log(cp.address.balance);
			await test.transfer()
			console.log(cp.address.balance);
		});
		*/
	});
});
