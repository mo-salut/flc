require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork: "local",
	networks: {
		local: {
			url: "http://127.0.0.1:8545"
		},
		goerli: {
			url: "https://eth-goerli.g.alchemy.com/v2/HF9zrMo6C1SqvhXgTIZ5Ytw5KPYMsWw6",
			accounts: ["a011bd23f32d3069d285d5d0119e5d5ff1ea62c9863f79b0d3f3585ab0b96f3a"]
		}
	},
	solidity: {
		version: "0.8.9",
		settings: {
			optimizer: {
			enabled: true,
			runs: 200
			}
		}
	}
};
