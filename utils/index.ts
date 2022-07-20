import AggregatorV3InterfaceABI from "@chainlink/contracts/abi/v0.8/AggregatorV3Interface.json";
import BigNumber from "bignumber.js";
import { ethers } from "hardhat";
import config from "../config";
import lotteryABI from "../abi/PancakeSwapLottery.json";

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
  // Get current date
  const currentDate = new Date();
  // Convert current date to utc
  const utcDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);

  // Get meridiem (AM/PM), based on current UTC Date.
  const meridiem = utcDate.getHours() >= 12 ? "PM" : "AM";

  if (meridiem === "AM") {
    // We are in the morning (ante-meridiem), next lottery is at 12:00 PM (noon).
    // Set clock to 0
    utcDate.setHours(0);
    utcDate.setMinutes(0);
    utcDate.setSeconds(0);
    // Add 36 hours to clock
    utcDate.setHours(utcDate.getHours()+36);

    // Convert to unix milliseconds and then to seconds
    return utcDate.getTime() / 1000;
  } else if (meridiem === "PM") {
    // We are in the afternoon (post-meridiem), next lottery is at 12:00 AM (midnight).
    utcDate.setHours(12);
    utcDate.setMinutes(0);
    utcDate.setSeconds(0);
    // Add 12 hours to clock
    utcDate.setHours(utcDate.getHours()+12);

    // Convert to unix milliseconds and then to seconds
    return utcDate.getTime() / 1000;
  }

  throw new Error("Could not determine next Lottery end time.");
};

export const isTimeToRun = async (networkName: "testnet" | "mainnet"): Promise<boolean> => {
  let attempt = 1;
  let error;
  let isTime = true;
  while (attempt < 6) {
    try {
      // Bind the smart contract address to the ABI, for a given network.
      const contract = await ethers.getContractAt(lotteryABI, config.Lottery[networkName]);

      // Get network data for running script.
      const lotteryId = await contract.currentLotteryId();

      const tx = await contract.viewLottery(lotteryId);
      isTime = moment.unix(tx.endTime).diff(moment.unix(moment().utc().unix()), "hours") <= 0;
      console.log(attempt);
      break;
    } catch (e) {
      error = e;
    }
    attempt++;
  }
  if (error && attempt >= 5) {
    console.log(error);
  }


  // Get endTime Date
  const endTimeDate = new Date(tx.endTime * 1000);
  // Get current date
  const currentDate = new Date();
  // Convert current date to utc
  const utcDate = new Date(currentDate.getTime() + currentDate.getTimezoneOffset() * 60000);

  // Get difference between endTime and utctime
  let diff =(endTimeDate.getTime() - utcDate.getTime()) / 1000;
  // Convert to hours
  diff /= (60 * 60);
  // Make difference positive and round
  diff = Math.abs(Math.round(diff));

  return diff <= 0

};
