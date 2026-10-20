// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract STAKEAIStaking is ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint256 public constant BASIS_POINTS = 10_000;

    IERC20 public immutable stakingToken;
    uint256 public totalStaked;

    struct Offer {
        uint64 duration;
        uint16 rewardBps;
    }

    struct Position {
        uint256 amount;
        uint256 reward;
        uint64 unlockAt;
        uint8 offerId;
        bool principalWithdrawn;
    }

    Offer[3] private offers;
    mapping(address => Position[]) private userPositions;

    event Staked(
        address indexed account,
        uint256 indexed positionId,
        uint8 offerId,
        uint256 amount,
        uint256 reward,
        uint256 unlockAt
    );
    event PrincipalWithdrawn(
        address indexed account,
        uint256 indexed positionId,
        uint256 principal
    );

    constructor(address tokenAddress) {
        require(tokenAddress != address(0) && tokenAddress.code.length > 0, "invalid token");
        stakingToken = IERC20(tokenAddress);
        offers[0] = Offer({duration: uint64(7 days), rewardBps: 500});
        offers[1] = Offer({duration: uint64(30 days), rewardBps: 2_500});
        offers[2] = Offer({duration: uint64(180 days), rewardBps: 20_000});
    }

    function getOffer(uint8 offerId) external view returns (uint64 duration, uint16 rewardBps) {
        require(offerId < offers.length, "invalid offer");
        Offer memory offer = offers[offerId];
        return (offer.duration, offer.rewardBps);
    }

    function previewReward(uint8 offerId, uint256 amount) public view returns (uint256) {
        require(offerId < offers.length, "invalid offer");
        return (amount * offers[offerId].rewardBps) / BASIS_POINTS;
    }

    function stake(uint8 offerId, uint256 amount) external nonReentrant {
        require(offerId < offers.length, "invalid offer");
        require(amount > 0, "zero amount");

        uint256 reward = previewReward(offerId, amount);
        require(reward > 0, "stake too small");

        totalStaked += amount;
        stakingToken.safeTransferFrom(msg.sender, address(this), amount);

        Offer memory offer = offers[offerId];
        uint64 unlockAt = uint64(block.timestamp + offer.duration);
        Position[] storage positions = userPositions[msg.sender];
        uint256 positionId = positions.length;
        positions.push(Position({
            amount: amount,
            reward: reward,
            unlockAt: unlockAt,
            offerId: offerId,
            principalWithdrawn: false
        }));

        emit Staked(msg.sender, positionId, offerId, amount, reward, unlockAt);
    }

    function getUserPositions(address account) external view returns (Position[] memory) {
        return userPositions[account];
    }

    function withdrawPrincipal(uint256 positionId) external nonReentrant {
        Position[] storage positions = userPositions[msg.sender];
        require(positionId < positions.length, "invalid position");
        Position storage position = positions[positionId];
        require(!position.principalWithdrawn, "already withdrawn");
        require(block.timestamp >= position.unlockAt, "position is locked");

        position.principalWithdrawn = true;
        totalStaked -= position.amount;
        stakingToken.safeTransfer(msg.sender, position.amount);
        emit PrincipalWithdrawn(msg.sender, positionId, position.amount);
    }
}
