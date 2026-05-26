#!/bin/bash

C_RESET='\033[0m'
C_RED='\033[0;31m'
C_GREEN='\033[0;32m'
C_BLUE='\033[0;34m'
C_YELLOW='\033[1;33m'

function printHelp() {
  println "Usage: network.sh <up|down|deployCC|restart> [flags]"
  println "       network.sh up createChannel [-ca]"
  println ""
  println "  up              Start peers and orderer (Fabric CA)"
  println "  up createChannel  Start network and create channel mychannel"
  println "  down            Stop network and remove generated artifacts"
  println "  deployCC        Deploy chaincode (see network.config)"
  println "  restart         down then up"
  println ""
  println "Flags: -ca (default), -c channel, -ccn -ccp -ccl -ccv -ccs, -r -d -verbose"
  println "Config: network.config"
}

function println() {
  echo -e "$1"
}

function errorln() {
  println "${C_RED}${1}${C_RESET}"
}

function successln() {
  println "${C_GREEN}${1}${C_RESET}"
}

function infoln() {
  println "${C_BLUE}${1}${C_RESET}"
}

function warnln() {
  println "${C_YELLOW}${1}${C_RESET}"
}

function fatalln() {
  errorln "$1"
  exit 1
}

export -f errorln successln infoln warnln fatalln
