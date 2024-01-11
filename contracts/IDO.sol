// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./WhileOpen.sol";
import "./WhileRelease.sol";

contract IDO is Ownable, WhileOpen, WhileRelease {
    using SafeERC20 for IERC20;

    using SafeMath for uint256;

    // Tokens for sale
    IERC20 public token;

    uint256 public tokenEthRate;

    // Max Allocation for one wallet
    uint256 public maxAllocation;

    // Min Allocation for one wallet
    uint256 public minAllocation;

    // Mapping which hold how much bought every wallet
    mapping(address => uint256) public allocations;

    uint256 public totalAmount;

    uint256 public constant VIEW_CONSTANT = 100;

    //user buy event
    event PurchaseCompleted(address indexed buyer, uint256 amount);

    event TokensClaimed(address indexed user, uint256 amount);

    constructor(
        address token_,
        uint256 tokenEthRate_,
        uint256 maxAllocation_,
        uint256 minAllocation_
    ) {
        token = IERC20(token_);
        maxAllocation = maxAllocation_;
        minAllocation = minAllocation_;
        tokenEthRate = tokenEthRate_;
    }

    //only admin set min allocation
    function setMinPurchaseAmount(uint256 _minAllocation) external onlyOwner {
        minAllocation = _minAllocation;
    }

    // only admin set max allocation
    function setMaxPurchaseAmount(uint256 _maxAllocation) external onlyOwner {
        maxAllocation = _maxAllocation;
    }

    // only admin set token eth rate
    function setTokenEthRate(uint256 _tokenEthRate) external onlyOwner {
        tokenEthRate = _tokenEthRate;
    }

    // only admin set token
    function setToken(address _token) external onlyOwner {
        token = IERC20(_token);
    }

    // only admin set opened
    function open() external onlyOwner {
        _open();
    }

    // only admin set opened
    function unopen() external onlyOwner {
        _unopen();
    }

    // only admin set release
    function release() external onlyOwner {
        _release();
    }

    // only admin set release
    function unrelease() external onlyOwner {
        _unrelease();
    }

    //user buy token
    function purchase() external payable whenOpened {
        require(msg.value >= minAllocation, "Below minimum purchase amount");
        require(msg.value <= maxAllocation, "Exceeds maximum purchase amount");
        address sender = msg.sender;
        require(
            allocations[sender].add(msg.value) <= maxAllocation,
            "TokenSale: you try buy more than max allocation"
        );
        allocations[sender] = allocations[sender].add(msg.value);
        totalAmount = totalAmount.add(msg.value);
        emit PurchaseCompleted(msg.sender, msg.value);
    }

    function claim() external payable whenReleased {
        uint256 claimAmount = allocations[msg.sender];
        require(claimAmount > 0, "You have no right to claim");

        uint256 tokenAmount = (claimAmount.mul(tokenEthRate)).div(
            VIEW_CONSTANT
        );
        require(
            token.balanceOf(address(this)) >= tokenAmount,
            "Insufficient tokens in the contract"
        );
        allocations[msg.sender] = 0;
        token.safeTransfer(msg.sender, tokenAmount);
        emit TokensClaimed(msg.sender, tokenAmount);
    }

    function getTokensBalance() public view returns (uint256 balance) {
        balance = token.balanceOf(address(this));
    }

    function withdrawEth(address to) external onlyOwner {
        payable(to).transfer(address(this).balance);
    }

    function withdrawTokens() external onlyOwner {
        token.safeTransfer(msg.sender, token.balanceOf(address(this)));
    }
}
