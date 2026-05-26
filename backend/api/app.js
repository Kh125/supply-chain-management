/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

//#region Import

const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const constants = require("./config/constants.json");

const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("./lib/CAUtil.js");
const {
  buildCCPOrg1,
  buildWallet,
  buildCCPOrg2,
} = require("./lib/AppUtil.js");
const {
  resolveOrgName,
  orgToRole,
  runAsManufacturer,
  runAsConsumer,
  runAsAuthenticated,
  probeFabricIdentity,
  walletPathOrg1,
  walletPathOrg2,
} = require("./lib/fabricGateway.js");

const walletPath = walletPathOrg1;
const org2WalletPath = walletPathOrg2;
const JWT_SECRET = process.env.JWT_SECRET || "thisismysecret";

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

const crypto = require("crypto");
const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const bearerToken = require("express-bearer-token");
const jwt = require("jsonwebtoken");
const moment = require("moment");

app.set("secret", JWT_SECRET);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bearerToken());

app.use(express.json());

//#endregion Import

//#region Helper Functions

async function prepareOrgForRegistration(orgName) {
  const resolved = resolveOrgName(orgName);
  const mspOrg = resolved === "org1" ? "Org1MSP" : "Org2MSP";
  const ccp = resolved === "org1" ? buildCCPOrg1() : buildCCPOrg2();
  const caClient = buildCAClient(
    FabricCAServices,
    ccp,
    `ca.${resolved}.example.com`
  );
  const wallet = await buildWallet(
    Wallets,
    resolved === "org1" ? walletPath : org2WalletPath
  );
  await enrollAdmin(caClient, wallet, mspOrg);
  return { caClient, wallet, mspOrg, resolved };
}

async function verifyLogin(username, userOrg, privateKey) {
  const orgInfo = getOrganizationCredentials(userOrg);
  if (!orgInfo) {
    return { success: false, message: "Invalid organization" };
  }

  await prepareOrgForRegistration(userOrg);

  const wallet = await buildWallet(Wallets, orgInfo.orgWalletPath);
  const userIdentity = await wallet.get(username);

  if (!userIdentity) {
    return { success: false, message: "User not registered" };
  }

  const storedKey = userIdentity.credentials.privateKey;
  const normalizedIncoming = String(privateKey).trim();
  const normalizedStored = String(storedKey).trim();

  if (normalizedIncoming !== normalizedStored) {
    return { success: false, message: "Invalid private key" };
  }

  return { success: true, message: "Authentication succeed!" };
}

function getOrganizationCredentials(orgName) {
  const resolved = resolveOrgName(orgName);

  if (resolved === "org1") {
    return {
      orgName: resolved,
      orgWalletPath: walletPath,
      orgMSP: "Org1MSP",
      ccp: buildCCPOrg1(),
    };
  }
  if (resolved === "org2") {
    return {
      orgName: resolved,
      orgWalletPath: org2WalletPath,
      orgMSP: "Org2MSP",
      ccp: buildCCPOrg2(),
    };
  }
  return null;
}

function generateUniqueHash(data) {
  // Append a unique identifier to the input data
  const uniqueData = data + Date.now().toString(); // You can use any unique value here

  const hash = crypto.createHash("sha256");
  hash.update(uniqueData);
  return hash.digest("hex");
}

function getCurrentDate() {
  return moment().format("MMMM Do YYYY, h:mm:ss a");
}

//#endregion Helper Functions

//#region Routes

app.get("/", (req, res) => {
  console.log("This is the endpoint!");
  res.status(200).send("This is the endpoint");
});

app.get("/getAllProducts", async (req, res) => {
  await runAsAuthenticated(req, res, JWT_SECRET, async (contract) => {
    const result = await contract.evaluateTransaction("GetAllProducts");
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "The product list is empty.",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Products loaded Successfully.",
      data: JSON.parse(result.toString()),
    });
  });
});

app.post("/getProductListByManufacturerID", async (req, res) => {
  await runAsManufacturer(req, res, JWT_SECRET, async (contract, user) => {
    const manufacturer = req.body.userName || user.username;
    const result = await contract.evaluateTransaction(
      "GetProductsByManufacturer",
      manufacturer
    );
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "The product list is empty.",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Products loaded Successfully.",
      data: JSON.parse(result.toString()),
    });
  });
});

