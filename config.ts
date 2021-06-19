export default {
  Lottery: {
    mainnet: "0x0000000000000000000000000000000000000000",
    testnet: "0x374524c998d1E9afC7EB4d2025153b0b3FDCCf29",
  },
  Ticket: {
    // USD eq. price, to be converted in $Cake.
    Price: {
      mainnet: 5,
      testnet: 0.1,
    },
    // Precision (decimals) of the price for better readability, ...
    Precision: {
      mainnet: 2,
      testnet: 6,
    },
  },
  Discount: {
    mainnet: 2000,
    testnet: 2000,
  },
  Rewards: {
    mainnet: [125, 375, 750, 1250, 2500, 5000],
    testnet: [125, 375, 750, 1250, 2500, 5000],
  },
  Treasury: {
    mainnet: 100, // 100 => 1%
    testnet: 2000,
  },
};
