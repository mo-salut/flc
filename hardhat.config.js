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
		},
		mainnet: {
			url: "https://eth-mainnet.g.alchemy.com/v2/ICQSgJ-Nd3hbjbxEl4AiS83lPhWlk-WY",
			accounts: ["c7d66f095198157262ba197035c982e39a089d12b3bab26f30c62fa52981b1ff"]
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
