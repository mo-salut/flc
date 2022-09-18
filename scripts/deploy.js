// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
//	const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//	const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//	const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//	const lockedAmount = hre.ethers.utils.parseEther("1");

	const Flc = await hre.ethers.getContractFactory("Flc");
//	const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
	const flc = await Flc.deploy();

	await flc.deployed();

	console.log(`FLC deployed to ${flc.address}`);
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

	console.log("locked:", hre.ethers.utils.formatEther(await flc.lockOf(inverser.getAddress())));
	console.log("locked:", hre.ethers.utils.formatEther(await flc.lockOf(team.getAddress())));
	console.log("locked:", hre.ethers.utils.formatEther(await flc.lockOf(repository.getAddress())));
	console.log();

	console.log((await flc.unlocktimeOf(inverser.getAddress())).toNumber());
	console.log((await flc.unlocktimeOf(team.getAddress())).toNumber());
	console.log((await flc.unlocktimeOf(repository.getAddress())).toNumber());
	console.log((await flc.unlocktimeOf(owner.getAddress())).toNumber());
	console.log();

	console.log(await flc.connect(uni).transfer(inverser.getAddress(), hre.ethers.utils.parseEther("10000")));
	console.log(await flc.connect(inverser).transfer(owner.getAddress(), hre.ethers.utils.parseEther("20000")));
	/*
	console.log(
	`Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
	);
	*/
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
