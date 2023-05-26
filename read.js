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

const express = require('express');
const {urlencoded, json} = require("express");
const app = express();
const port = 3000;
app.use(urlencoded({extend: true}));
app.use(json());
app.post("/read", (req, res) => {
    let {statusType} = req.body;
    console.log(`Recieved the number ` + statusType);

    readLast().then(returnedPerson => {
        res.send(returnedPerson);
    });
});

app.listen(port, () => {
    console.log("Server is listening");
})

async function readAll() {
    const events = await contract.getPastEvents('allEvents', {
        fromBlock: 0,
        toBlock: 'latest'
    });
    console.log(events);

    for (var x = 0; x < events.length; x++) {
        const jsonString = JSON.stringify(events[x]);


        const obj = JSON.parse(jsonString);


        const arr = [obj];

        for (var i = 0; i < arr.length; i++) {
            console.log(arr[i].returnValues.state);
        }
    }


}


// async function readLast() {
//     const events = await contract.getPastEvents('allEvents', {
//         fromBlock: 0,
//         toBlock: 'latest'
//     });
//
//     //converting the event to an object.
//     const latestEvent = events[events.length - 1];
//     const jsonString = JSON.stringify(latestEvent);
//     const eventObj = JSON.parse(jsonString);
//
//     const stateArr = [eventObj];
//     const latestState = stateArr[0];
//
//
//     console.log(latestState.returnValues.state);
//
//     const name = await contract.methods.getName().call();
//
//     return await returnPerson();
// }
//
// async function returnPerson() {
//     const name = await contract.methods.getName().call();
//     const surname = await contract.methods.getSurname().call();
//     const address = await contract.methods.getHomeAddress().call();
//
//     return {"name": name, "surname": surname, "address": address};
// }

async function readLast() {
    const events = await contract.getPastEvents('allEvents', {
        fromBlock: 0,
        toBlock: 'latest'
    });

    // Converting the event to an object
    const latestEvent = events[events.length - 1];
    const jsonString = JSON.stringify(latestEvent);
    const eventObj = JSON.parse(jsonString);

    const stateArr = [eventObj];
    const latestState = stateArr[0];

    console.log(latestState.returnValues.state);

    const name = await contract.methods.getName().call();

    const person = await returnPerson();

    const output = [{
        latestState: latestState.returnValues.state,
        name: person.name,
        surname: person.surname,
        address: person.address
    }];

    const jsonData = JSON.stringify(output, null, 2);

    // Write the JSON string to a file synchronously
    fs.writeFileSync('output.json', jsonData, 'utf8');

    console.log('Output written to JSON file successfully!');
}

async function returnPerson() {
    const name = await contract.methods.getName().call();
    const surname = await contract.methods.getSurname().call();
    const address = await contract.methods.getHomeAddress().call();

    return {"name": name, "surname": surname, "address": address};
}







