import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { ethers, network } from "hardhat";
import lotteryABI from "../abi/PancakeSwapLottery.json";
import config from "../config";
import logger from "../utils/logger";

/**
 * Draw lottery.
 */
const main = async () => {
  // Get network data from Hardhat config (see hardhat.config.ts).
  const networkName = network.name;

  // Get signers to sign the transaction(s).
  const [operator] = await ethers.getSigners();

  // Check if the network is supported.
  if (networkName === "testnet" || networkName === "mainnet") {
    // Check if the private key is set (see ethers.js signer).
    if (!process.env.OPERATOR_PRIVATE_KEY) {
      throw new Error("Missing private key (signer).");
    }
    // Check if the PancakeSwap Lottery smart contract address is set.
    if (config.Lottery[networkName] === ethers.constants.AddressZero) {
      throw new Error("Missing smart contract (Lottery) address.");
    }

    try {
      // Bind the smart contract address to the ABI, for a given network.
      const contract = await ethers.getContractAt(lotteryABI, config.Lottery[networkName]);

      // Get network data for running script.
      const [_gasPrice, _blockNumber, _lotteryId] = await Promise.all([
        ethers.provider.getGasPrice(),
        ethers.provider.getBlockNumber(),
        contract.currentLotteryId(),
      ]);
      const gasPrice: BigNumber = _gasPrice.mul(BigNumber.from(2)); // Double the recommended gasPrice from the network for faster validation.

      // Create, sign and broadcast transaction.
      const tx = await contract.drawFinalNumberAndMakeLotteryClaimable(_lotteryId.toString(), true, {
        gasPrice: gasPrice.toString(),
        from: operator,
      });

      const message = `[${new Date().toISOString()}] network=${networkName} block=${_blockNumber.toString()} message='Drawed lottery #${_lotteryId}' hash=${
        tx?.hash
      } gasPrice=${formatUnits(gasPrice.toString(), "gwei")} signer=${operator.address}`;
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
