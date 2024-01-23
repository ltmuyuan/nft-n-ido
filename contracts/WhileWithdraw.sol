// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

abstract contract WhileWithdraw is Context {
    event WhileWithdrew(address account);

    event UnWhileWithdrew(address account);

    bool private _whileWithdraw;

    constructor() {
        _whileWithdraw = false;
    }

    modifier whenNotWithdraw() {
        _requireNotWithdraw();
        _;
    }

    modifier whenWithdraw() {
        _requireWithdraw();
        _;
    }

    function whileWithdraw() public view virtual returns (bool) {
        return _whileWithdraw;
    }

    function _requireNotWithdraw() internal view virtual {
        require(!whileWithdraw(), "WhileWithdraw: withdraw");
    }

    function _requireWithdraw() internal view virtual {
        require(whileWithdraw(), "WhileWithdraw: not withdraw");
    }

    function _setWithdraw() internal virtual whenNotWithdraw {
        _whileWithdraw = true;
        emit WhileWithdrew(_msgSender());
    }

    function _setUnWithdraw() internal virtual whenWithdraw {
        _whileWithdraw = false;
        emit UnWhileWithdrew(_msgSender());
    }
}
