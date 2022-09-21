const hre = require("hardhat");

async function main() {
	const Flc = await hre.ethers.getContractFactory("Flc");
	const flc = await Flc.deploy();

	await flc.deployed();

	/*
	let owner = ethers.provider.getSigner(0);
	let inverser = ethers.provider.getSigner(1);
	let team = ethers.provider.getSigner(2);
	let repository = ethers.provider.getSigner(3);
	let fund = ethers.provider.getSigner(4);
	let uni = ethers.provider.getSigner(5);

	console.log(await flc.name());
	console.log("total supply:", hre.ethers.utils.formatEther(await flc.totalSupply()));
	console.log("inverser:", hre.ethers.utils.formatEther(await flc.balanceOf(inverser.getAddress()) + ""));
	console.log("team:", hre.ethers.utils.formatEther(await flc.balanceOf(team.getAddress()) + ""));
	console.log("repository:", hre.ethers.utils.formatEther(await flc.balanceOf(repository.getAddress()) + ""));
	console.log("fund:", hre.ethers.utils.formatEther(await flc.balanceOf(fund.getAddress()) + ""));
	console.log("uni:", hre.ethers.utils.formatEther(await flc.balanceOf(uni.getAddress()) + ""));
	console.log();
	*/

}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
