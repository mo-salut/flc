// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Flc", function () {
	let flc;
	let owner = ethers.provider.getSigner(0);
	let inverser = ethers.provider.getSigner(1);
	let team = ethers.provider.getSigner(2);
	let repository = ethers.provider.getSigner(3);
	let fund = ethers.provider.getSigner(4);
	let uni = ethers.provider.getSigner(5);
	
	beforeEach(async function() {
		const Flc = await hre.ethers.getContractFactory("Flc");
		flc = await Flc.deploy();

		await flc.deployed();

		console.log(`FLC deployed to ${flc.address}`);

		console.log(await flc.name());
		console.log("total supply:", hre.ethers.utils.formatEther(await flc.totalSupply()));
		console.log("inverser:", hre.ethers.utils.formatEther(await flc.balanceOf(inverser.getAddress()) + ""));
		console.log("team:", hre.ethers.utils.formatEther(await flc.balanceOf(team.getAddress()) + ""));
		console.log("repository:", hre.ethers.utils.formatEther(await flc.balanceOf(repository.getAddress()) + ""));
		console.log("fund:", hre.ethers.utils.formatEther(await flc.balanceOf(fund.getAddress()) + ""));
		console.log("uni:", hre.ethers.utils.formatEther(await flc.balanceOf(uni.getAddress()) + ""));
		console.log();

		console.log("locked:", hre.ethers.utils.formatEther(await flc.lockOf(inverser.getAddress())));
		console.log("locked:", hre.ethers.utils.formatEther(await flc.lockOf(team.getAddress())));
		console.log("locked:", hre.ethers.utils.formatEther(await flc.lockOf(repository.getAddress())));
		console.log();

		console.log((await flc.unlocktimeOf(inverser.getAddress())).toNumber());
		console.log((await flc.unlocktimeOf(team.getAddress())).toNumber());
		console.log((await flc.unlocktimeOf(repository.getAddress())).toNumber());
		console.log((await flc.unlocktimeOf(owner.getAddress())).toNumber());
		console.log();
	});

	it("spending unlocked 1", async function() {
		console.log(await flc.connect(uni).transfer(inverser.getAddress(), hre.ethers.utils.parseEther("10000")));
		console.log(await flc.connect(inverser).transfer(owner.getAddress(), hre.ethers.utils.parseEther("10000")));
	});

	it("spending unlocked 2", async function() {
		console.log(await flc.connect(uni).transfer(inverser.getAddress(), hre.ethers.utils.parseEther("10000")));
		console.log(await flc.connect(inverser).approve(owner.getAddress(), hre.ethers.utils.parseEther("10000")));
		console.log(await flc.transferFrom(inverser.getAddress(), owner.getAddress(), hre.ethers.utils.parseEther("10000")));
	})

	it("spending locked 1", async function() {
		console.log(await flc.connect(inverser).transfer(owner.getAddress(), hre.ethers.utils.parseEther("10000")));
	});

	it("spending locked 2", async function() {
		console.log(await flc.connect(uni).transfer(inverser.getAddress(), hre.ethers.utils.parseEther("10000")));
		console.log(await flc.connect(inverser).transfer(owner.getAddress(), hre.ethers.utils.parseEther("20000")));
	});

	it("spending locked 3", async function() {
		console.log(await flc.connect(uni).transfer(inverser.getAddress(), hre.ethers.utils.parseEther("10000")));
		console.log(await flc.connect(inverser).approve(owner.getAddress(), hre.ethers.utils.parseEther("20000")));
		console.log(await flc.transferFrom(inverser.getAddress(), owner.getAddress(), hre.ethers.utils.parseEther("20000")));
	});

	it("burn", async function() {
		console.log(await flc.connect(uni).transfer(owner.getAddress(), hre.ethers.utils.parseEther("10000")));
		console.log(await flc.burn(hre.ethers.utils.parseEther("3000")));
		console.log(hre.ethers.utils.formatEther(await flc.balanceOf(owner.getAddress())));
	});
});
