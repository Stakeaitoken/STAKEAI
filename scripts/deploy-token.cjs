const hre = require('hardhat');

async function main() {
    const { chainId } = await hre.ethers.provider.getNetwork();
    if (chainId !== 97n) {
        throw new Error(`Refusing deployment on chain ${chainId}; only BNB Smart Chain testnet (97) is allowed.`);
    }

    const [deployer] = await hre.ethers.getSigners();
    if (!deployer) {
        throw new Error('No deployer configured. Set DEPLOYER_PRIVATE_KEY in your local .env file.');
    }

    const token = await hre.ethers.deployContract('STAKEAI');
    await token.waitForDeployment();
    console.log(`STAKEAI testnet contract: ${await token.getAddress()}`);
    console.log(`Initial supply: ${hre.ethers.formatUnits(await token.totalSupply(), 18)} STAKEAI`);
    console.log(`Deployer: ${deployer.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
