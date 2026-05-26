"use strict";

const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const jwt = require("jsonwebtoken");
const { buildCCPOrg1, buildCCPOrg2, buildWallet } = require("./AppUtil.js");

const channelName = process.env.CHANNEL_NAME || "mychannel";
const chaincodeName = process.env.CHAINCODE_NAME || "basic";
// CA-registered app users cannot use service discovery on the test network (access denied).
const discoveryEnabled = process.env.FABRIC_DISCOVERY === "true";
const walletPathOrg1 = path.join(__dirname, "..", "wallet");
const walletPathOrg2 = path.join(__dirname, "..", "org2Wlt");

const ORG_MANUFACTURER = "org1";
const ORG_CONSUMER = "org2";

function resolveOrgName(orgName) {
  if (orgName === "manufacturer") return ORG_MANUFACTURER;
  if (orgName === "consumer" || orgName === "distributor") return ORG_CONSUMER;
  return orgName;
}

function orgToRole(orgName) {
  return resolveOrgName(orgName) === ORG_MANUFACTURER ? "manufacturer" : "consumer";
}

/** Authenticated user from JWT only (no body spoofing). */
function getUserFromRequest(req, jwtSecret) {
  if (!req.token) return null;
  try {
    const decoded = jwt.verify(req.token, jwtSecret);
    const orgName = resolveOrgName(decoded.orgName);
    return {
      username: decoded.username,
      orgName,
      role: decoded.role || orgToRole(orgName),
    };
  } catch {
    return null;
  }
}

async function probeFabricIdentity(username, orgName) {
  const resolvedOrg = resolveOrgName(orgName);
  const ccp = resolvedOrg === ORG_MANUFACTURER ? buildCCPOrg1() : buildCCPOrg2();
  const walletPath =
    resolvedOrg === ORG_MANUFACTURER ? walletPathOrg1 : walletPathOrg2;
  const wallet = await buildWallet(Wallets, walletPath);
  const gateway = new Gateway();
  try {
    await gateway.connect(ccp, {
      wallet,
      identity: username,
      discovery: { enabled: discoveryEnabled, asLocalhost: true },
    });
    const network = await gateway.getNetwork(channelName);
    const contract = network.getContract(chaincodeName);
    await contract.evaluateTransaction("GetAllProducts");
    return { ok: true };
  } catch (error) {
    const detail =
      error.errors?.[0]?.message ||
      error.responses?.[0]?.response?.message ||
      error.message ||
      String(error);
    return { ok: false, detail };
  } finally {
    gateway.disconnect();
  }
}

/** Wrap contract so submits collect endorsements from all channel peers (2-org policy). */
function wrapContractForSubmit(contract, network) {
  const endorsers = network.getChannel().getEndorsers() || [];

  return {
    evaluateTransaction: (...args) => contract.evaluateTransaction(...args),
    submitTransaction: async (transactionName, ...args) => {
      const txn = contract.createTransaction(transactionName);
      if (endorsers.length >= 2) {
        await txn.setEndorsingPeers(endorsers);
      }
      return txn.submit(...args);
    },
  };
}

async function withContract(username, orgName, fn) {
  const resolvedOrg = resolveOrgName(orgName);
  const ccp = resolvedOrg === ORG_MANUFACTURER ? buildCCPOrg1() : buildCCPOrg2();
  const walletPath =
    resolvedOrg === ORG_MANUFACTURER ? walletPathOrg1 : walletPathOrg2;
  const wallet = await buildWallet(Wallets, walletPath);

  const identity = await wallet.get(username);
  if (!identity) {
    throw new Error(
      `User "${username}" is not enrolled. Register and log in again.`
    );
  }

  const gateway = new Gateway();
  try {
    await gateway.connect(ccp, {
      wallet,
      identity: username,
      discovery: { enabled: discoveryEnabled, asLocalhost: true },
    });
    const network = await gateway.getNetwork(channelName);
    const contract = wrapContractForSubmit(
      network.getContract(chaincodeName),
      network
    );
    return await fn(contract);
  } finally {
    gateway.disconnect();
  }
}

function forbiddenMessage(allowedOrgs) {
  if (allowedOrgs.length === 1 && allowedOrgs[0] === ORG_MANUFACTURER) {
    return "This action is only allowed for manufacturer accounts.";
  }
  if (allowedOrgs.length === 1 && allowedOrgs[0] === ORG_CONSUMER) {
    return "This action is only allowed for consumer accounts.";
  }
  return "You do not have permission for this action.";
}

async function runAsOrg(req, res, jwtSecret, allowedOrgs, handler) {
  const user = getUserFromRequest(req, jwtSecret);
  if (!user) {
    return res.status(401).json({
      success: false,
      error: { message: "Authentication required. Log in again." },
    });
  }

  if (!allowedOrgs.includes(user.orgName)) {
    return res.status(403).json({
      success: false,
      error: { message: forbiddenMessage(allowedOrgs) },
    });
  }

  try {
    return await withContract(user.username, user.orgName, (contract) =>
      handler(contract, user)
    );
  } catch (error) {
    if (error.responses?.length) {
      console.error(
        "Fabric endorsement failures:",
        error.responses.map((r) => r.response?.message || r)
      );
    }
    if (error.errors?.length) {
      console.error("Fabric peer errors:", error.errors);
    }
    console.error(error);
    const peerDetail =
      error.errors?.[0]?.message ||
      error.responses?.[0]?.response?.message ||
      "";
    const staleWallet =
      peerDetail.includes("creator org unknown") ||
      peerDetail.includes("creator is malformed");
    const endorsementFailure =
      error.transactionCode === "ENDORSEMENT_POLICY_FAILURE" ||
      String(error.message).includes("ENDORSEMENT_POLICY_FAILURE");
    return res.status(500).json({
      success: false,
      message: staleWallet
        ? "Certificate is out of date for this network. Re-register your account (same username is fine) after ensuring the network is up."
        : endorsementFailure
          ? "Transaction was not endorsed by enough organizations. Restart the API and try again; if it persists, redeploy the network with ./startNetwork.sh."
          : peerDetail
            ? `${error.message}: ${peerDetail}`
            : error.message,
      error: String(error),
    });
  }
}

function runAsManufacturer(req, res, jwtSecret, handler) {
  return runAsOrg(req, res, jwtSecret, [ORG_MANUFACTURER], handler);
}

function runAsConsumer(req, res, jwtSecret, handler) {
  return runAsOrg(req, res, jwtSecret, [ORG_CONSUMER], handler);
}

function runAsAuthenticated(req, res, jwtSecret, handler) {
  return runAsOrg(req, res, jwtSecret, [ORG_MANUFACTURER, ORG_CONSUMER], handler);
}

module.exports = {
  ORG_MANUFACTURER,
  ORG_CONSUMER,
  resolveOrgName,
  orgToRole,
  getUserFromRequest,
  probeFabricIdentity,
  withContract,
  runAsManufacturer,
  runAsConsumer,
  runAsAuthenticated,
  walletPathOrg1,
  walletPathOrg2,
};
