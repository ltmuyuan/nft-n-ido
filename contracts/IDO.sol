// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {SafeMath} from "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {WhileOpen} from "./WhileOpen.sol";
import {WhileRelease} from "./WhileRelease.sol";
import {WhileWithdraw} from "./WhileWithdraw.sol";

contract IDO is Ownable, WhileOpen, WhileRelease, WhileWithdraw {
    using SafeERC20 for IERC20;

    using SafeMath for uint256;

    // Tokens for sale
    IERC20 public token;
    // Max Allocation for one wallet
    uint256 public maxAllocation;

    // Min Allocation for one wallet
    uint256 public minAllocation;

    uint256 public constant VIEW_CONSTANT = 100;

    //current stage
    uint8 public stage;
    //stage=>tokenEthRate
    mapping(uint8 => uint256) public tokenEthRate;
    //stage=>totalAmount
    mapping(uint8 => uint256) public totalAmount;
    //stage=>totalErc20Amount
    mapping(uint8 => uint256) public totalErc20Amount;
    //stage=>address=>allocations
    mapping(uint8 => mapping(address => uint256)) public allocations;
    //stage=>address=>erc20 allocations
    mapping(uint8 => mapping(address => uint256)) public erc20Allocations;

    //user buy event
    event PurchaseCompleted(
        address indexed buyer,
        uint8 indexed stage,
        uint256 indexed amount
    );

    event TokensClaimed(address indexed user, uint256 indexed amount);

    event WithdrawCompleted(address indexed user, uint256 indexed amount);

    constructor(
        address token_,
        uint256 maxAllocation_,
        uint256 minAllocation_,
        uint8 stage_
    ) {
        token = IERC20(token_);
        maxAllocation = maxAllocation_;
        minAllocation = minAllocation_;
        stage = stage_;
    }

    //only admin set _stage
    function setStage(uint8 _stage) external onlyOwner {
        stage = _stage;
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
    function setTokenEthRate(
        uint8 _stage,
        uint256 _tokenEthRate
    ) external onlyOwner {
        tokenEthRate[_stage] = _tokenEthRate;
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

    // only admin set withdraw
    function setWithdraw() external onlyOwner {
        _setWithdraw();
    }

    // only admin set withdraw
    function setUnWithdraw() external onlyOwner {
        _setUnWithdraw();
    }

    //user buy token
    function purchase() external payable whenOpened {
        require(msg.value >= minAllocation, "Below minimum purchase amount");
        require(msg.value <= maxAllocation, "Exceeds maximum purchase amount");
        address sender = msg.sender;
        uint256 tokenAmount = (msg.value.mul(tokenEthRate[stage])).div(
            VIEW_CONSTANT
        );
        allocations[stage][sender] = allocations[stage][sender].add(msg.value);
        erc20Allocations[stage][sender] = erc20Allocations[stage][sender].add(
            tokenAmount
        );
        totalAmount[stage] = totalAmount[stage].add(msg.value);
        totalErc20Amount[stage] = totalErc20Amount[stage].add(tokenAmount);
        emit PurchaseCompleted(msg.sender, stage, msg.value);
    }

    function claim() external whenReleased {
        uint256 tokenAmount = 0;
        for (uint8 i = 1; i <= stage; i++) {
            tokenAmount = tokenAmount.add(erc20Allocations[i][msg.sender]);
        }
        require(tokenAmount > 0, "You have no right to claim");

        require(
            token.balanceOf(address(this)) >= tokenAmount,
            "Insufficient tokens in the contract"
        );
        for (uint8 i = 1; i <= stage; i++) {
            erc20Allocations[i][msg.sender] = 0;
        }
        token.safeTransfer(msg.sender, tokenAmount);
        emit TokensClaimed(msg.sender, tokenAmount);
    }

    function withdraw() external payable whenWithdraw {
        uint256 ethAmount = 0;
        uint256 tokenAmount = 0;
        for (uint8 i = 1; i <= stage; i++) {
            ethAmount = ethAmount.add(allocations[i][msg.sender]);
            tokenAmount = tokenAmount.add(erc20Allocations[i][msg.sender]);
        }
        require(ethAmount > 0, "No withdrawable amount available");
        require(tokenAmount > 0, "You have completed the claim");

        require(
            address(this).balance >= ethAmount,
            "Insufficient balance in the contract"
        );
        for (uint8 i = 1; i <= stage; i++) {
            erc20Allocations[i][msg.sender] = 0;
            allocations[i][msg.sender] = 0;
        }
        payable(msg.sender).transfer(ethAmount);
        emit WithdrawCompleted(msg.sender, ethAmount);
    }

    function getTokensBalance() public view returns (uint256 balance) {
        balance = token.balanceOf(address(this));
    }

    function withdrawEth(address to) external onlyOwner {
        require(to != address(0), "Withdraw to the zero address");
        payable(to).transfer(address(this).balance);
    }

    function withdrawTokens() external onlyOwner {
        token.safeTransfer(msg.sender, token.balanceOf(address(this)));
    }
}
