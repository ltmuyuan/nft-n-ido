//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./ERC404.sol";
import "./strings.sol";

contract ABSC is ERC404 {
    string public baseTokenURI;

    constructor(address _owner) ERC404("ABSC", "ABSC", 18, 100000000, _owner) {
      //考虑下 owner有钱还是mint有钱
        balanceOf[_owner] = 6000000000 * 10 ** 18;
    }

    function setTokenURI(string memory _tokenURI) public onlyOwner {
        baseTokenURI = _tokenURI;
    }

    function setNameSymbol(
        string memory _name,
        string memory _symbol
    ) public onlyOwner {
        _setNameSymbol(_name, _symbol);
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
      return string.concat(baseTokenURI, Strings.toString(id));
    }

    function _getUnit() internal view override returns (uint256) {
      return 600000 * 10 ** decimals;
    }

    // mint需要费用 1ABSC=0.001111USDT 普通用户
    // 需要whitelist 打折 1ABSC=0.001111*0.007 白名单用户 白名单=300个
    // mint是按主链币付钱，规定一次打够一张NFT
    // 总共mint限制6666张 后续可修改

}
