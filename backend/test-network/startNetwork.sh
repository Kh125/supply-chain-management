#!/bin/bash

echo "Down the network"
./network.sh down

echo "Up the network and creating the channel with ca"

./network.sh up createChannel -ca

echo "Deploying ChainCode with goLang"

./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-go -ccl go


# echo "Exporting variables for org1"

# export CORE_PEER_TLS_ENABLED=true
# export CORE_PEER_LOCALMSPID="Org1MSP"
# export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
# export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
# export CORE_PEER_ADDRESS=localhost:7051

# echo "Exporting paths"

# export PATH=${PWD}/../bin:$PATH
# export FABRIC_CFG_PATH=$PWD/../config/

# echo "Finished all the steps"