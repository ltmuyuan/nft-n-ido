// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ABSCToken is ERC20 {
    constructor() ERC20("ABSC", "ABSC") {
        _mint(msg.sender, 6000000000 * 10 ** decimals());
    }
}
