// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract STAKEAI is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 21_000_000 * 10 ** 18;

    constructor() ERC20("STAKEAI", "STKAI") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
