import BigNumber from "bignumber.js";
import { ethers } from "hardhat";
import pairABI from "../abi/PancakePair.json";

// PancakeSwap v2 pair address (mainnet only).
const CAKE_BUSD = "0x804678fa97d91B974ec2af3c843270886528a9E6";

export const getTicketPrice = async (): Promise<BigNumber> => {
  // Bind the smart contract address to the PancakeSwap Pair ABI, for the given network.
  // Note: PancakeSwap is only available on mainnet, static values are used for testnet.
  const contract = await ethers.getContractAt(pairABI, CAKE_BUSD);

  const [reserve0, reserve1] = await contract.getReserves();
  const price: BigNumber = new BigNumber(reserve0.toString()).div(new BigNumber(reserve1.toString()));

  return price.times(1e18);
};
