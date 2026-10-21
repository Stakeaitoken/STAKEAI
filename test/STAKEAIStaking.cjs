const { expect } = require('chai');
const { ethers } = require('hardhat');

async function expectRevert(promise, reason) {
    let caught;
    try {
        await promise;
    } catch (error) {
        caught = error;
    }
    expect(caught, 'expected transaction to revert').to.exist;
    expect(caught.message).to.include(reason);
}

describe('STAKEAIStaking', function () {
    it('rejects zero addresses and non-contract staking tokens', async function () {
        await expectRevert(
            ethers.deployContract('STAKEAIStaking', [ethers.ZeroAddress]),
            'invalid token'
        );
        const [owner] = await ethers.getSigners();
        await expectRevert(
            ethers.deployContract('STAKEAIStaking', [owner.address]),
            'invalid token'
        );
    });

    async function deployStaking() {
        const [owner, staker] = await ethers.getSigners();
        const token = await ethers.deployContract('STAKEAI');
        const staking = await ethers.deployContract('STAKEAIStaking', [await token.getAddress()]);
        const stakeAmount = ethers.parseUnits('100', 18);
        await token.transfer(staker.address, stakeAmount);
        return { owner, staker, token, staking, stakeAmount };
    }

    it('uses the configured terms and previews non-compounding rewards', async function () {
        const { staking } = await deployStaking();
        const expected = [
            [7n * 24n * 60n * 60n, 500n],
            [30n * 24n * 60n * 60n, 2_500n],
            [180n * 24n * 60n * 60n, 20_000n]
        ];

        for (let offerId = 0; offerId < expected.length; offerId += 1) {
            expect(await staking.getOffer(offerId)).to.deep.equal(expected[offerId]);
        }
        expect(await staking.previewReward(0, ethers.parseUnits('100', 18)))
            .to.equal(ethers.parseUnits('5', 18));
        expect(await staking.previewReward(1, ethers.parseUnits('100', 18)))
            .to.equal(ethers.parseUnits('25', 18));
        expect(await staking.previewReward(2, ethers.parseUnits('100', 18)))
            .to.equal(ethers.parseUnits('200', 18));
    });

    it('locks principal, records the manual reward, and returns principal only at maturity', async function () {
        const { staker, token, staking, stakeAmount } = await deployStaking();
        const stakingAddress = await staking.getAddress();
        await token.connect(staker).approve(stakingAddress, stakeAmount);
        await staking.connect(staker).stake(0, stakeAmount);

        const positions = await staking.getUserPositions(staker.address);
        expect(positions).to.have.length(1);
        expect(positions[0].amount).to.equal(stakeAmount);
        expect(positions[0].reward).to.equal(ethers.parseUnits('5', 18));
        expect(positions[0].principalWithdrawn).to.equal(false);
        expect(await staking.totalStaked()).to.equal(stakeAmount);

        await expectRevert(staking.connect(staker).withdrawPrincipal(0), 'position is locked');
        await ethers.provider.send('evm_increaseTime', [7 * 24 * 60 * 60]);
        await ethers.provider.send('evm_mine');

        const balanceBefore = await token.balanceOf(staker.address);
        await staking.connect(staker).withdrawPrincipal(0);
        expect(await token.balanceOf(staker.address))
            .to.equal(balanceBefore + stakeAmount);
        expect(await staking.totalStaked()).to.equal(0n);
        expect(await staking.getUserPositions(staker.address).then((items) => items[0].principalWithdrawn))
            .to.equal(true);
        await expectRevert(staking.connect(staker).withdrawPrincipal(0), 'already withdrawn');
    });

    it('rejects stakes too small to produce a positive reward', async function () {
        const { staker, token, staking } = await deployStaking();
        const amount = 1n;
        await token.connect(staker).approve(await staking.getAddress(), amount);
        await expectRevert(staking.connect(staker).stake(0, amount), 'stake too small');
    });

    it('rejects invalid offers and zero stakes', async function () {
        const { staker, token, staking, stakeAmount } = await deployStaking();
        await expectRevert(staking.getOffer(3), 'invalid offer');
        await expectRevert(staking.connect(staker).stake(3, stakeAmount), 'invalid offer');
        await expectRevert(staking.connect(staker).stake(0, 0), 'zero amount');
    });
});

