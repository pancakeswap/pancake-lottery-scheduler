import type { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";

 const config: HardhatUserConfig = {
  solidity: "0.6.12",
     defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY!],
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
