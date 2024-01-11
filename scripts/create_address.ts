import { ethers } from 'ethers';
import * as fs from 'fs';

async function generateAccounts(numAccounts: number, outputFile: string,addressPath:string): Promise<void> {
    let accountsString = '';
    let addressesString = '';

    for (let i = 0; i < numAccounts; i++) {
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address
        const privateKey = wallet.privateKey
        const mnemonic = wallet.mnemonic?.phrase
        const accountString = `Address: ${address}  PrivateKey: ${privateKey}  Mnemonic: ${mnemonic}\n`;
        const addressString = `${address}\n`
        accountsString += accountString;
        addressesString += addressString

        console.log(`Account ${i + 1}:\n${accountString}`);
    }

    // 写入到文件
    fs.writeFileSync(outputFile, accountsString, { flag: 'w', encoding: 'utf-8' })
    fs.writeFileSync(addressPath, addressesString, { flag: 'w', encoding: 'utf-8' })
    // fs.writeFileSync(outputFile, accountsString);
    // fs.writeFileSync(addressPath, addressesString);

    console.log(`Accounts written to ${outputFile}`);
}

const ownerPath = '/Users/sunjianguo/Desktop/address/owner.txt'
const _ownerPath = '/Users/sunjianguo/Desktop/address/owne_address.txt'
const ownerNum = 1

const path6 = '/Users/sunjianguo/Desktop/address/address-6.txt'
const _path6 = '/Users/sunjianguo/Desktop/address/6-address.txt'
const num6 = 6

const path40 = '/Users/sunjianguo/Desktop/address/address-40.txt'
const _path40 = '/Users/sunjianguo/Desktop/address/40-address.txt'
const num40 = 40

const path150 = '/Users/sunjianguo/Desktop/address/address-150.txt'
const _path150 = '/Users/sunjianguo/Desktop/address/150-address.txt'
const num150 = 150


generateAccounts(ownerNum,ownerPath,_ownerPath)
generateAccounts(num6,path6,_path6)
generateAccounts(num40,path40,_path40)
generateAccounts(num150,path150,_path150)

