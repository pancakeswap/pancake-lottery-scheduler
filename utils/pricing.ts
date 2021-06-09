import BigNumber from "bignumber.js";
import { ethers } from "hardhat";
import pairABI from "../abi/PancakePair.json";

// PancakeSwap v2 pair address (mainnet only).
const CAKE_BUSD = "0x804678fa97d91B974ec2af3c843270886528a9E6";

export const getTicketPrice = async (networkName: string, usd: number): Promise<string> => {
  // PancakeSwap v2 is only available on mainnet, static values are used for any other networks (testnet included).
  if (networkName === "mainnet") {
    // Bind the smart contract address to the PancakeSwap Pair ABI, for the given network.
    const contract = await ethers.getContractAt(pairABI, CAKE_BUSD);

    // Get the reserves for the pair as Cake (token0) / BUSD (token1).
    const [reserve0, reserve1] = await contract.getReserves();

    // Compute the Cake equivalent value for 1 BUSD.
    // Note: We output reserve0 / reserve1 BN.js to string to avoid playing with multiple types/implementations.
    const price: BigNumber = new BigNumber(reserve0.toString()).div(new BigNumber(reserve1.toString()));

    // Compute the ticket price (per 1 BUSD), to the required USD equivalent value.
    const ticketPrice: BigNumber = price.times(new BigNumber(usd));

    // Return the ticket price (in Cake equivalent).
    return ticketPrice.toFixed(18);
  }

  // Return a default value, based on 1 Cake = 1 BUSD, for any other networks than 'mainnet'.
  return new BigNumber(usd).toFixed(18);
};
