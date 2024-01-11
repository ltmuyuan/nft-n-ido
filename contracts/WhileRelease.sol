// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.7.0) (security/Pausable.sol)

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Context.sol";

abstract contract WhileRelease is Context {
    event WhileReleased(address account);

    event UnWhileReleased(address account);

    bool private _whileReleased;

    constructor() {
        _whileReleased = false;
    }

    modifier whenNotReleased() {
        _requireNotReleased();
        _;
    }

    modifier whenReleased() {
        _requireReleased();
        _;
    }

    function whileReleased() public view virtual returns (bool) {
        return _whileReleased;
    }

    function _requireNotReleased() internal view virtual {
        require(!whileReleased(), "WhileRelease: released");
    }

    function _requireReleased() internal view virtual {
        require(whileReleased(), "WhileRelease: not released");
    }

    function _release() internal virtual whenNotReleased {
        _whileReleased = true;
        emit WhileReleased(_msgSender());
    }

    function _unrelease() internal virtual whenReleased {
        _whileReleased = false;
        emit UnWhileReleased(_msgSender());
    }
}
