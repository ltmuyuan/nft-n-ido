// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

abstract contract WhileOpen is Context {
    event WhileOpened(address account);

    event UnWhileOpened(address account);

    bool private _whileOpened;

    constructor() {
        _whileOpened = false;
    }

    modifier whenNotOpened() {
        _requireNotOpened();
        _;
    }

    modifier whenOpened() {
        _requireOpened();
        _;
    }

    function whileOpened() public view virtual returns (bool) {
        return _whileOpened;
    }

    function _requireNotOpened() internal view virtual {
        require(!whileOpened(), "WhileOpen: opened");
    }

    function _requireOpened() internal view virtual {
        require(whileOpened(), "WhileOpen: not opened");
    }

    function _open() internal virtual whenNotOpened {
        _whileOpened = true;
        emit WhileOpened(_msgSender());
    }

    function _unopen() internal virtual whenOpened {
        _whileOpened = false;
        emit UnWhileOpened(_msgSender());
    }
}