app.post("/register", async (req, res) => {
  var username = req.body.username;
  var orgName = req.body.orgName;
  orgName = resolveOrgName(orgName);
  let mspOrg = orgName == "org1" ? "Org1MSP" : "Org2MSP";

  console.debug("End point : /register");
  console.debug("User name : " + username);
  console.debug("Org name  : " + orgName);

  if (!username) {
    res.json({
      success: false,
      error: {
        message: "username is missing!",
      },
    });
    return;
  }

  if (!orgName) {
    res.json({
      success: false,
      error: {
        message: "orgName is missing!",
      },
    });
    return;
  }

  try {
    const { caClient, wallet, mspOrg } = await prepareOrgForRegistration(orgName);

    let response = await registerAndEnrollUser(
      caClient,
      wallet,
      mspOrg,
      username,
      `${orgName}.department1`
    );

    if (!response.success) {
      console.debug(
        "Failed to register the username %s for organization %s with::%s",
        username,
        orgName,
        response
      );

      return res.json({
        success: false,
        error: {
          message: response.message,
        },
      });
    }

    if (response.success) {
      console.debug(
        "Successfully registered the username %s for organization %s",
        username,
        orgName
      );

      res.json({
        success: true,
        message: {
          secret: response.secret,
          privateKey: response.privateKey,
        },
      });
    } else {
      console.debug(
        "Failed to register the username %s for organization %s with::%s",
        username,
        orgName,
        response
      );

      res.json({
        success: false,
        error: {
          message: "Failed to register!",
        },
      });
    }
  } catch (error) {
    console.error(`Failed to register user ${username}: ${error}`);
    res.json({
      success: false,
      error: {
        message: `${error}`,
      },
    });
  }
});

app.post("/users/login", async function (req, res) {
  var username = req.body.username;
  var orgName = req.body.orgName;
  orgName = resolveOrgName(orgName);
  var privateKey = req.body.privateKey;

  console.debug("End point : /users/login");
  console.debug("User name : " + username);
  console.debug("Org name  : " + orgName);
  // console.debug("secret  : " + secret);
  console.debug("Private Key  : " + privateKey);

  if (!username) {
    res.json({
      success: false,
      error: {
        message: "username is missing",
      },
    });
    return;
  }
  if (!orgName) {
    res.json({
      success: false,
      error: {
        message: "orgName is missing",
      },
    });
    return;
  }

  // console.log("un orgname privateKey", username, orgName, privateKey);
  const userRegisterInfo = await verifyLogin(username, orgName, privateKey);

  console.log("isUserRegistered: ", userRegisterInfo);

  if (userRegisterInfo.success) {
    const fabricCheck = await probeFabricIdentity(username, orgName);
    if (!fabricCheck.ok) {
      const stale =
        fabricCheck.detail?.includes("creator org unknown") ||
        fabricCheck.detail?.includes("creator is malformed");
      return res.json({
        success: false,
        error: {
          message: stale
            ? "Your certificate no longer matches the running network. Register again with the same username (after ./startNetwork.sh), or delete backend/api/wallet and org2Wlt and create a new account."
            : `Cannot reach Fabric: ${fabricCheck.detail}`,
        },
      });
    }

    const uiRole = orgToRole(orgName);
    var token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: orgName,
        role: uiRole,
      },
      app.get("secret")
    );
    res.json({
      success: true,
      message: {
        token: token,
      },
    });
  } else {
    res.json({
      success: false,
      error: {
        message: userRegisterInfo.message,
      },
    });
  }
});

app.post("/createProduct", async (req, res) => {
  await runAsManufacturer(req, res, JWT_SECRET, async (contract, user) => {
    const username = req.body.userName || user.username;
    const productName = req.body.productName;
    const productDescription = req.body.productDescription;
    const productPrice = req.body.productPrice;
    const createdDate = moment(req.body.createdDate).format(
      "MMMM Do YYYY, h:mm:ss a"
    );
    const productId = generateUniqueHash(
      username + productName + productDescription
    );

    const txn = await contract.submitTransaction(
      "CreateProduct",
      productId,
      productName,
      productDescription,
      productPrice,
      username,
      createdDate
    );

    return res.status(200).send({
      success: true,
      message: "Created product successfully!",
      txn: txn.toString(),
    });
  });
});

app.post("/updateProduct", async (req, res) => {
  await runAsManufacturer(req, res, JWT_SECRET, async (contract, user) => {
    const userName = req.body.userName || user.username;
    const modifiedDate = getCurrentDate();
    const txn = await contract.submitTransaction(
      "UpdateProduct",
      req.body.token,
      req.body.productName,
      req.body.productDescription,
      req.body.productPrice,
      userName,
      modifiedDate
    );
    return res.status(200).send({
      success: true,
      message: "Updated product successfully!",
      txn: txn.toString(),
    });
  });
});

