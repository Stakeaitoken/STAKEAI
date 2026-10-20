const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('STAKEAI', function () {
    it('mints a fixed 21 million token supply to the deployer', async function () {
        const [deployer] = await ethers.getSigners();
        const token = await ethers.deployContract('STAKEAI');

        expect(await token.name()).to.equal('STAKEAI');
        expect(await token.symbol()).to.equal('STKAI');
        expect(await token.decimals()).to.equal(18n);
        expect(await token.totalSupply()).to.equal(ethers.parseUnits('21000000', 18));
        expect(await token.balanceOf(deployer.address)).to.equal(ethers.parseUnits('21000000', 18));
    });

    it('supports standard holder-to-holder transfers', async function () {
        const [deployer, recipient] = await ethers.getSigners();
        const token = await ethers.deployContract('STAKEAI');
        const amount = ethers.parseUnits('125', 18);

        await token.transfer(recipient.address, amount);

        expect(await token.balanceOf(recipient.address)).to.equal(amount);
        expect(await token.balanceOf(deployer.address)).to.equal(ethers.parseUnits('20999875', 18));
        expect(await token.totalSupply()).to.equal(ethers.parseUnits('21000000', 18));
    });
});
