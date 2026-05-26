#!/bin/bash
# Local Hyperledger Fabric network: Org1 (manufacturer) + Org2 (consumer)

ROOTDIR=$(cd "$(dirname "$0")" && pwd)
export PATH=${ROOTDIR}/../bin:${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/configtx
export VERBOSE=false

pushd "${ROOTDIR}" > /dev/null
trap "popd > /dev/null" EXIT

. scripts/utils.sh
. ./network.config

# Docker socket for chaincode VM (peers mount this into the container)
SOCK="${DOCKER_HOST:-/var/run/docker.sock}"
DOCKER_SOCK="${SOCK##unix://}"
export DOCKER_SOCK

BFT=0
export BFT

: ${CONTAINER_CLI:="docker"}
if command -v ${CONTAINER_CLI}-compose > /dev/null 2>&1; then
  : ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI}-compose"}
else
  : ${CONTAINER_CLI_COMPOSE:="${CONTAINER_CLI} compose"}
fi

COMPOSE_FILE_BASE=compose-test-net.yaml
COMPOSE_FILE_CA=compose-ca.yaml
CRYPTO="Certificate Authorities"

function checkPrereqs() {
  peer version > /dev/null 2>&1
  if [[ $? -ne 0 || ! -d "../config" ]]; then
    fatalln "Install Fabric binaries to backend/bin and backend/config (see backend/scripts/install-fabric.sh)"
  fi
  fabric-ca-client version > /dev/null 2>&1
  if [[ $? -ne 0 ]]; then
    fatalln "fabric-ca-client not found. Run backend/scripts/install-fabric.sh"
  fi
}

function createOrgs() {
  if [ -d "organizations/peerOrganizations" ]; then
    rm -Rf organizations/peerOrganizations organizations/ordererOrganizations
  fi

  infoln "Generating certificates using Fabric CA"
  ${CONTAINER_CLI_COMPOSE} -f compose/${COMPOSE_FILE_CA} -f compose/${CONTAINER_CLI}/${CONTAINER_CLI}-${COMPOSE_FILE_CA} up -d 2>&1
  . organizations/fabric-ca/registerEnroll.sh

  while [ ! -f "organizations/fabric-ca/org1/tls-cert.pem" ]; do sleep 1; done

  createOrg1
  createOrg2
  createOrderer
  ./organizations/ccp-generate.sh
}

function networkUp() {
  checkPrereqs
  if [ ! -d "organizations/peerOrganizations" ]; then
    createOrgs
  fi

  local files="-f compose/${COMPOSE_FILE_BASE} -f compose/${CONTAINER_CLI}/${CONTAINER_CLI}-${COMPOSE_FILE_BASE}"
  DOCKER_SOCK="${DOCKER_SOCK}" ${CONTAINER_CLI_COMPOSE} ${files} up -d 2>&1
  ${CONTAINER_CLI} ps -a
}

function createChannel() {
  if ! ${CONTAINER_CLI} info > /dev/null 2>&1; then
    fatalln "Docker is required to create a channel"
  fi

  local containers=$(${CONTAINER_CLI} ps | grep hyperledger/ | wc -l | tr -d ' ')
  if [[ "${containers}" -lt 4 ]] || [[ ! -d "organizations/peerOrganizations" ]]; then
    networkUp
  fi

  scripts/createChannel.sh "${CHANNEL_NAME}" "${CLI_DELAY}" "${MAX_RETRY}" "${VERBOSE}"
}

function deployCC() {
  scripts/deployCC.sh "${CHANNEL_NAME}" "${CC_NAME}" "${CC_SRC_PATH}" "${CC_SRC_LANGUAGE}" \
    "${CC_VERSION}" "${CC_SEQUENCE}" "${CC_INIT_FCN}" "${CC_END_POLICY}" "${CC_COLL_CONFIG}" \
    "${CLI_DELAY}" "${MAX_RETRY}" "${VERBOSE}"
  if [ $? -ne 0 ]; then
    fatalln "Deploying chaincode failed"
  fi
}

