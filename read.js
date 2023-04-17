const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const fs = require('fs');

const provider = new HDWalletProvider(
    'evoke abuse cigar skate stay mercy avocado dilemma mass token spider napkin',
    'https://sepolia.infura.io/v3/2af035557b3b4dcd9f3278edb7eb7453'
);

const web3 = new Web3(provider);

const contract = new web3.eth.Contract(JSON.parse(interface),
    "0xA50A6a8e727F9c195841a9E0FE788BE559b9c422");


let noOfIterations = 5;
let sumAll = 0;
let sumLast = 0;


async function readAll() {
    var startTime = performance.now();
    const events = await contract.getPastEvents('allEvents', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    var endTime = performance.now();
    const totalTime = (endTime - startTime);
    console.log("RA Read time: " + totalTime);
    sumAll += totalTime;
    console.log(events);
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
    console.log(latestEvent); 
    
    const jsonString = JSON.stringify(latestEvent);


    const obj = JSON.parse(jsonString);


    const arr = [obj];


    console.log(arr[0].returnValues.state);



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


readLast();





