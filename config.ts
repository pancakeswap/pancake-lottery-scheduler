export default {
  Lottery: {
    mainnet: "0x5aF6D33DE2ccEC94efb1bDF8f92Bd58085432d2c",
    testnet: "0x5790c3534F30437641541a0FA04C992799602998",
  },
  ChainlinkVRF: {
    // https://docs.chain.link/docs/vrf-contracts/
    keyHash: {
      mainnet: "0xc251acd21ec4fb7f31bb8868288bfdbaeb4fbfec2df3735ddbd4f7dc8d60103c",
      testnet: "0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186",
    },
  },
  Ticket: {
    Price: {
      mainnet: 5,
      testnet: 0.1,
    },
    Precision: {
      mainnet: 2,
      testnet: 1,
    },
  },
  Injection: {
    mainnet: 10000,
    testnet: 100,
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
    mainnet: 2000,
    testnet: 2000,
  },
};
