import { ethers, network } from "hardhat";
import lotteryABI from "../abi/PancakeSwapLottery.json";
import randomGeneratorABI from "../abi/RandomNumberGenerator.json";
import config from "../config";
import logger from "../utils/logger";

/**
 * Close lottery.
 */
const main = async () => {
  // Get network data from Hardhat config (see hardhat.config.ts).
  const networkName = network.name;

  // Get signer to sign the transaction(s).
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
      const [_blockNumber, _gasPrice, _lotteryId, _randomGenerator] = await Promise.all([
        ethers.provider.getBlockNumber(),
        ethers.provider.getGasPrice(),
        contract.currentLotteryId(),
        contract.randomGenerator(),
      ]);

      // Verify Chainlink VRF Key Hash is set and correct, according to Chainlink documentation, for a given network.
      const randomGeneratorContract = await ethers.getContractAt(randomGeneratorABI, _randomGenerator);
      const keyHash = await randomGeneratorContract.keyHash();
      if (keyHash !== config.Chainlink.VRF.KeyHash[networkName]) {
        throw new Error("Invalid keyHash on RandomGenerator contract.");
      }

      // Create, sign and broadcast transaction.
      const tx = await contract.closeLottery(_lotteryId, {
        from: operator.address,
        gasLimit: 500000,
        gasPrice: _gasPrice.mul(2),
      });

      const message = `[${new Date().toISOString()}] network=${networkName} block=${_blockNumber} message='Closed lottery #${_lotteryId}' hash=${
        tx?.hash
      } signer=${operator.address}`;
      console.log(message);
      logger.info({ message });
    } catch (error) {
      const message = `[${new Date().toISOString()}] network=${networkName} message='${error.message}' signer=${
        operator.address
      }`;
      console.error(message);
      logger.error({ message });
    }
  } else {
    const message = `[${new Date().toISOString()}] network=${networkName} message='Unsupported network' signer=${
      operator.address
    }`;
    console.error(message);
    logger.error({ message });
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
