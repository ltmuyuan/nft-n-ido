import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  networks: {
    testnet: {
      chainId: 97,
      // url: process.env.RPC_URI_TEST || '',
      url: "https://bsc-testnet.publicnode.com",
      // accounts: ["xxxxxxxx"],
    },
    mainnet: {
      chainId: 56,
      // url: process.env.RPC_URI_MAIN || '',
      url: "https://bsc-testnet.publicnode.com",
      // accounts: ["xxxxxxxxx"],
    },
    hardhat: {
      accounts: {
        accountsBalance: "1000000000000000000000000"
      }
    }
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};

export default config;
