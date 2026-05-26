#!/bin/bash

echo "Down the network"
./network.sh down

echo "Up the network and creating the channel with ca"

./network.sh up createChannel -ca

echo "Deploying ChainCode with goLang"

./network.sh deployCC -ccn basic -ccp ../chaincode -ccl go