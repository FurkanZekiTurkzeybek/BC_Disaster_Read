const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

const fs = require('fs');

const provider = new HDWalletProvider(
    'evoke abuse cigar skate stay mercy avocado dilemma mass token spider napkin',
    'https://sepolia.infura.io/v3/2af035557b3b4dcd9f3278edb7eb7453'
);

const web3 = new Web3(provider);


const fetchFB = require("./fetchFB");

const express = require('express');
const {urlencoded, json} = require("express");
const app = express();
const port = 3000;
app.use(urlencoded({extend: true}));
app.use(json());
app.post("/read", (req, res) => {
    let {statusType} = req.body;
    // console.log(`Recieved the number ` + statusType);
    fs.writeFile('output.json', '[]', 'utf8', (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    readLast(statusType).then(returnedPerson => {
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


async function readLast(stateIndicator) {


    let fetchedHashes = await fetchFB.fetchHashes();
    var desiredState = "not assigned right now";


    switch (stateIndicator) {
        case "1":
            desiredState = "wreck";
            break;
        case "2":
            desiredState = "help";
            break;
        case "3":
            desiredState = "safe";
            break;
    }
    for (let i = 0; i < fetchedHashes.length; i++) {
        const contract = new web3.eth.Contract(JSON.parse(interface),
            fetchedHashes[i].toString());
        const events = await contract.getPastEvents('allEvents', {
            fromBlock: 0,
            toBlock: 'latest'
        });

        // Converting the event to an object
        const latestEvent = events[events.length - 1];

        // var latestEvent;
        // var eventFound = false;
        // var index = 1;
        //
        // while (eventFound === false && index <= events.length) {
        //     if (events[events.length - index].returnValues.state !== desiredState) {
        //         index++;
        //     } else {
        //         latestEvent = events[events.length - index];
        //         eventFound = true;
        //     }
        // }


        // if (latestEvent.returnValues.state !== desiredState) {
        //     for(let i= 0; )
        // }


        const jsonString = JSON.stringify(latestEvent);
        const eventObj = JSON.parse(jsonString);

        const stateArr = [eventObj];
        const latestState = stateArr[0];

        console.log(latestState.returnValues.state);

        if (desiredState === latestState.returnValues.state) {
            const name = await contract.methods.getName().call();
            const surname = await contract.methods.getSurname().call();
            const address = await contract.methods.getHomeAddress().call();
            const person = {"name": name, "surname": surname, "address": address};
            const output = {
                latestState: latestState.returnValues.state,
                name: person.name,
                surname: person.surname,
                address: person.address
            };
            // const jsonData = JSON.stringify(output, null, 2);

            // Write the JSON string to a file synchronously
            // fs.writeFileSync('output.json', jsonData, 'utf8');

            fs.readFile("output.json", "utf-8", (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                try {
                    const jsonData = JSON.parse(data);
                    jsonData.push(output);
                    const updatedJsondata = JSON.stringify(jsonData, null, 2);

                    fs.writeFile("output.json", updatedJsondata, "utf-8",
                        (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log("data added to json.");
                        });
                } catch (error) {
                    console.error('Error parsing JSON data:', error);

                }
            })
        }
    }


}

