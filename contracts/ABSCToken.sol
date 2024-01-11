// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ABSCToken is ERC20 {
    constructor() ERC20("ABSC", "ABSC") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}
