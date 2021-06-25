import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { ethers, network } from "hardhat";
import lotteryABI from "../abi/PancakeSwapLottery.json";
import { getEndTime, getTicketPrice } from "../utils";
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
      const [_gasPrice, _blockNumber] = await Promise.all([
        ethers.provider.getGasPrice(),
        ethers.provider.getBlockNumber(),
      ]);
      const gasPrice: BigNumber = _gasPrice.mul(BigNumber.from(2)); // Double the recommended gasPrice from the network for faster validation.

      // Get ticket price (in Cake equivalent), for a given network.
      const ticketPrice: string = await getTicketPrice(
        networkName,
        config.Ticket.Price[networkName],
        config.Ticket.Precision[networkName]
      );

      // Start lottery (with configuration parameters).
      const tx = await contract.startLottery(
        getEndTime(),
        parseUnits(ticketPrice, "ether").toString(),
        config.Discount[networkName],
        config.Rewards[networkName],
        config.Treasury[networkName],
        { gasPrice: gasPrice.toString() }
      );

      const message = `[${new Date().toISOString()}] network=${networkName} block=${_blockNumber.toString()} message='Started lottery' hash=${
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