function networkDown() {
  local files="-f compose/${COMPOSE_FILE_BASE} -f compose/${CONTAINER_CLI}/${CONTAINER_CLI}-${COMPOSE_FILE_BASE}"
  local ca="-f compose/${COMPOSE_FILE_CA} -f compose/${CONTAINER_CLI}/${CONTAINER_CLI}-${COMPOSE_FILE_CA}"

  if [ "${CONTAINER_CLI}" == "docker" ]; then
    DOCKER_SOCK="${DOCKER_SOCK}" ${CONTAINER_CLI_COMPOSE} ${files} ${ca} down --volumes --remove-orphans
  else
    ${CONTAINER_CLI_COMPOSE} ${files} ${ca} down --volumes
  fi

  if [ "$MODE" != "restart" ]; then
    ${CONTAINER_CLI} volume rm docker_orderer.example.com docker_peer0.org1.example.com docker_peer0.org2.example.com 2>/dev/null || true
    clearContainers
    removeUnwantedImages
    ${CONTAINER_CLI} run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf system-genesis-block/*.block organizations/peerOrganizations organizations/ordererOrganizations'
    ${CONTAINER_CLI} run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/org1/msp organizations/fabric-ca/org1/tls-cert.pem organizations/fabric-ca/org1/ca-cert.pem organizations/fabric-ca/org1/IssuerPublicKey organizations/fabric-ca/org1/IssuerRevocationPublicKey organizations/fabric-ca/org1/fabric-ca-server.db'
    ${CONTAINER_CLI} run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/org2/msp organizations/fabric-ca/org2/tls-cert.pem organizations/fabric-ca/org2/ca-cert.pem organizations/fabric-ca/org2/IssuerPublicKey organizations/fabric-ca/org2/IssuerRevocationPublicKey organizations/fabric-ca/org2/fabric-ca-server.db'
    ${CONTAINER_CLI} run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf organizations/fabric-ca/ordererOrg/msp organizations/fabric-ca/ordererOrg/tls-cert.pem organizations/fabric-ca/ordererOrg/ca-cert.pem organizations/fabric-ca/ordererOrg/IssuerPublicKey organizations/fabric-ca/ordererOrg/IssuerRevocationPublicKey organizations/fabric-ca/ordererOrg/fabric-ca-server.db'
    ${CONTAINER_CLI} run --rm -v "$(pwd):/data" busybox sh -c 'cd /data && rm -rf channel-artifacts log.txt *.tar.gz'
  fi
}

function clearContainers() {
  ${CONTAINER_CLI} rm -f $(${CONTAINER_CLI} ps -aq --filter label=service=hyperledger-fabric) 2>/dev/null || true
  ${CONTAINER_CLI} rm -f $(${CONTAINER_CLI} ps -aq --filter name='dev-peer*') 2>/dev/null || true
}

function removeUnwantedImages() {
  ${CONTAINER_CLI} image rm -f $(${CONTAINER_CLI} images -aq --filter reference='dev-peer*') 2>/dev/null || true
}

# --- CLI ---
MODE=$1
shift || true

if [[ $# -ge 1 && "$1" == "createChannel" ]]; then
  MODE="createChannel"
  shift
fi

while [[ $# -ge 1 ]]; do
  case "$1" in
    -h) printHelp; exit 0 ;;
    -ca) CRYPTO="Certificate Authorities" ;;
    -c) CHANNEL_NAME="$2"; shift ;;
    -r) MAX_RETRY="$2"; shift ;;
    -d) CLI_DELAY="$2"; shift ;;
    -ccn) CC_NAME="$2"; shift ;;
    -ccp) CC_SRC_PATH="$2"; shift ;;
    -ccl) CC_SRC_LANGUAGE="$2"; shift ;;
    -ccv) CC_VERSION="$2"; shift ;;
    -ccs) CC_SEQUENCE="$2"; shift ;;
    -verbose) VERBOSE=true ;;
    *) fatalln "Unknown flag: $1" ;;
  esac
  shift
done

case "${MODE}" in
  up)
    networkUp
    ;;
  createChannel)
    createChannel
    ;;
  down)
    networkDown
    ;;
  restart)
    networkDown
    networkUp
    ;;
  deployCC)
    deployCC
    ;;
  *)
    printHelp
    exit 1
    ;;
esac
