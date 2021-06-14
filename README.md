# Pancake Lottery Scheduler

### Description

The scheduler is composed of multiple scripts used to call `startLottery`, `closeLottery`, or `drawFinalNumberAndMakeLotteryClaimable` functions, and trigger events; as well as monitoring lottery results.

### Config

- `Lottery`: Address of [PancakeSwapLottery](https://github.com/pancakeswap/pancake-contracts/tree/master/projects/lottery) contract
- `Length`: Length (time-based, denominated in seconds)
- `TicketPrice`: Ticket price, denominated in [$Cake](https://bscscan.com/token/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82)
- `Discount`: Divisor to compute discount magnitude for bulk ticket purchase
- `Rewards`: Reward breakdown per bracket (total must be equal to 10,000)
- `Treasury`: Fee, denominated in percentage, to 2 decimals (e.g.: 100 => 1%)

### Deployment

Configuration can be set by editing [config.ts](config.ts) file.

```shell script
# Export operator private key to be used on Hardhat Network Config.
$ export PRIVATE_KEY=PRIVATE_KEY

$ yarn execute:[command]:[network]
```

#### Command(s)

- `start`: Start a new lottery round; for a given network.
- `close-draw`: Close a lottery round, and draw winning numbers, based on `currentLotteryId`; for a given network.

#### Network(s)

- `56` - Mainnet (`0x38`)

- `97` - Testnet (`0x61`)

### Logging

Logs would be generated at `logs/lottery-YYYY-MM-DD.log` and would be archived (.gz) daily.

Example of logs for success:

```log
{"message":"[1970-01-01T00:00:00.000Z] network=testnet block=10000000 message='Started lottery' hash=sdf gasPrice=10.0","level":"info"}
{"message":"[1970-01-01T00:01:00.000Z] network=testnet block=10010010 message='Closed lottery #123' gasPrice=10.0","level":"info"}
{"message":"[1970-01-01T00:02:00.000Z] network=testnet block=10100100 message='Started lottery' hash=0x... gasPrice=15.0","level":"info"}
```

Example of logs for error:

```log
{"message":"[1970-01-01T00:03:00.000Z] network=testnet message='Unsupported network'","level":"error"}
{"message":"[1970-01-01T00:04:00.000Z] network=testnet message='Invalid JSON RPC response'","level":"error"}
```
