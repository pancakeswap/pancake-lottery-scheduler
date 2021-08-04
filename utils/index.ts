import AggregatorV3InterfaceABI from "@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json";
import BigNumber from "bignumber.js";
import { ethers } from "hardhat";
import moment from "moment";
import config from "../config";

/**
 * Get the ticket price, based on current network, as $Cake.
 * Used by 'start-lottery' Hardhat script, only.
 */
export const getTicketPrice = async (
  networkName: "testnet" | "mainnet",
  usd: number,
  precision: number
): Promise<string> => {
  // Bind the smart contract address to the Chainlink AggregatorV3Interface ABI, for the given network.
  const contract = await ethers.getContractAt(AggregatorV3InterfaceABI, config.Chainlink.Oracle[networkName]);

  // Get the answer from the latest round data.
  const [, answer] = await contract.latestRoundData();

  // Format the answer to a fixed point number, as per Oracle's decimals.
  // Note: We output answer BN.js to string to avoid playing with multiple types/implementations.
  const price: BigNumber = new BigNumber(answer.toString()).div(1e8);

  // Compute the ticket price (denominated in $Cake), to the required USD eq. value.
  const ticketPrice: BigNumber = new BigNumber(usd).div(price);

  // Return the ticket price, up to `n` decimals.
  return ticketPrice.toFixed(precision);
};

/**
 * Get the next lottery 'endTime', based on current date, as UTC.
 * Used by 'start-lottery' Hardhat script, only.
 */
export const getEndTime = (): number => {
  // Get current date, as UTC.
  const now = moment().utc();

  // Get meridiem (AM/PM), based on current UTC Date.
  const meridiem = now.format("A");
  if (meridiem === "AM") {
    // We are in the morning (ante-meridiem), next lottery is at 06:00 AM.
    return moment(`${now.format("MM DD YYYY")} 06:00:00 +0000`, "MM DD YYYY HH:mm:ss Z", true)
      .add(12, "hours")
      .startOf("hour")
      .utc()
      .unix();
  } else if (meridiem === "PM") {
    // We are in the afternoon (post-meridiem), next lottery is at 06:00 PM.
    return moment(`${now.format("MM DD YYYY")} 18:00:00 +0000`, "MM DD YYYY HH:mm:ss Z", true)
      .add(12, "hours")
      .startOf("hour")
      .utc()
      .unix();
  }

  throw new Error("Could not determine next Lottery end time.");
};
