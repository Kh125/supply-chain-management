/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

//#region Import

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const constants = require("./config/constants.json");

const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
  loginUser,
} = require("../../test-application/javascript/CAUtil.js");
const {
  buildCCPOrg1,
  buildWallet,
  buildCCPOrg2,
} = require("../../test-application/javascript/AppUtil.js");

const channelName = process.env.CHANNEL_NAME || "mychannel";
const chaincodeName = process.env.CHAINCODE_NAME || "basic";

const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org2WalletPath = path.join(__dirname, "org2Wlt");
const org1UserId = "javascriptAppUser";

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

const crypto = require("crypto");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
const cors = require("cors");
const bearerToken = require("express-bearer-token");
const jwt = require("jsonwebtoken");
const moment = require("moment");

app.set("secret", "thisismysecret");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bearerToken());

app.use(bodyParser.json());

//#endregion Import

//#region Prerequisites

// pre-requisites:
// - fabric-sample two organization test-network setup with two peers, ordering service,
//   and 2 certificate authorities
//         ===> from directory /fabric-samples/test-network
//         ./network.sh up createChannel -ca
// - Use any of the asset-transfer-basic chaincodes deployed on the channel "mychannel"
//   with the chaincode name of "basic". The following deploy command will package,
//   install, approve, and commit the javascript chaincode, all the actions it takes
//   to deploy a chaincode to a channel.
//         ===> from directory /fabric-samples/test-network
//         ./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccl javascript
// - Be sure that node.js is installed
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node -v
// - npm installed code dependencies
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         npm install
// - to run this test application
//         ===> from directory /fabric-samples/asset-transfer-basic/application-javascript
//         node app.js

// NOTE: If you see  kind an error like these:
/*
    2020-08-07T20:23:17.590Z - error: [DiscoveryService]: send[mychannel] - Channel:mychannel received discovery error:access denied
    ******** FAILED to run the application: Error: DiscoveryService: mychannel error: access denied

   OR

   Failed to register user : Error: fabric-ca request register failed with errors [[ { code: 20, message: 'Authentication failure' } ]]
   ******** FAILED to run the application: Error: Identity not found in wallet: appUser
*/
// Delete the /fabric-samples/asset-transfer-basic/application-javascript/wallet directory
// and retry this application.
//
// The certificate authority must have been restarted and the saved certificates for the
// admin and application user are not valid. Deleting the wallet store will force these to be reset
// with the new certificate authority.
//

/**
 *  A test application to show basic queries operations with any of the asset-transfer-basic chaincodes
 *   -- How to submit a transaction
 *   -- How to query and check the results
 *
 * To see the SDK workings, try setting the logging to show on the console before running
 *        export HFC_LOGGING='{"debug":"console"}'
 */

//#endregion Prerequisites

//#region Helper Functions
const createCredentialsAndConnection = async (
  userId,
  orgName,
  connection = false
) => {
  // build an in memory object with the network configuration (also known as a connection profile)

  orgName = orgName == "manufacturer" ? "org1" : orgName;

  let mspOrg = orgName == "org1" ? "Org1MSP" : "Org2MSP";
  console.log(mspOrg);
  let ccp = orgName == "org1" ? buildCCPOrg1() : buildCCPOrg2();
  console.log(ccp);

  console.log(walletPath);
  // build an instance of the fabric ca services client based on
  // the information in the network configuration
  caClient = buildCAClient(FabricCAServices, ccp, `ca.${orgName}.example.com`);

  // setup the wallet to hold the credentials of the application user
  wallet = await buildWallet(
    Wallets,
    orgName == "org1" ? walletPath : org2WalletPath
  );

  // in a real application this would be done on an administrative flow, and only once
  await enrollAdmin(caClient, wallet, mspOrg);

  // await registerAndEnrollUser(
  //   caClient,
  //   wallet,
  //   mspOrg,
  //   userId,
  //   `${orgName}.department1`
  // );

  if (connection) {
    await createConnection(ccp, wallet, userId);
  }

  console.log(
    `\n--> Successfully accessed the network as user ${userId} from Org:${orgName}`
  );

  return {
    ccp,
    wallet,
    userId,
  };
};

const createConnection = async (ccp, wallet, userId) => {
  // Create a new gateway instance for interacting with the fabric network.
  // In a real application this would be done as the backend server session is setup for
  // a user that has been verified.
  const gateway = new Gateway();

  await gateway.connect(ccp, {
    wallet,
    identity: userId,
    discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
  });

  // Build a network instance based on the channel where the smart contract is deployed
  const network = await gateway.getNetwork(channelName);

  // Get the contract from the network.
  contract = network.getContract(chaincodeName);

  console.log("contract", contract);
};

