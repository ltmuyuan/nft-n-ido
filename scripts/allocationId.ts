import * as fs from 'fs';


interface AddressData {
    address: string;
    tokenIds: number[];
}

let tokenIds = initTokenIds()
const tokenIds300 = getRandomTokenIds(tokenIds,300)
const tokenIds400 = getRandomTokenIds(tokenIds,400)
const tokenIds170 = getRandomTokenIds(tokenIds,170)

function initTokenIds() {
    let tokenIds: number[] = []
    for (let i = 87; i < 94; i++) {
        tokenIds.push(i)
    }
    for (let i = 361; i < 394; i++) {
        tokenIds.push(i)
    }

    for (let i = 835; i < 894; i++) {
        tokenIds.push(i)
    }
    for (let i = 1770; i < 1894; i++) {
        tokenIds.push(i)
    }

    for (let i = 3640; i < 3894; i++) {
        tokenIds.push(i)
    }
    for (let i = 7284; i < 7677; i++) {
        tokenIds.push(i)
    }
    return tokenIds
    console.log(tokenIds.length)
}

function allocationTokenIds() {

}

function allocation6TokenIds() {
    // const filePath = "/Users/sunjianguo/Desktop/nft-address/6-address.txt"
    const filePath = "/Users/sunjianguo/Desktop/address/6-address.txt"
    // const jsonPath = "/Users/sunjianguo/Desktop/nft-address/address6Data.json"
    const jsonPath = "/Users/sunjianguo/Desktop/address/address6Data.json"
    const fileContent: string = fs.readFileSync(filePath, 'utf-8');
    const addresses: string[] = fileContent.split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
    const distributedData: any[] = distributeRandomly(tokenIds300, addresses.length);
    let addressData: AddressData[] = []
    for (let i = 0; i < addresses.length; i++) {
        let data:AddressData = {
            address: addresses[i],
            tokenIds: distributedData[i]
        }
        addressData.push(data)
    }
    const jsonData: string = JSON.stringify(addressData, null, 2);
    // fs.writeFileSync(jsonPath, jsonData, 'utf-8');
    fs.writeFileSync(jsonPath, jsonData, { flag: 'w', encoding: 'utf-8' })
    console.log(`Data successfully written to ${jsonPath}`);
}

function allocation40TokenIds() {
    // const filePath = "/Users/sunjianguo/Desktop/nft-address/40-address.txt"
    // const jsonPath = "/Users/sunjianguo/Desktop/nft-address/address40Data.json"
    const filePath = "/Users/sunjianguo/Desktop/address/40-address.txt"
    const jsonPath = "/Users/sunjianguo/Desktop/address/address40Data.json"
    const fileContent: string = fs.readFileSync(filePath, 'utf-8');
    const addresses: string[] = fileContent.split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
    const distributedData: any[] = distributeRandomly(tokenIds400, addresses.length);
    let addressData: AddressData[] = []
    for (let i = 0; i < addresses.length; i++) {
        let data:AddressData = {
            address: addresses[i],
            tokenIds: distributedData[i]
        }
        addressData.push(data)
    }
    const jsonData: string = JSON.stringify(addressData, null, 2);
    // fs.writeFileSync(jsonPath, jsonData, 'utf-8');
    fs.writeFileSync(jsonPath, jsonData, { flag: 'w', encoding: 'utf-8' })
    console.log(`Data successfully written to ${jsonPath}`);
}

function allocation150TokenIds() {
    // const filePath = "/Users/sunjianguo/Desktop/nft-address/150-address.txt"
    // const jsonPath = "/Users/sunjianguo/Desktop/nft-address/address150Data.json"
    const filePath = "/Users/sunjianguo/Desktop/address/150-address.txt"
    const jsonPath = "/Users/sunjianguo/Desktop/address/address150Data.json"
    const fileContent: string = fs.readFileSync(filePath, 'utf-8');
    const addresses: string[] = fileContent.split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

    const distributedData: any[] = distributeRandomly(tokenIds170, addresses.length);
    let addressData: AddressData[] = []
    for (let i = 0; i < addresses.length; i++) {
        let data:AddressData = {
            address: addresses[i],
            tokenIds: distributedData[i]
        }
        addressData.push(data)
    }
    const jsonData: string = JSON.stringify(addressData, null, 2);
    // fs.writeFileSync(jsonPath, jsonData, 'utf-8');
    fs.writeFileSync(jsonPath, jsonData, { flag: 'w', encoding: 'utf-8' })
    console.log(`Data successfully written to ${jsonPath}`);
}


function getRandomTokenIds(originalArray: number[], count: number): number[] {
    if (count > originalArray.length) {
        console.error("Cannot extract more elements than the original array contains.");
        return [];
    }

    const resultArray: number[] = [];

    for (let i = 0; i < count; i++) {
        const randomIndex: number = Math.floor(Math.random() * originalArray.length);
        const randomElement: number = originalArray.splice(randomIndex, 1)[0];
        resultArray.push(randomElement);
    }
    return resultArray;
}

function distributeRandomly(sourceArray: any[], numberOfPeople: number): any[] {
    const resultArrays: any[] = new Array(numberOfPeople).fill(null).map(() => []);

    for (let i = 0; i < sourceArray.length; i++) {
        const randomPersonIndex = Math.floor(Math.random() * numberOfPeople);

        resultArrays[randomPersonIndex].push(sourceArray[i]);
    }

    return resultArrays;
}

function start() {
    allocation6TokenIds()
    allocation40TokenIds()
    allocation150TokenIds()
    let dd = haveCommonElements(tokenIds300,tokenIds400,tokenIds170)
    console.log(dd);
}
//校验是否有重
function haveCommonElements(arr1: any[], arr2: any[], arr3: any[]): boolean {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const set3 = new Set(arr3);

    // 检查是否有交集
    const hasIntersection = [...set1].some(element => set2.has(element) && set3.has(element));

    return hasIntersection;
}
start()