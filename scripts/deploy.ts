import { ethers }  from "hardhat";
import { parseUnits }  from "ethers";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  // const ABSCToken = await ethers.getContractFactory("ABSCToken");
  // const tokenAmount = 1e9;
  // const tokenDecimals = 18;
  // const total = parseUnits(tokenAmount.toString(),tokenDecimals)
  // const ABSCTokenContract = await ABSCToken.deploy("ABSC Token", "ABSC", total);
  // const ABSCTokenContractAddr = await ABSCTokenContract.getAddress()
  // console.log("ABSCToken  Contract address:", ABSCTokenContractAddr);
  const MemberNft = await ethers.getContractFactory("ABSCNft");
  const MemberNftContract = await MemberNft.deploy("ABSC NFT","ABSC")
  const MemberNftContractAddr =  await MemberNftContract.getAddress()

  console.log("MemberNft  Contract address:", MemberNftContractAddr);

}



// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