const isUserRegistered = async (username, userOrg, privateKey) => {
  console.log("ISuserregisterOrgname", userOrg);

  let orgInfo = getOrganizationCredentials(userOrg);

  let connectionDetail = await createCredentialsAndConnection(
    username,
    userOrg
  );

  console.log("OrgInfo", orgInfo);
  console.log(orgInfo.orgWalletPath);

  const wallet = await buildWallet(Wallets, orgInfo.orgWalletPath);

  console.log(`Wallet path: ${orgInfo.orgWalletPath}`);

  try {
    const userIdentity = await wallet.get(username);

    if (userIdentity) {
      console.log("username: ", username);
      console.log("privateKey: ", privateKey);

      console.log("CaClient", caClient);

      // const enrollment = await caClient.enroll({
      //   enrollmentID: username,
      //   enrollmentSecret: secret,
      // });

      console.log("userIdentity", userIdentity);

      if (privateKey == userIdentity.credentials.privateKey) {
        await createConnection(
          connectionDetail.ccp,
          connectionDetail.wallet,
          connectionDetail.userId
        );
        console.log("Authentication passed!");
      }

      return {
        success: true,
        message: "Authentication succeed!",
      };
    }
    return {
      success: false,
      message: "User not registered",
    };
  } catch (error) {
    console.log("isUserRegistered Error: ", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

const getOrganizationCredentials = (orgName) => {
  let orgWalletPath;
  let orgMSP;
  let ccp;

  console.log("input orgame", orgName);

  if (orgName.toLowerCase() === "org1") {
    orgWalletPath = walletPath;
    orgMSP = "Org1MSP";
    ccp = buildCCPOrg1();
  } else if (orgName.toLowerCase() === "manufacturer") {
    orgWalletPath = walletPath;
    orgMSP = "Org1MSP";
    ccp = buildCCPOrg1();
  } else if (orgName.toLowerCase() === "org2") {
    orgWalletPath = org2WalletPath;
    orgMSP = "Org2MSP";
    ccp = buildCCPOrg2();
  } else if (orgName.toLowerCase() === "org3") {
    orgWalletPath = org3WalletPath;
    orgMSP = "Org3MSP";
    ccp = buildCCPOrg2();
  } else {
    return null;
  }

  return {
    orgName,
    orgWalletPath,
    orgMSP,
    ccp,
    caAddress: ccp.certificateAuthorities[`ca.${orgName}.example.com`].url,
  };
};

const createCredentials = async (userId, orgName) => {
  orgName = orgName == "manufacturer" ? "org1" : orgName;

  let mspOrg = orgName == "org1" ? "Org1MSP" : "Org2MSP";
  console.log(mspOrg);
  let ccp = orgName == "org1" ? buildCCPOrg1() : buildCCPOrg2();
  console.log(ccp);

  console.log(walletPath);
  // build an instance of the fabric ca services client based on
  // the information in the network configuration
  caClient = buildCAClient(FabricCAServices, ccp, `ca.${orgName}.example.com`);

  // setup the wallet to hold the credentials of the application user
  wallet = await buildWallet(
    Wallets,
    orgName == "org1" ? walletPath : org2WalletPath
  );

  // in a real application this would be done on an administrative flow, and only once
  await enrollAdmin(caClient, wallet, mspOrg);
};

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
  try {
    console.log(
      "\n--> Evaluate Transaction: GetAllProducts, function returns all the current products on the ledger"
    );
    let result = await contract.evaluateTransaction("GetAllProducts");

    if (result.length === 0) {
      console.log("The product list is empty.");
      res.status(404).json({
        success: false,
        message: "The product list is empty.",
      });
    } else {
      console.log(`*** Result: ${prettyJSONString(result.toString())}`);
      res.status(200).send({
        success: true,
        message: "Products loaded Successfully.",
        data: JSON.parse(result.toString()),
      });
    }
  } catch (error) {
    console.error(`Failed to get products: ${error}`);
    res.status(500).send({
      success: false,
      message: `Failed to get products: ${error}`,
    });
  }
});

app.post("/getProductListByManufacturerID", async (req, res) => {
  var username = req.body.userName;
  var orgName = req.body.orgName;
  var privateKey = req.body.privateKey;

  try {
    console.log(
      "\n--> Evaluate Transaction: GetAllProductsByManufactuerID, function returns all the current products of manufacturer on the ledger"
    );
    let result = await contract.evaluateTransaction(
      "GetProductsByManufacturer",
      username
    );

    if (result.length === 0) {
      console.log("The product list is empty.");
      res.status(404).json({
        success: false,
        message: "The product list is empty.",
      });
    } else {
      console.log(`*** Result: ${prettyJSONString(result.toString())}`);
      res.status(200).send({
        success: true,
        message: "Products loaded Successfully.",
        data: JSON.parse(result.toString()),
      });
    }
  } catch (error) {
    console.error(`Failed to get products: ${error}`);
    res.status(500).send({
      success: false,
      message: `Failed to get products: ${error}`,
    });
  }
});

app.get("/registerUser", async (req, res) => {
  console.log("\n--> Evaluate Transaction: Register User...");

  var usName = "MHK2";

  await createCredentialsAndConnection(usName, "org1");

  try {
    let response = await registerAndEnrollUser(
      caClient,
      wallet,
      mspOrg1,
      usName,
      "org1.department1"
    );

    if (!response.success) {
      console.debug(
        "Failed to register the username %s for organization %s with::%s",
        usName,
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
        usName
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
        usName,
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
    console.error(`Failed to register user ${usName}: ${error}`);
  }
});

app.get("/loginUser", async (req, res) => {
  console.log("\n--> Evaluate Transaction: Logging In User...");

  try {
    var usName = "TT";
    await loginUser(wallet, usName);

    res
      .status(200)
      .send(`Successfully found user and log in the user ${usName}!`);
  } catch (error) {
    console.error(`Failed to Login user ${usName}: ${error}`);
  }
});

app.get("/createProduct", async (req, res) => {
  console.log("\n--> Submit Transaction: Creating Product...");

  try {
    await contract.submitTransaction("CreateProduct", "3", "beer", "good");

    console.log(`Successfully created product with id 3!`);
    res.status(200).send(`Successfully created product with id 3!`);
  } catch (error) {
    console.error(`Failed to create product 3: ${error}`);
  }
});

app.get("/updateProduct", async (req, res) => {
  console.log("\n--> Submit Transaction: Updating Product...");

  try {
    await contract.submitTransaction("UpdateProduct", "3", "juice", "bad");

    res.status(200).send(`Successfully updated product with id 3!`);
    console.log(`Successfully updated product with id 3!`);
  } catch (error) {
    console.error(`Failed to create product 3: ${error}`);
  }
});

app.post("/register", async (req, res) => {
  var username = req.body.username;
  var orgName = req.body.orgName;
  orgName = orgName == "manufacturer" ? "org1" : "org2";
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

  var token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
      username: username,
      orgName: orgName,
    },
    app.get("secret")
  );

  let connectionDetail = await createCredentialsAndConnection(
    username,
    orgName
  );

  try {
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
      await createConnection(
        connectionDetail.ccp,
        connectionDetail.wallet,
        connectionDetail.userId
      );

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
  orgName = orgName == "manufacturer" ? "org1" : "org2";
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
  const userRegisterInfo = await isUserRegistered(
    username,
    orgName,
    privateKey
  );

  console.log("isUserRegistered: ", userRegisterInfo);

  if (userRegisterInfo.success) {
    var token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + parseInt(constants.jwt_expiretime),
        username: username,
        orgName: orgName,
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
  console.log("\n--> Submit Transaction: Creating Product...");

  try {
    console.log("Request", req.body);

    var username = req.body.userName;
    var orgName = req.body.orgName;
    // var privateKey = req.body.privateKey;
    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var productPrice = req.body.productPrice;
    var createdDate = moment(req.body.createdDate).format(
      "MMMM Do YYYY, h:mm:ss a"
    );
    var productId = generateUniqueHash(
      username + productName + productDescription
    );

    console.log(username, productName, productDescription, productId);

    // id string, name string, description string, manufacturer string, createddate string
    let txn = await contract.submitTransaction(
      "CreateProduct",
      productId,
      productName,
      productDescription,
      productPrice,
      username,
      createdDate
    );

    txn = txn.toString();

    console.log(`Successfully created product with id 5!`);
    console.log(txn);
    res
      .status(200)
      .send({ success: true, message: "Created product successfully!", txn });
  } catch (error) {
    console.error(`Failed to create product 3: ${error}`);
  }
});

app.post("/updateProduct", async (req, res) => {
  console.log("\n--> Submit Transaction: Updating Product...");

  try {
    console.log("Request", req.body);

    var userName = req.body.userName;

    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var productPrice = req.body.productPrice;
    var createdDate = req.body.createdDate;
    var token = req.body.token;
    let modifiedDate = getCurrentDate();

    console.log(
      "post info",
      productName,
      productDescription,
      productPrice,
      createdDate,
      userName,
      token
    );

    let txn = await contract.submitTransaction(
      "UpdateProduct",
      token,
      productName,
      productDescription,
      productPrice,
      userName,
      modifiedDate
    );

    txn = txn.toString();

    console.log(`Successfully updated product with id ${token}!`);
    console.log(txn);
    res
      .status(200)
      .send({ success: true, message: "Updated product successfully!", txn });
  } catch (error) {
    console.error(`Failed to update product : ${error}`);
    res
      .status(500)
      .send({ success: false, message: `Fail to update product : ${error}` });
  }
});

app.post("/orderProduct", async (req, res) => {
  console.log("\n--> Submit Transaction: Ordering Product...");

  try {
    console.log("Request", req.body);

    var userName = req.body.userName;
    var token = req.body.token;
    let modifiedDate = getCurrentDate();

    console.log("order info", userName, token);

    let txn = await contract.submitTransaction(
      "ProductOrder",
      token,
      userName,
      modifiedDate
    );

    console.log(`Successfully Ordered product with id ${token}!`);
    console.log("txn", txn);
    res.status(200).send({
      success: true,
      message: `Successfully Ordered product with id ${token}!`,
    });
  } catch (error) {
    console.error(`Failed to order product with id ${token}: ${error}`);
    res.status(500).send({
      success: false,
      message: `Fail to order product with id ${token}:${error}`,
      error: `${error}`,
    });
  }
});

app.post("/acceptProductOrder", async (req, res) => {
  console.log("\n--> Submit Transaction: Accepting Product Order...");

  try {
    console.log("Request", req.body);

    var userName = req.body.userName;
    var token = req.body.token;
    let modifiedDate = getCurrentDate();

    console.log("order info", userName, token);

    let txn = await contract.submitTransaction(
      "ProductAccept",
      token,
      userName,
      modifiedDate
    );

    console.log(`Successfully accepted product order with id ${token}!`);
    console.log("txn", txn);
    res.status(200).send({
      success: true,
      message: `Successfully accepted product order with id ${token}!`,
    });
  } catch (error) {
    console.error(`Failed to accept product order with id ${token}: ${error}`);
    res.status(500).send({
      success: false,
      message: `Fail to accept product order with id ${token}:${error}`,
      error: `${error}`,
    });
  }
});

app.post("/shipProductOrder", async (req, res) => {
  console.log("\n--> Submit Transaction: Shippeing Product Order...");

  try {
    console.log("Request", req.body);

    var token = req.body.token;
    let modifiedDate = getCurrentDate();

    console.log("order info", token);

    let txn = await contract.submitTransaction(
      "ProductShip",
      token.token,
      modifiedDate
    );

    console.log(`Successfully shipped product order with id ${token.token}!`);
    console.log("txn", txn);
    res.status(200).send({
      success: true,
      message: `Successfully shipped product order with id ${token.token}!`,
    });
  } catch (error) {
    console.error(
      `Failed to ship product order with id ${token.token}: ${error}`
    );
    res.status(500).send({
      success: false,
      message: `Fail to ship product order with id ${token.token}:${error}`,
      error: `${error}`,
    });
  }
});

app.post("/deliverProductOrder", async (req, res) => {
  console.log("\n--> Submit Transaction: Delivering Product Order...");

  try {
    console.log("Request", req.body);

    var userName = req.body.userName;
    var token = req.body.token;
    let modifiedDate = getCurrentDate();

    console.log("order info", token.token);

    let txn = await contract.submitTransaction(
      "ProductDeliver",
      token.token,
      userName,
      modifiedDate
    );

    console.log(`Successfully delivered product order with id ${token.token}!`);
    console.log("txn", txn);
    res.status(200).send({
      success: true,
      message: `Successfully delivered product order with id ${token.token}!`,
    });
  } catch (error) {
    console.error(
      `Failed to deliver product order with id ${token.token}: ${error}`
    );
    res.status(500).send({
      success: false,
      message: `Fail to deliver product order with id ${token.token}:${error}`,
      error: `${error}`,
    });
  }
});

app.post("/getOrderedProductList", async (req, res) => {
  console.log("\n--> Evaluate Transaction: Reading Ordered Product...");

  var userName = req.body.userName;

  try {
    let result = await contract.evaluateTransaction(
      "GetConsumerOrderedProductList",
      userName
    );

    res
      .status(200)
      .send({ success: true, result: JSON.parse(result.toString()) });
    console.log(`Successfully read ordered product.`);
  } catch (error) {
    console.error(`Failed to read products : ${error}`);
    res.status(500).send({
      success: false,
      message: `Failed to read products: ${error}`,
      error: `${error}`,
    });
  }
});

app.post("/getOrderRequestedProductList", async (req, res) => {
  console.log("\n--> Evaluate Transaction: Reading Order Requested Product...");

  var userName = req.body.userName;

  try {
    let result = await contract.evaluateTransaction(
      "GetOrderRequestedProductList",
      userName
    );

    if (result.length === 0) {
      console.log("The product list is empty.");
      res.status(200).json({
        success: true,
        message: "The product list is empty.",
      });
    } else {
      console.log(`Successfully read requested order product!`);
      res
        .status(200)
        .send({ success: true, result: JSON.parse(result.toString()) });
      // console.log(`*** Result: ${prettyJSONString(result.toString())}`);
      // res.status(200).send({
      //   success: true,
      //   message: "Products loaded Successfully.",
      //   data: JSON.parse(result.toString()),
      // });
    }
  } catch (error) {
    console.error(`Failed to read requested order product: ${error}`);
    res.status(500).send({
      success: false,
      message: `Failed to read requested order product: ${error}`,
      error: `${error}`,
    });
  }
});

app.post("/getConsumerProductOrderList", async (req, res) => {
  console.log("\n--> Evaluate Transaction: Reading Order Requested Product...");

  var userName = req.body.userName;

  try {
    let result = await contract.evaluateTransaction(
      "GetConsumerOrderedProductList",
      userName
    );

    if (result.length === 0) {
      console.log("The product list is empty.");
      res.status(200).json({
        success: true,
        message: "The product list is empty.",
      });
    } else {
      console.log(`Successfully read requested order product!`);
      res
        .status(200)
        .send({ success: true, result: JSON.parse(result.toString()) });
      // console.log(`*** Result: ${prettyJSONString(result.toString())}`);
      // res.status(200).send({
      //   success: true,
      //   message: "Products loaded Successfully.",
      //   data: JSON.parse(result.toString()),
      // });
    }
  } catch (error) {
    console.error(`Failed to read requested order product: ${error}`);
    res.status(500).send({
      success: false,
      message: `Failed to read requested order product: ${error}`,
      error: `${error}`,
    });
  }
});

app.get("/readProduct/:id", async (req, res) => {
  console.log("\n--> Evaluate Transaction: Reading Product...");

  var id = req.params.id;

  try {
    let result = await contract.evaluateTransaction("ReadProduct", id);

    res
      .status(200)
      .send({ success: true, result: JSON.parse(result.toString()) });
    console.log(`Successfully read product with id ${id}!`);
  } catch (error) {
    console.error(`Failed to read product ${id}: ${error}`);
    res.status(500).send({
      success: false,
      message: `Failed to read product ${id}: ${error}`,
      error: `${error}`,
    });
  }
});

app.get("/getProductHistory/:id", async (req, res) => {
  console.log("\n--> Evaluate Transaction: Reading Product History...");

  var id = req.params.id;

  try {
    let result = await contract.evaluateTransaction("TrackProductHistory", id);

    console.log(result.toString());
    // res.status(200).send(`Successfully read product with id ${id}!`);
    // res.status(200).json(JSON.parse(result));
    if (!result) {
      res.status(404).send({
        success: false,
        error: `No History for product ${id} : ${error}`,
      });
    }
    console.log(`Successfully read product history with id ${id}!`);

    res.status(200).send({
      success: true,
      message: "Products Transaction loaded Successfully.",
      data: JSON.parse(result.toString()),
    });
  } catch (error) {
    console.error(`Failed to read product history ${id}: ${error}`);
    res.status(500).send({
      success: false,
      error: `${error}`,
    });
  }
});

//#endregion Routes

var contract = null;
var caClient = null;
var wallet = null;

//#region Main

app.listen(port, async () => {
  try {
    let userId = "KH";
    let org = "org1";
    let mspOrg = org == "org1" ? "Org1MSP" : "Org2MSP";

    // need to comment this code for first time 'npm start' till the user created.
    // this code is used for testing purpose and for production, it can be removed.
    // await createCredentialsAndConnection(userId, org, true);

    console.log(
      "\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger"
    );
    // await contract.submitTransaction("InitLedger");
    console.log("*** Result: committed");
    console.log("");
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
  }
  console.log(
    `Hyperledger Fabric backend API is up and running at port ${port}`
  );
});

//#endregion Main
