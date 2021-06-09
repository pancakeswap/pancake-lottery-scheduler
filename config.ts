export default {
  Lottery: {
    mainnet: "0x0000000000000000000000000000000000000000",
    testnet: "0x46282300c9634fD4aBb99F6aDEFd7d870a54d157",
  },
  Length: {
    mainnet: 43200, // 12 hours in seconds
    testnet: 99999, // Maximum time
  },
  TicketPrice: {
    // Denominated in $Cake - 0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82 (mainnet)
    mainnet: 500000000000000000, // 5
    testnet: 500000000000000000, // 5
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
