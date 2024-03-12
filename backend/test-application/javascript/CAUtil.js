/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const adminUserId = "admin";
const adminUserPasswd = "adminpw";

/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
  // Create a new CA client for interacting with the CA.
  const caInfo = ccp.certificateAuthorities[caHostName]; //lookup CA details from config
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(
    caInfo.url,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
  );

  console.log(`Built a CA Client named ${caInfo.caName}`);
  return caClient;
};

exports.enrollAdmin = async (caClient, wallet, orgMspId) => {
  try {
    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(adminUserId);
    if (identity) {
      console.log(
        "An identity for the admin user already exists in the wallet"
      );
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await caClient.enroll({
      enrollmentID: adminUserId,
      enrollmentSecret: adminUserPasswd,
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: "X.509",
    };
    await wallet.put(adminUserId, x509Identity);
    console.log(
      "Successfully enrolled admin user and imported it into the wallet"
    );
  } catch (error) {
    console.error(`Failed to enroll admin user : ${error}`);
  }
};

exports.registerAndEnrollUser = async (
  caClient,
  wallet,
  orgMspId,
  userId,
  affiliation
) => {
  try {
    // Check to see if we've already enrolled the user
    const userIdentity = await wallet.get(userId);

    if (userIdentity) {
      console.log(
        `An identity for the user ${userId} already exists in the wallet`
      );
      return {
        success: false,
        message: "User Already Exists!",
      };
    }

    // Must use an admin to register a new user
    const adminIdentity = await wallet.get(adminUserId);

    if (!adminIdentity) {
      console.log(
        "An identity for the admin user does not exist in the wallet"
      );
      console.log("Enroll the admin user before retrying");
      return {
        success: false,
        message: "Enroll the admin user before retrying",
      };
    }

    // build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);

    const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

    // Register the user, enroll the user, and import the new identity into the wallet.
    // if affiliation is specified by client, the affiliation value must be configured in CA
    const secret = await caClient.register(
      {
        affiliation: affiliation,
        enrollmentID: userId,
        role: "client",
      },
      adminUser
    );

    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      enrollmentSecret: secret,
      type: "X.509",
    };

    let privateKey = enrollment.key.toBytes();

    await wallet.put(userId, x509Identity);

    console.log(
      `Successfully registered and enrolled user ${userId} and imported it into the wallet`
    );

    return {
      success: true,
      secret,
      privateKey,
    };
  } catch (error) {
    console.error(`Failed to register user : ${error}`);
    return {
      success: false,
      message: `${error}`,
    };
  }
};

// exports.isUserRegistered = async (username, userOrg, secret, walletPath) => {
//     const wallet = await Wallets.newFileSystemWallet(walletPath);
//     console.log(`Wallet path: ${walletPath}`);

//     try {
//         const userIdentity = await wallet.get(username);

//         if (userIdentity) {
//             let ccp = await getCCP(userOrg);

//             const caURL = await getCaUrl(userOrg, ccp);
//             const ca = new FabricCAServices(caURL);

//             console.log('username: ', username);
//             console.log('secret: ', secret);

//             const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });

//             return {
//                 success: true,
//             }
//         }
//         return {
//             success: false,
//             message: "User not registered"
//         }

//     } catch (error) {
//         console.log("isUserRegistered Error: ",error);
//         return {
//             success: false,
//             message: error.message
//         }
//     }

// }

exports.loginUser = async (wallet, userId) => {
  try {
    // Get the user's identity from the wallet
    const userIdentity = await wallet.get(userId);

    if (!userIdentity) {
      console.log(`User ${userId} not found in the wallet`);
      return false;
    }

    console.log(`Successfully found user ${userId} in the wallet`);

    // Optionally, you can return the user's identity information
    return userIdentity;
  } catch (error) {
    console.error(`Failed to login user ${userId}: ${error}`);
    throw error;
  }
};

// Helper Functions //
const getCCP = async (org) => {
  let ccpPath;
  if (org == "farmer")
    ccpPath = path.resolve(
      __dirname,
      "..",
      "config",
      "connection-profile-farmer.json"
    );
  else if (org == "wholesaler")
    ccpPath = path.resolve(
      __dirname,
      "..",
      "config",
      "connection-profile-wholesaler.json"
    );
  else if (org == "retailer")
    ccpPath = path.resolve(
      __dirname,
      "..",
      "config",
      "connection-profile-retailer.json"
    );
  else return null;

  const ccpJSON = fs.readFileSync(ccpPath, "utf8");
  const ccp = JSON.parse(ccpJSON);
  return ccp;
};
