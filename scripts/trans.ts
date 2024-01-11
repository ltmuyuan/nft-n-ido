import * as fs from 'fs';
import { ethers  } from 'ethers';

const provider = new ethers.JsonRpcProvider('https://bsc-testnet.publicnode.com');
const privateKey = 'xxxxxxxxxx';
const wallet = new ethers.Wallet(privateKey, provider);

const contractAddress = '0xdAB9e6979B96D760081bB8f4F33ad3c623AB551F';
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "name_",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "symbol_",
                "type": "string"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "approved",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "ApprovalForAll",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_fromTokenId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_toTokenId",
                "type": "uint256"
            }
        ],
        "name": "BatchMetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_tokenId",
                "type": "uint256"
            }
        ],
        "name": "MetadataUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "getApproved",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            }
        ],
        "name": "isApprovedForAll",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "ownerOf",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "uri",
                "type": "string"
            }
        ],
        "name": "safeMint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
            }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "approved",
                "type": "bool"
            }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "tokenByIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "tokenOfOwnerByIndex",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

const ownerAddress = "0x0108308Cc98f24545105972B2C865980e162Eb2D"

interface AddressData {
    address: string;
    tokenIds: number[];
}

async function transaction(num:number,jsonPath6:string,jsonPath40:string,jsonPath150:string) {
    const jsonContent6: string = fs.readFileSync(jsonPath6, 'utf-8');
    const jsonContent40: string = fs.readFileSync(jsonPath40, 'utf-8');
    const jsonContent150: string = fs.readFileSync(jsonPath150, 'utf-8');
    const jsonData6: AddressData[] = JSON.parse(jsonContent6);
    const jsonData40: AddressData[] = JSON.parse(jsonContent40);
    const jsonData150: AddressData[] = JSON.parse(jsonContent150);
    // const errJsonPath6 = "/Users/sunjianguo/Desktop/nft-address/error6data-" + num + ".json"
    // const errJsonPath40 = "/Users/sunjianguo/Desktop/nft-address/error40data-" + num + ".json"
    // const errJsonPath150 = "/Users/sunjianguo/Desktop/nft-address/error150data-" + num + ".json"
    const errJsonPath6 = "/Users/sunjianguo/Desktop/address/error6data-" + num + ".json"
    const errJsonPath40 = "/Users/sunjianguo/Desktop/address/error40data-" + num + ".json"
    const errJsonPath150 = "/Users/sunjianguo/Desktop/address/error150data-" + num + ".json"
    const successPath6 = "/Users/sunjianguo/Desktop/address/success6data-" + num + ".json"
    const successPath40 = "/Users/sunjianguo/Desktop/address/success40data-" + num + ".json"
    const successPath150 = "/Users/sunjianguo/Desktop/address/success150data-" + num + ".json"
    let errData6:AddressData[] = []
    let errData40:AddressData[] = []
    let errData150:AddressData[] = []
    let successData6:AddressData[] = []
    let successData40:AddressData[] = []
    let successData150:AddressData[] = []
    for (let i = 0; i < jsonData6.length; i++) {
        let data:AddressData = {
            address: "",
            tokenIds: []
        }
        let successData:AddressData = {
            address: "",
            tokenIds: []
        }
        data.address = jsonData6[i].address
        successData.address = jsonData6[i].address
        for (let j = 0; j < jsonData6[i].tokenIds.length; j++) {
            try {
                let params = [ownerAddress,jsonData6[i].address,jsonData6[i].tokenIds[j]]
                const result = await contract['safeTransferFrom'](...params);
                successData.tokenIds.push(jsonData6[i].tokenIds[j])
                console.info("address: %s, tokenId: %d 交易完成",jsonData6[i].address,jsonData6[i].tokenIds[j])
            } catch (e) {
                data.tokenIds.push(jsonData6[i].tokenIds[j])
                console.error("address: %s, tokenId: %d的数据失败了",jsonData6[i].address,jsonData6[i].tokenIds[j])
            }
        }
        successData6.push(successData)
        if (data.tokenIds.length > 0) {
            errData6.push(data)
        }
    }
    for (let i = 0; i < jsonData40.length; i++) {
        let data:AddressData = {
            address: "",
            tokenIds: []
        }
        let successData:AddressData = {
            address: "",
            tokenIds: []
        }
        successData.address = jsonData40[i].address
        data.address = jsonData40[i].address
        for (let j = 0; j < jsonData40[i].tokenIds.length; j++) {
            try {
                let params = [ownerAddress,jsonData40[i].address,jsonData40[i].tokenIds[j]]
                const result = await contract['safeTransferFrom'](...params);
                successData.tokenIds.push(jsonData40[i].tokenIds[j])
                console.info("address: %s, tokenId: %d 交易完成",jsonData40[i].address,jsonData40[i].tokenIds[j])
            } catch (e) {
                console.error("address: %s, tokenId: %d的数据失败了",jsonData40[i].address,jsonData40[i].tokenIds[j])
                data.tokenIds.push(jsonData40[i].tokenIds[j])
            }
        }
        successData40.push(successData)
        if (data.tokenIds.length > 0) {
            errData40.push(data)
        }
    }
    for (let i = 0; i < jsonData150.length; i++) {
        let data:AddressData = {
            address: "",
            tokenIds: []
        }
        let successData:AddressData = {
            address: "",
            tokenIds: []
        }
        successData.address = jsonData150[i].address
        data.address = jsonData150[i].address
        for (let j = 0; j < jsonData150[i].tokenIds.length; j++) {
            try {
                let params = [ownerAddress,jsonData150[i].address,jsonData150[i].tokenIds[j]]
                const result = await contract['safeTransferFrom'](...params);
                successData.tokenIds.push(jsonData150[i].tokenIds[j])
                console.info("address: %s, tokenId: %d 交易完成",jsonData150[i].address,jsonData150[i].tokenIds[j])
            } catch (e) {
                console.error("address: %s, tokenId: %d的数据失败了",jsonData150[i].address,jsonData150[i].tokenIds[j])
                data.tokenIds.push(jsonData150[i].tokenIds[j])
            }
        }
        successData150.push(successData)
        if (data.tokenIds.length > 0) {
            errData150.push(data)
        }
    }
    const errJsonContent6: string = JSON.stringify(errData6, null, 2);
    const errJsonContent40: string = JSON.stringify(errData40, null, 2);
    const errJsonContent150: string = JSON.stringify(errData150, null, 2);
    fs.writeFileSync(errJsonPath6, errJsonContent6, 'utf-8');
    fs.writeFileSync(errJsonPath40, errJsonContent40, 'utf-8');
    fs.writeFileSync(errJsonPath150, errJsonContent150, 'utf-8');

    const successContent6: string = JSON.stringify(successData6, null, 2);
    const successContent40: string = JSON.stringify(successData40, null, 2);
    const successContent150: string = JSON.stringify(successData150, null, 2);
    fs.writeFileSync(successPath6, successContent6, 'utf-8');
    fs.writeFileSync(successPath40, successContent40, 'utf-8');
    fs.writeFileSync(successPath150, successContent150, 'utf-8');
}
// const jsonPath6 = "/Users/sunjianguo/Desktop/nft-address/address6Data.json"
// const jsonPath40 = "/Users/sunjianguo/Desktop/nft-address/address40Data.json"
// const jsonPath150 = "/Users/sunjianguo/Desktop/nft-address/address150Data.json"

const jsonPath6 = "/Users/sunjianguo/Desktop/address/address6Data.json"
const jsonPath40 = "/Users/sunjianguo/Desktop/address/address40Data.json"
const jsonPath150 = "/Users/sunjianguo/Desktop/address/address150Data.json"
transaction(1,jsonPath6,jsonPath40,jsonPath150)
function haveCommonElements(arr1: any[], arr2: any[], arr3: any[]): boolean {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const set3 = new Set(arr3);

    // 检查是否有交集
    const hasIntersection = [...set1].some(element => set2.has(element) && set3.has(element));

    return hasIntersection;
}

function start() {
    const errJsonPath6 = "/Users/sunjianguo/Desktop/nft-address/error6data-" + 2 + ".json"
    console.log(errJsonPath6);
    const content = "Hello World"
    fs.writeFileSync(errJsonPath6, content, { flag: 'w', encoding: 'utf-8' })
}