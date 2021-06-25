import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { ethers, network } from "hardhat";
import lotteryABI from "../abi/PancakeSwapLottery.json";
import config from "../config";
import logger from "../utils/logger";

const main = async () => {
  // Get network data from Hardhat config (see hardhat.config.ts).
  const networkName = network.name;

  // Check if the network is supported.
  if (networkName === "testnet" || networkName === "mainnet") {
    // Check if the configuration is valid.
    if (!process.env.PRIVATE_KEY) {
      throw new Error("Missing private key (signer).");
    }
    if (config.Lottery[networkName] === ethers.constants.AddressZero) {
      throw new Error("Missing smart contract (Lottery) address.");
    }

    try {
      // Bind the smart contract address to the ABI, for the given network.
      const contract = await ethers.getContractAt(lotteryABI, config.Lottery[networkName]);

      // Get network data for running script.
      const [_gasPrice, _blockNumber, currentLotteryId] = await Promise.all([
        ethers.provider.getGasPrice(),
        ethers.provider.getBlockNumber(),
        contract.currentLotteryId(),
      ]);
      const gasPrice: BigNumber = _gasPrice.mul(BigNumber.from(2)); // Double the recommended gasPrice from the network for faster validation.

      // Close lottery.
      const tx = await contract.closeLottery(currentLotteryId.toString(), { gasPrice: gasPrice.toString() });

      const message = `[${new Date().toISOString()}] network=${networkName} block=${_blockNumber.toString()} message='Closed lottery #${currentLotteryId}' hash=${
        tx?.hash
      } gasPrice=${formatUnits(gasPrice.toString(), "gwei")}`;
      console.log(message);
      logger.info({ message });
    } catch (error) {
      const message = `[${new Date().toISOString()}] network=${networkName} message='${error.message}'`;
      console.error(message);
      logger.error({ message });
    }
  } else {
    const message = `[${new Date().toISOString()}] network=${networkName} message='Unsupported network'`;
    console.error(message);
    logger.error({ message });
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
