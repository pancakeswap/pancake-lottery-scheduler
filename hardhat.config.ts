import type { HardhatUserConfig } from "hardhat/types";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task("accounts", "Prints the list of accounts", async (args, { ethers }) => {
  const [operator, injector] = await ethers.getSigners();

  console.log(`Operator address: ${operator.address}`);
  console.log(`Injector address: ${injector.address}`);
});

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-2-s2.binance.org:8545/",
      chainId: 97,
      accounts: [process.env.OPERATOR_PRIVATE_KEY!, process.env.INJECTOR_PRIVATE_KEY!],
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [process.env.OPERATOR_PRIVATE_KEY!, process.env.INJECTOR_PRIVATE_KEY!],
    },
  },
};

export default config;
