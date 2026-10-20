const hre = require('hardhat');

async function main() {
    const { chainId } = await hre.ethers.provider.getNetwork();
    if (chainId !== 97n) {
        throw new Error(`Refusing deployment on chain ${chainId}; only BNB Smart Chain testnet (97) is allowed.`);
    }

    const tokenAddress = process.env.STAKEAI_TOKEN_ADDRESS?.trim();
    if (!tokenAddress || !hre.ethers.isAddress(tokenAddress)) {
        throw new Error('Set STAKEAI_TOKEN_ADDRESS to the deployed STAKEAI testnet token contract.');
    }

    const [deployer] = await hre.ethers.getSigners();
    if (!deployer) {
        throw new Error('No deployer configured. Set DEPLOYER_PRIVATE_KEY in your local .env file.');
    }

    const token = await hre.ethers.getContractAt('STAKEAI', tokenAddress, deployer);
    const staking = await hre.ethers.deployContract('STAKEAIStaking', [tokenAddress]);
    await staking.waitForDeployment();

    console.log(`STAKEAI staking testnet contract: ${await staking.getAddress()}`);
    console.log(`STAKEAI token contract: ${tokenAddress}`);
    console.log(`Owner/deployer: ${deployer.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
