// const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
// changeEtherBalances

const { expect } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const parseEther = hre.ethers.utils.parseEther;
const formatEther = hre.ethers.utils.formatEther;

describe("Flc", function () {
	let owner = ethers.provider.getSigner(0);
	let inverser = ethers.provider.getSigner(1);
	let team = ethers.provider.getSigner(2);
	let repository = ethers.provider.getSigner(3);
	let fund = ethers.provider.getSigner(4);
	let uni = ethers.provider.getSigner(5);
	let users = [ethers.provider.getSigner(6), ethers.provider.getSigner(7)];
	
	beforeEach(async function() {
		/*
		const Usdt = await hre.ethers.getContractFactory("Usdt");
		usdt = await Usdt.deploy();
		await usdt.deployed();
		*/

		usdt = await hre.ethers.getContractAt("Usdt", "0x1c85638e118b37167e9298c2268758e058DdfDA0");

		const Flc = await hre.ethers.getContractFactory("Flc");
		flc = await Flc.deploy(owner.getAddress());
		await flc.deployed();
	});

	/*
	it("print info", async () => {
		console.log(usdt.address);
	});
	*/

	/*
	it("print info", async () => {
		console.log(usdt.address);
		console.log("FLC owner is", await owner.getAddress());
		console.log("FLC deployed to", flc.address);

		console.log(await flc.name());
		console.log("total supply:", formatEther(await flc.totalSupply()));
		console.log("team:", formatEther(await flc.balanceOf(team.getAddress()) + ""));
		console.log("repository:", formatEther(await flc.balanceOf(repository.getAddress()) + ""));
		console.log("fund:", formatEther(await flc.balanceOf(fund.getAddress()) + ""));
		console.log("uni:", formatEther(await flc.balanceOf(uni.getAddress()) + ""));
		console.log();

		let locks = await flc.locksInverserOf(team.getAddress()) +
			await flc.locksTeamOf(team.getAddress()) +
			await flc.locksRepositoryOf(team.getAddress()) +
			await flc.locksPrivateOf(team.getAddress());
		console.log(
			"locked:",
			formatEther(locks),
			(await flc.unlockTimeInverserOf(team.getAddress())).toNumber(),
			(await flc.unlockTimeTeamOf(team.getAddress())).toNumber(),
			(await flc.unlockTimeRepositoryOf(team.getAddress())).toNumber(),
			(await flc.unlockTimePrivateOf(team.getAddress())).toNumber()
		);

		locks = await flc.locksInverserOf(repository.getAddress()) +
			await flc.locksTeamOf(repository.getAddress()) +
			await flc.locksRepositoryOf(repository.getAddress()) +
			await flc.locksPrivateOf(repository.getAddress());
		console.log(
			"locked:",
			formatEther(locks),
			(await flc.unlockTimeInverserOf(repository.getAddress())).toNumber(),
			(await flc.unlockTimeTeamOf(repository.getAddress())).toNumber(),
			(await flc.unlockTimeRepositoryOf(repository.getAddress())).toNumber(),
			(await flc.unlockTimePrivateOf(repository.getAddress())).toNumber()
		);

		console.log();
	});
	*/

	it("spending unlocked by transfer", async function() {
		console.log(await team.getAddress());
		console.log(await repository.getAddress());
		console.log(await fund.getAddress());
		console.log(await uni.getAddress());
		await flc.connect(fund).transfer(owner.getAddress(), parseEther("10000"));
		await flc.connect(uni).transfer(owner.getAddress(), parseEther("10000"));
		await expect(formatEther(await flc.balanceOf(owner.getAddress()))).to.equal("20000.0");
	});

	it("spending unlocked by transferFrom", async function() {
		await flc.connect(fund).approve(owner.getAddress(), parseEther("10000"));
		await flc.connect(uni).approve(owner.getAddress(), parseEther("10000"));
		await flc.transferFrom(fund.getAddress(), owner.getAddress(), parseEther("10000"));
		await flc.transferFrom(uni.getAddress(), owner.getAddress(), parseEther("10000"));
		await expect(formatEther(await flc.balanceOf(owner.getAddress()))).to.equal("20000.0");
	})

	it("spending locked team", async function() {
		await expect(flc.connect(team).transfer(owner.getAddress(), parseEther("1"))).to.be.revertedWith("The part of balance is locked!");
	});

	it("spending locked team with recieved part", async function() {
		await flc.connect(fund).transfer(team.getAddress(), parseEther("10000"));
		await expect(flc.connect(team).transfer(owner.getAddress(), parseEther("20000"))).to.be.revertedWith("The part of balance is locked!");
		await expect(flc.connect(team).transfer(owner.getAddress(), parseEther("1"))).to.changeTokenBalances(
			flc,
			[team, owner],
			[parseEther("-1"), parseEther("1")]
		);
	});

	it("spending locked team with release part", async function() {
		console.log("block timestamp:", (await ethers.provider.getBlock()).timestamp);
		await expect(flc.connect(team).transfer(
			owner.getAddress(),
			parseEther("1")
		)).to.be.revertedWith("The part of balance is locked!");
		console.log("unlock time:", await flc.unlockTimeTeamOf(team.getAddress()));

		await helpers.time.increaseTo(await flc.unlockTimeTeamOf(team.getAddress()));
		console.log("block timestamp:", (await ethers.provider.getBlock()).timestamp);

		let amount = formatEther(await flc.getReleaseEachTeam());
		await expect(flc.connect(team).transfer(
			owner.getAddress(),
			parseEther(amount)
		)).to.changeTokenBalances(
			flc,
			[team, owner],
			["-" + parseEther(amount).toString(), parseEther(amount).toString()]
		);

		await expect(flc.connect(team).transfer(
			owner.getAddress(),
			parseEther(formatEther(await flc.getReleaseEachTeam()))
		)).to.be.revertedWith("The part of balance is locked!");

		await helpers.time.increase(helpers.time.duration.days(1));

		expect(flc.connect(team).transfer(
			owner.getAddress(),
			parseEther(formatEther(await flc.getReleaseEachTeam()))
		)).to.changeTokenBalances(
			flc,
			[team, owner],
			["-" + parseEther(amount).toString(), parseEther(amount).toString()]
		);

	});

	it("spending locked repository", async function() {
		await expect(flc.connect(repository).transfer(
			owner.getAddress(), parseEther("1")
		)).to.be.revertedWith("The part of balance is locked!");
	});

	it("spending locked repository", async function() {
		await flc.connect(fund).transfer(repository.getAddress(), parseEther("10000"));
		await expect(flc.connect(repository).transfer(
			owner.getAddress(),
			parseEther("20000")
		)).to.be.revertedWith("The part of balance is locked!");
		await expect(flc.connect(repository).transfer(owner.getAddress(), parseEther("1"))).to.changeTokenBalances(
			flc,
			[repository, owner],
			[parseEther("-1"), parseEther("1")]
		);
	});

	it("spending locked repository with release part", async function() {
		console.log("block timestamp:", (await ethers.provider.getBlock()).timestamp);
		await expect(flc.connect(repository).transfer(
			owner.getAddress(),
			parseEther("1")
		)).to.be.revertedWith("The part of balance is locked!");
		console.log("unlock time:", await flc.unlockTimeRepositoryOf(repository.getAddress()));

		await helpers.time.increaseTo(await flc.unlockTimeRepositoryOf(repository.getAddress()));
		console.log("block timestamp:", (await ethers.provider.getBlock()).timestamp);

		let amount = formatEther(await flc.getReleaseEachRepository());
		await expect(flc.connect(repository).transfer(
			owner.getAddress(),
			parseEther(amount)
		)).to.changeTokenBalances(
			flc,
			[repository, owner],
			["-" + parseEther(amount).toString(), parseEther(amount).toString()]
		);

		await expect(flc.connect(repository).transfer(
			owner.getAddress(),
			parseEther(formatEther(await flc.getReleaseEachRepository()))
		)).to.be.revertedWith("The part of balance is locked!");

		await helpers.time.increase(helpers.time.duration.days(1));

		expect(flc.connect(repository).transfer(
			owner.getAddress(),
			parseEther(formatEther(await flc.getReleaseEachRepository()))
		)).to.changeTokenBalances(
			flc,
			[repository, owner],
			["-" + parseEther(amount).toString(), parseEther(amount).toString()]
		);
	});

	it("spending released team and repository coins conflex with release part", async function() {
		console.log("block timestamp:", (await ethers.provider.getBlock()).timestamp);

		await helpers.time.increaseTo(await flc.unlockTimeRepositoryOf(repository.getAddress())); // 6 months after
		console.log("block timestamp:", (await ethers.provider.getBlock()).timestamp);

		amountTeam = formatEther(await flc.getReleaseEachTeam());

		amountRepository = formatEther(await flc.getReleaseEachRepository());
		let sum = parseEther(parseFloat(amountRepository) + parseFloat(amountTeam) + "");

		// repository transfer sum
		await expect(flc.connect(repository).transfer(
			owner.getAddress(),
			sum
		)).to.be.revertedWith("The part of balance is locked!");
		
		// team transfer
		await expect(flc.connect(team).transfer(
			owner.getAddress(),
			parseEther(amountTeam)
		)).to.be.revertedWith("The part of balance is locked!");

		// repository transfer
		await expect(flc.connect(repository).transfer(
			owner.getAddress(),
			parseEther(amountRepository)
		)).to.changeTokenBalances(
			flc,
			[repository, owner],
			["-" + parseEther(amountRepository).toString(), parseEther(amountRepository).toString()]
		);

		await helpers.time.increaseTo(await flc.unlockTimeTeamOf(team.getAddress())); // 1 year after

		// team transfer
		await expect(flc.connect(team).transfer(
			owner.getAddress(),
			parseEther(amountTeam)
		)).to.changeTokenBalances(
			flc,
			[team, owner],
			["-" + parseEther(amountTeam).toString(), parseEther(amountTeam).toString()]
		);

		// team transfer
		await expect(flc.connect(team).transfer(
			owner.getAddress(),
			parseEther(amountTeam)
		)).to.be.revertedWith("The part of balance is locked!");

		// repository transfer
		await expect(flc.connect(repository).transfer(
			owner.getAddress(),
			parseEther(amountRepository)
		)).to.changeTokenBalances(
			flc,
			[repository, owner],
			["-" + parseEther(amountRepository).toString(), parseEther(amountRepository).toString()]
		);

		await helpers.time.increase(helpers.time.duration.days(1));
		// team transfer
		expect(flc.connect(team).transfer(
			owner.getAddress(),
			parseEther(amountTeam)
		)).to.changeTokenBalances(
			flc,
			[team, owner],
			["-" + parseEther(amountTeam).toString(), parseEther(amountTeam).toString()]
		);

		let amountR = parseEther(parseFloat(amountRepository) + 900000 + "");
		// repository transfer
		expect(flc.connect(repository).transfer(
			owner.getAddress(),
			amountR
		)).to.changeTokenBalances(
			flc,
			[repository, owner],
			["-" + amountR, amountR]
		);
	});

	it("balance of USDT", async function() {
		console.log(await usdt.balanceOf(users[0].getAddress()));
		console.log(await usdt.balanceOf(users[1].getAddress()));
	});

	it("buy FLC by USDT", async function() {
		console.log(await flc.getMaxPrivateLot());
		await buy(users[0], owner);
		console.log(await flc.getMaxPrivateLot());
	});

	it("duplicate buy", async function() {
		await buy(users[0], owner);
		await expect(buy(users[0], owner)).to.be.revertedWith("The account has bought!");
	});

	it("buy release", async function() {
		await buy(users[0], owner);
		
		// private transfer
		await expect(flc.connect(users[0]).transfer(
			owner.getAddress(),
			parseEther(4000 / 365 + "")
		)).to.be.revertedWith("The part of balance is locked!");
		
		await helpers.time.increaseTo(await flc.unlockTimePrivateOf(users[0].getAddress()));

		let amount = parseEther(4000 / 365 + "")
		// private transfer
		await expect(flc.connect(users[0]).transfer(
			owner.getAddress(),
			amount
		)).to.changeTokenBalances(
			flc,
			[users[0], owner],
			["-" + amount, amount]
		);
	});

	it("get the max inverser & private lot", async function() {
		console.log(await flc.getMaxInverserLot());
		console.log(await flc.getMaxPrivateLot());
	});

	it("get the inversement price", async function() {
		console.log(await flc.getInversementPrice());
	});

	it("get the inverser & private locks", async function() {
		console.log(await flc.getLocksInverserOf(users[0].getAddress()));
		console.log(await flc.getLocksPrivateOf(users[0].getAddress()));
	});

	it("burn", async function() {
		console.log(await flc.connect(uni).transfer(owner.getAddress(), parseEther("10000")));
		console.log(await flc.burn(parseEther("3000")));
		console.log(formatEther(await flc.balanceOf(owner.getAddress())));
	});
});

async function buy(user, owner) {
	let boardLot = 2;
	let amount = parseEther(10 * boardLot + "");
	console.log(amount);
	await expect(usdt.connect(user).approve(
		flc.address,
		amount,
	)).to.emit(usdt, "Approval").withArgs(await user.getAddress(), flc.address, amount);
	console.log(formatEther(await usdt.allowance(user.getAddress(), flc.address)));
	console.log(await flc.connect(user).buy(boardLot));
	/*
	console.log(formatEther(await usdt.balanceOf(user.getAddress())));
	console.log(formatEther(await usdt.balanceOf(owner.getAddress())));
	console.log(formatEther(await flc.balanceOf(user.getAddress())));
	console.log(formatEther(await flc.balanceOf(owner.getAddress())));
	*/
}