app.post("/orderProduct", async (req, res) => {
  await runAsConsumer(req, res, JWT_SECRET, async (contract, user) => {
    const userName = req.body.userName || user.username;
    const token = req.body.token;
    const modifiedDate = getCurrentDate();
    await contract.submitTransaction(
      "ProductOrder",
      token,
      userName,
      modifiedDate
    );
    return res.status(200).send({
      success: true,
      message: `Successfully Ordered product with id ${token}!`,
    });
  });
});

app.post("/acceptProductOrder", async (req, res) => {
  await runAsManufacturer(req, res, JWT_SECRET, async (contract, user) => {
    const userName = req.body.userName || user.username;
    const token = req.body.token;
    const modifiedDate = getCurrentDate();
    await contract.submitTransaction(
      "ProductAccept",
      token,
      userName,
      modifiedDate
    );
    return res.status(200).send({
      success: true,
      message: `Successfully accepted product order with id ${token}!`,
    });
  });
});

app.post("/shipProductOrder", async (req, res) => {
  await runAsManufacturer(req, res, JWT_SECRET, async (contract) => {
    const token = req.body.token;
    const productId = token?.token ?? token;
    const modifiedDate = getCurrentDate();
    await contract.submitTransaction("ProductShip", productId, modifiedDate);
    return res.status(200).send({
      success: true,
      message: `Successfully shipped product order with id ${productId}!`,
    });
  });
});

app.post("/deliverProductOrder", async (req, res) => {
  await runAsManufacturer(req, res, JWT_SECRET, async (contract, user) => {
    const userName = req.body.userName || user.username;
    const token = req.body.token;
    const productId = token?.token ?? token;
    const modifiedDate = getCurrentDate();
    await contract.submitTransaction(
      "ProductDeliver",
      productId,
      userName,
      modifiedDate
    );
    return res.status(200).send({
      success: true,
      message: `Successfully delivered product order with id ${productId}!`,
    });
  });
});

app.post("/getOrderedProductList", async (req, res) => {
  await runAsConsumer(req, res, JWT_SECRET, async (contract, user) => {
    const userName = req.body.userName || user.username;
    const result = await contract.evaluateTransaction(
      "GetConsumerOrderedProductList",
      userName
    );
    return res
      .status(200)
      .send({ success: true, result: JSON.parse(result.toString()) });
  });
});

app.post("/getOrderRequestedProductList", async (req, res) => {
  await runAsManufacturer(req, res, JWT_SECRET, async (contract, user) => {
    const userName = req.body.userName || user.username;
    const result = await contract.evaluateTransaction(
      "GetOrderRequestedProductList",
      userName
    );
    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "The product list is empty.",
      });
    }
    return res
      .status(200)
      .send({ success: true, result: JSON.parse(result.toString()) });
  });
});

app.post("/getConsumerProductOrderList", async (req, res) => {
  await runAsConsumer(req, res, JWT_SECRET, async (contract, user) => {
    const userName = req.body.userName || user.username;
    const result = await contract.evaluateTransaction(
      "GetConsumerOrderedProductList",
      userName
    );
    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        message: "The product list is empty.",
      });
    }
    return res
      .status(200)
      .send({ success: true, result: JSON.parse(result.toString()) });
  });
});

app.get("/readProduct/:id", async (req, res) => {
  await runAsAuthenticated(req, res, JWT_SECRET, async (contract) => {
    const result = await contract.evaluateTransaction(
      "ReadProduct",
      req.params.id
    );
    return res
      .status(200)
      .send({ success: true, result: JSON.parse(result.toString()) });
  });
});

app.get("/getProductHistory/:id", async (req, res) => {
  await runAsAuthenticated(req, res, JWT_SECRET, async (contract) => {
    const result = await contract.evaluateTransaction(
      "TrackProductHistory",
      req.params.id
    );
    if (!result || result.length === 0) {
      return res.status(404).send({
        success: false,
        message: `No history for product ${req.params.id}`,
      });
    }
    return res.status(200).send({
      success: true,
      message: "Products Transaction loaded Successfully.",
      data: JSON.parse(result.toString()),
    });
  });
});

//#endregion Routes

app.listen(port, () => {
  console.log(
    `Hyperledger Fabric backend API is up on port ${port} (per-request Fabric identity)`
  );
});
