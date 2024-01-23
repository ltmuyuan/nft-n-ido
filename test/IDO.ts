import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("IDO", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployIDO() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const ABSCToken = await ethers.getContractFactory("ABSCToken");

    const absc = await ABSCToken.deploy();

    const tokenAddress = absc.target;
    // 10000 eth
    const maxAllocation = ethers.parseEther("10000");
    // 1 eth
    const minAllocation = ethers.parseEther("1");
    // 1
    const stage = 1;
    const IDO = await ethers.getContractFactory("IDO");
    const ido = await IDO.deploy(tokenAddress, maxAllocation, minAllocation, stage);
    const tokenEthRate1 = 32397408
    const tokenEthRate2 = 29452189
    const tokenEthRate3 = 26997840
    await ido.setTokenEthRate(1, tokenEthRate1)
    await ido.setTokenEthRate(2, tokenEthRate2)
    await ido.setTokenEthRate(3,tokenEthRate3)
    return { ido, absc, owner, otherAccount,stage, minAllocation,maxAllocation,tokenEthRate1,tokenEthRate2,tokenEthRate3};
  }

  describe("Deployment", function () {
    it("Should set the right stage", async function () {
      const { ido, stage } = await loadFixture(deployIDO);
      expect(await ido.stage()).to.equal(stage);
    });

    it("Should set the right owner", async function () {
      const { ido, owner } = await loadFixture(deployIDO);
      expect(await ido.owner()).to.equal(owner.address);
    });

    it("Should set the right minAllocation", async function () {
      const { ido, minAllocation } = await loadFixture(deployIDO);
      expect(await ido.minAllocation()).to.equal(minAllocation);
    });

    it("Should set the right maxAllocation", async function () {
      const { ido, maxAllocation } = await loadFixture(deployIDO);
      expect(await ido.maxAllocation()).to.equal(maxAllocation);
    });

    it("Should set the right open flag", async function () {
      const { ido } = await loadFixture(deployIDO);
      expect(await ido.whileOpened()).to.equal(false);
    });

    it("Should set the right release flag", async function () {
      const { ido } = await loadFixture(deployIDO);
      expect(await ido.whileReleased()).to.equal(false);
    });

    it("Should set the right ERC20", async function () {
      const { absc, owner } = await loadFixture(deployIDO);
      expect(BigInt(await absc.balanceOf(owner.address))).to.equal(BigInt(6000000000)*BigInt(10**18));
    });
  });

  describe("SetMinPurchaseAmount", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        const minAllocation = BigInt(2 * 10 ** 18);
        // We use ido.connect() to send a transaction from another account
        await expect(ido.connect(otherAccount).setMinPurchaseAmount(minAllocation)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
    describe("Execute", function () {
      it("Execute success", async function () {
        const { ido } = await loadFixture(deployIDO);
        const minAllocation = BigInt(2 * 10 ** 18);
        await ido.setMinPurchaseAmount(minAllocation)
        expect(await ido.minAllocation()).to.equal(minAllocation);
      });
    });
  });

  describe("SetMaxPurchaseAmount", function () {
      describe("Validations", function () {
        it("Should revert with the right error if called from another account", async function () {
          const { ido, otherAccount } = await loadFixture(deployIDO);
          const maxAllocation = BigInt(2000 * 10 ** 18);
          // We use ido.connect() to send a transaction from another account
          await expect(ido.connect(otherAccount).setMaxPurchaseAmount(maxAllocation)).to.be.revertedWith(
            "Ownable: caller is not the owner"
          );
        });
      });
      describe("Execute", function () {
        it("Execute success", async function () {
          const { ido } = await loadFixture(deployIDO);
          const maxAllocation = BigInt(2000 * 10 ** 18);
          await ido.setMaxPurchaseAmount(maxAllocation)
          expect(await ido.maxAllocation()).to.equal(maxAllocation);
        });
      });
  });
    
  describe("SetTokenEthRate", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        const setTokenEthRate = 10000;
        // We use ido.connect() to send a transaction from another account
        await expect(ido.connect(otherAccount).setTokenEthRate(1,setTokenEthRate)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
    describe("Execute", function () {
      it("Execute success", async function () {
        const { ido } = await loadFixture(deployIDO);
        const setTokenEthRate = "20000";
        await ido.setTokenEthRate(1,setTokenEthRate)
        expect(await ido.tokenEthRate(1)).to.equal(setTokenEthRate);
      });
    });
  });
    
  describe("SetToken", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { ido, otherAccount ,absc } = await loadFixture(deployIDO);
        // We use ido.connect() to send a transaction from another account
        await expect(ido.connect(otherAccount).setToken(absc.target)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
    describe("Execute", function () {
      it("Execute success", async function () {
        const { ido } = await loadFixture(deployIDO);
        const tokenAddress = "0xf03cf9c34772f6c533b4ad3fe50d3d079e558264";
        await ido.setToken(tokenAddress)
        expect((await ido.token()).toLowerCase()).to.equal(tokenAddress);
      });
    });
  });

  describe("Open", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        // We use ido.connect() to send a transaction from another account
        await expect(ido.connect(otherAccount).open()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
    describe("Execute", function () {
      it("Execute success", async function () {
        const { ido } = await loadFixture(deployIDO);
        await ido.open();
        expect(await ido.whileOpened()).to.equal(true);
      });
    });
  });

  describe("Unopen", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        // We use ido.connect() to send a transaction from another account
        await expect(ido.connect(otherAccount).unopen()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
    describe("Execute", function () {
      it("Execute success", async function () {
        const { ido } = await loadFixture(deployIDO);
        await ido.open();
        await ido.unopen();
        expect(await ido.whileOpened()).to.equal(false);
      });
    });
  });
  describe("Release", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        // We use ido.connect() to send a transaction from another account
        await expect(ido.connect(otherAccount).release()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
    describe("Execute", function () {
      it("Execute success", async function () {
        const { ido } = await loadFixture(deployIDO);
        await ido.release();
        expect(await ido.whileReleased()).to.equal(true);
      });
    });
  });

  describe("Unrelease", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        // We use ido.connect() to send a transaction from another account
        await expect(ido.connect(otherAccount).unrelease()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
    describe("Execute", function () {
      it("Execute success", async function () {
        const { ido } = await loadFixture(deployIDO);
        await ido.release();
        await ido.unrelease();
        expect(await ido.whileReleased()).to.equal(false);
      });
    });
  });

  describe("Purchase", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from when not opened", async function () {
        const { ido } = await loadFixture(deployIDO);
        const value = ethers.parseEther("1");
        await expect(ido.purchase({value:value})).to.be.revertedWith(
          "WhileOpen: not opened"
        );
      });
      it("Should revert with the right error if called from when amount < minAllocation", async function () {
        const { ido } = await loadFixture(deployIDO);
        const value = ethers.parseEther("0.1");
        await ido.open();
        await expect(ido.purchase({value:value})).to.be.revertedWith(
          "Below minimum purchase amount"
        );
      });
      it("Should revert with the right error if called from when amount > maxAllocation", async function () {
        const { ido } = await loadFixture(deployIDO);
        const value = ethers.parseEther("20000");
        await ido.open();
        await expect(ido.purchase({value:value})).to.be.revertedWith(
          "Exceeds maximum purchase amount"
        );
      });
    });
    describe("Execute", function () {
      it("Should emit an event on PurchaseCompleted", async function () {
         const { ido,owner,stage} = await loadFixture(deployIDO);
        const value = ethers.parseEther("6000");
        await ido.open();
        await expect(ido.purchase({ value: value }))
          .to.emit(ido, "PurchaseCompleted")
          .withArgs(owner.address,stage, value); 
      });
      it("Should allocations[owner] == value1 + value2", async function () {
        const { ido,owner,stage} = await loadFixture(deployIDO);
        const value1 = ethers.parseEther("2000");
        const value2 = ethers.parseEther("3000");
        await ido.open();
        await ido.purchase({ value: value1 });
        await ido.purchase({ value: value2 });
        expect(await ido.allocations(stage,owner.address)).to.equal(value1 + value2); 
      });
      it("Should IDO eth balance == value1 + value2", async function () {
        const { ido,owner} = await loadFixture(deployIDO);
        const value1 = ethers.parseEther("2000");
        const value2 = ethers.parseEther("3000");
        await ido.open();
        await expect(ido.purchase({ value: value1 })).to.changeEtherBalances(
          [owner, ido],
          [ -value1, value1]
        );
        await expect(ido.purchase({ value: value2 })).to.changeEtherBalances(
          [owner, ido],
          [ -value2, value2]
        );
      });
    });
  });

  describe("Claim", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from when not released", async function () {
        const { ido,otherAccount } = await loadFixture(deployIDO);
         await expect(ido.connect(otherAccount).claim()).to.be.revertedWith(
          "WhileRelease: not released"
        );
      });
      it("Should revert with the right error if called from when claimAmount <= 0 ", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        await ido.release();
        await expect(ido.connect(otherAccount).claim()).to.be.revertedWith(
          "You have no right to claim"
        );
      });
      it("Should revert with the right error if called from when contract Insufficient tokens", async function () {
        const { ido,otherAccount } = await loadFixture(deployIDO);
        const value = ethers.parseEther("2000");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await ido.release();
        await expect(ido.connect(otherAccount).claim()).to.be.revertedWith(
          "Insufficient tokens in the contract"
        );
      });
    });
    describe("Execute", function () {
      it("Should emit an event on TokensClaimed", async function () {
        const { ido, absc,otherAccount ,stage} = await loadFixture(deployIDO);
        const value = ethers.parseEther("1");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await absc.transfer(ido.target, ethers.parseEther("4000000"));
        await ido.release();
        const tokenEthRate = await ido.tokenEthRate(stage)
        const claimAmount = value * BigInt(tokenEthRate) / BigInt(100);
        await expect(ido.connect(otherAccount).claim())
          .to.emit(ido, "TokensClaimed")
          .withArgs(otherAccount.address, claimAmount); 
      });
      it("Should transfer the funds to the user", async function () {
        const { ido, absc,otherAccount,stage } = await loadFixture(deployIDO);
        const value = ethers.parseEther("1");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await absc.transfer(ido.target, ethers.parseEther("4000000"));
        await ido.release();
        const tokenEthRate = await ido.tokenEthRate(stage)
        const claimAmount = value * BigInt(tokenEthRate) / BigInt(100);
        await expect(ido.connect(otherAccount).claim()).to.changeTokenBalances(
          absc,
          [otherAccount, ido],
          [ claimAmount, -claimAmount]
        );
      });

      it("Should transfer the funds to the user diff stage", async function () {
        const { ido, absc,otherAccount,tokenEthRate1,tokenEthRate2,tokenEthRate3 } = await loadFixture(deployIDO);
        const value = ethers.parseEther("1");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await ido.setStage(2);
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await ido.setStage(3);
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await absc.transfer(ido.target, ethers.parseEther("4000000"));
        await ido.release();
        const claimAmount = value * BigInt(tokenEthRate1) / BigInt(100)
          + value * BigInt(tokenEthRate2) / BigInt(100)
          + value * BigInt(tokenEthRate3) / BigInt(100);
        await expect(ido.connect(otherAccount).claim()).to.changeTokenBalances(
          absc,
          [otherAccount, ido],
          [ claimAmount, -claimAmount]
        );
      });
    });
  });


  describe("GetTokensBalance", function () {
    it("Should transfer the amount to the IDO", async function () {
      const { ido, absc, owner } = await loadFixture(deployIDO);
      const etherValue = ethers.parseEther("500000");
      await absc.transfer(ido.target, etherValue);
      await expect(absc.transfer(ido.target, ethers.parseEther("500000"))).to.changeTokenBalances(
        absc,
        [owner, ido],
        [ -etherValue, etherValue]
      );
    });
    it("Should transfer the amount to the IDO", async function () {
      const { ido, absc, owner } = await loadFixture(deployIDO);
      const etherValue = ethers.parseEther("500000");
      await absc.transfer(ido.target, etherValue);
      expect(await ido.getTokensBalance()).to.equal(etherValue);
    });
  });

  describe("WithdrawEth", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        // We use ido.connect() to send a transaction from another account
        await expect(ido.connect(otherAccount).withdrawEth(otherAccount)).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
    describe("Execute", function () {
      it("Execute success", async function () {
        const { ido,owner,otherAccount } = await loadFixture(deployIDO);
        const value = ethers.parseEther("2000");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        expect(await ido.withdrawEth(otherAccount)).to.changeEtherBalances(
          [otherAccount, ido],
          [ value, -value]
        );
      });
    });
  });

  describe("WithdrawTokens", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from another account", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        // We use ido.connect() to send a transaction from another account
        await expect(ido.connect(otherAccount).withdrawTokens()).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
      });
    });
    describe("Execute", function () {
      it("Execute success", async function () {
        const { ido, absc, owner, otherAccount,stage } = await loadFixture(deployIDO);
        const value = ethers.parseEther("1");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        const tokenValue = ethers.parseEther("500000");
        await absc.transfer(ido.target, tokenValue);
        await ido.release();
        await ido.connect(otherAccount).claim();
        const erc20Amount = await ido.totalErc20Amount(stage)
        const changeValue = tokenValue - erc20Amount;
        await expect(ido.withdrawTokens()).to.changeTokenBalances(
          absc,
          [owner, ido],
          [ changeValue, -changeValue]
        );
      });
    });
  });


  describe("Withdraw", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called from when not released", async function () {
        const { ido,otherAccount } = await loadFixture(deployIDO);
         await expect(ido.connect(otherAccount).withdraw()).to.be.revertedWith(
          "WhileWithdraw: not withdraw"
        );
      });
      it("Should revert with the right error if called from when withdrawAmount <= 0 ", async function () {
        const { ido, otherAccount } = await loadFixture(deployIDO);
        await ido.setWithdraw();
        await expect(ido.connect(otherAccount).withdraw()).to.be.revertedWith(
          "No withdrawable amount available"
        );
      });
      it("Should revert with the right error if called from when You have completed the claim", async function () {
        const { ido,otherAccount,absc } = await loadFixture(deployIDO);
        const value = ethers.parseEther("1");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await absc.transfer(ido.target, ethers.parseEther("4000000"));
        await ido.release();
        await ido.connect(otherAccount).claim()
        await ido.setWithdraw();
        await expect(ido.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You have completed the claim"
        );
      });

      it("Should revert with the right error if called from when withdrawAmount <= 0", async function () {
        const { ido,otherAccount,absc } = await loadFixture(deployIDO);
        const value = ethers.parseEther("2000");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await absc.transfer(ido.target, ethers.parseEther("4000000"));
        await ido.setWithdraw();
        await ido.connect(otherAccount).withdraw();
        await expect(ido.connect(otherAccount).withdraw()).to.be.revertedWith(
          "No withdrawable amount available"
        );
      });
      it("Should revert with the right error if called from when insufficient balance in the contract", async function () {
        const { ido,owner,otherAccount,absc } = await loadFixture(deployIDO);
        const value = ethers.parseEther("2000");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await absc.transfer(ido.target, ethers.parseEther("4000000"));
        await ido.withdrawEth(owner);
        await ido.setWithdraw();
        await expect(ido.connect(otherAccount).withdraw()).to.be.revertedWith(
          "Insufficient balance in the contract"
        );
      });
    });
    describe("Execute", function () {
      it("Should emit an event on WithdrawCompleted", async function () {
        const { ido,otherAccount } = await loadFixture(deployIDO);
        const value = ethers.parseEther("1");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await ido.setWithdraw();
        await expect(ido.connect(otherAccount).withdraw())
          .to.emit(ido, "WithdrawCompleted")
          .withArgs(otherAccount.address, value); 
      });
      it("Should transfer the funds to the user diff stage", async function () {
        const { ido, absc, otherAccount, stage } = await loadFixture(deployIDO);
        const value = ethers.parseEther("1");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value });
        await ido.unopen();
        await ido.setStage(2);
        const value1 = ethers.parseEther("2");
        await ido.open();
        await ido.connect(otherAccount).purchase({ value: value1 });
        await ido.unopen();
        await ido.setWithdraw();
        await expect(ido.connect(otherAccount).withdraw()).to.changeEtherBalances(
          [otherAccount, ido],
          [value + value1, -(value + value1)]
        );
      });
    });
  });
});
