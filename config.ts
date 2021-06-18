export default {
  Lottery: {
    mainnet: "0x0000000000000000000000000000000000000000",
    testnet: "0x61eB006004Ed122087036C827065aF0111d06C1A",
  },
  Ticket: {
    Price: {
      mainnet: 5,
      testnet: 0.1,
    },
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
