require('dotenv').config();
require('@nomicfoundation/hardhat-ethers');

const accounts = process.env.DEPLOYER_PRIVATE_KEY
    ? [process.env.DEPLOYER_PRIVATE_KEY]
    : [];

module.exports = {
    solidity: '0.8.24',
    networks: {
        bscTestnet: {
            url: process.env.BSC_TESTNET_RPC_URL || 'https://data-seed-prebsc-1-s1.bnbchain.org:8545',
            chainId: 97,
            accounts
        }
    }
};
