const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');


const provider = new HDWalletProvider(
    'evoke abuse cigar skate stay mercy avocado dilemma mass token spider napkin',
    'https://sepolia.infura.io/v3/2af035557b3b4dcd9f3278edb7eb7453'
);

const web3 = new Web3(provider);

const contract = new web3.eth.Contract(JSON.parse(interface),
    "0x26A54A241EA598616D332993354A61E8D45C708F");


let noOfIterations = 5;
let sumAll = 0;
let sumLast = 0;


async function readAll() {
    var startTime = performance.now();
    const events = await contract.getPastEvents('AddressChanged', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    var endTime = performance.now();
    const totalTime = (endTime - startTime);
    console.log("RA Read time: " + totalTime);
    sumAll += totalTime;
}

async function readLast() {
    var startTime = performance.now();
    const events = await contract.getPastEvents('allEvents', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    const latestEvent = events[events.length - 1];
    var endTime = performance.now();
    const totalTime = (endTime - startTime);
    console.log("RL Read time: " + totalTime);
    sumLast += totalTime;


}


async function testAll() {
    for (let i = 0; i < noOfIterations; i++) {
        console.log("****************************");
        await readAll();
        console.log("****************************");
    }
}

async function testLast() {
    for (let i = 0; i < noOfIterations; i++) {
        console.log("****************************");
        await readLast();
        console.log("****************************");
    }

}

async function test() {
    await testAll();
    await testLast();
    console.log(`Read All avg: ${(sumAll / noOfIterations)} Read Last avg: ${(sumLast / noOfIterations)}`);
    process.exit();
}


test();