describe('STAKEAIStakingV2', function () {
    async function deployStaking() {
        const [owner, staker, other] = await ethers.getSigners();
        const token = await ethers.deployContract('STAKEAI');
        const staking = await ethers.deployContract('STAKEAIStakingV2', [await token.getAddress()]);
        const stakeAmount = ethers.parseUnits('100', 18);
        await token.transfer(staker.address, stakeAmount);
        return { owner, staker, other, token, staking, stakeAmount };
    }

    it('requires owner-funded rewards and reserves them when a position is created', async function () {
        const { owner, staker, token, staking, stakeAmount } = await deployStaking();
        const stakingAddress = await staking.getAddress();
        const reward = ethers.parseUnits('5', 18);

        await token.connect(staker).approve(stakingAddress, stakeAmount);
        await expectRevert(staking.connect(staker).stake(0, stakeAmount), 'insufficient reward pool');

        await token.approve(stakingAddress, reward);
        await staking.fundRewards(reward);
        expect(await staking.availableRewards()).to.equal(reward);
        await staking.connect(staker).stake(0, stakeAmount);

        expect(await staking.availableRewards()).to.equal(0n);
        expect(await staking.reservedRewards()).to.equal(reward);
        expect(await staking.totalStaked()).to.equal(stakeAmount);
        const [position] = await staking.getUserPositions(staker.address);
        expect(position.reward).to.equal(reward);
        expect(position.withdrawn).to.equal(false);
    });

    it('returns principal and reward together at maturity and protects reserved rewards', async function () {
        const { staker, token, staking, stakeAmount } = await deployStaking();
        const stakingAddress = await staking.getAddress();
        const reward = ethers.parseUnits('5', 18);
        const unallocated = ethers.parseUnits('10', 18);

        await token.approve(stakingAddress, reward + unallocated);
        await staking.fundRewards(reward + unallocated);
        await token.connect(staker).approve(stakingAddress, stakeAmount);
        await staking.connect(staker).stake(0, stakeAmount);

        expect(await staking.availableRewards()).to.equal(unallocated);
        expect(await staking.reservedRewards()).to.equal(reward);
        await expectRevert(staking.connect(staker).withdraw(0), 'position is locked');
        await expectRevert(
            staking.withdrawUnallocatedRewards(unallocated + 1n),
            'exceeds available rewards'
        );
        await staking.withdrawUnallocatedRewards(unallocated);
        expect(await staking.availableRewards()).to.equal(0n);
        expect(await staking.reservedRewards()).to.equal(reward);

        await ethers.provider.send('evm_increaseTime', [7 * 24 * 60 * 60]);
        await ethers.provider.send('evm_mine');
        const balanceBefore = await token.balanceOf(staker.address);
        await staking.connect(staker).withdraw(0);
        expect(await token.balanceOf(staker.address)).to.equal(balanceBefore + stakeAmount + reward);
        expect(await staking.totalStaked()).to.equal(0n);
        expect(await staking.reservedRewards()).to.equal(0n);
        expect((await staking.getUserPositions(staker.address))[0].withdrawn).to.equal(true);
        await expectRevert(staking.connect(staker).withdraw(0), 'already withdrawn');
    });

    it('restricts reward-pool funding and withdrawal to the owner', async function () {
        const { staker, token, staking } = await deployStaking();
        const amount = ethers.parseUnits('1', 18);
        await expectRevert(staking.connect(staker).fundRewards(amount), 'OwnableUnauthorizedAccount');
        await expectRevert(staking.connect(staker).withdrawUnallocatedRewards(amount), 'OwnableUnauthorizedAccount');
        await expectRevert(staking.fundRewards(0), 'zero amount');
    });
});
