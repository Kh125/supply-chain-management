# Frontend

Frontend for Supply Chain Management

## Introduction

Frontend is implemented using MERN stack. Frontend is running on port 3000 and connect with Hyperledger Fabric Backend which is running on port 4000

## Features

1. **Account Creation**
2. **Product Creation**
3. **Product Update**
4. **Product Order Request**
5. **Order Accept**
6. **Ship the Product**
7. **Deliver Product**
8. **Product Information Tracking**
9. **Product Transaction History**

## Getting Started

### Installation

- Clone the repository
  ```bash
  $ git clone https://github.com/Kh125/supply-chain-management.git
  $ cd supply-chain-management
  ```

## Backend Setup

### Go to backend/test-network directory

Before running ./startNetwork.sh,
Give permission to startNetwork.sh by running this command:

```bash
chmod +x startNetwork.sh
```

Run this command for create the backend network structure:

```bash
./startNetwork.sh
```

startNetwork.sh will destroy the existing network first and then up the required network and create channel with ca for two organizations and deploy the chaincode.

### After that, go to the backend/asset-transfer-basic/application-javascript:

Check node verison using this command:

```bash
node -v
```

If node.js version is less that 14._, you will have to upgrade the node.js version to over 14.
Recommended version is 16._.
After upgrading the node.

Run this command to install required dependencies to run the backend fabric api:

```bash
npm i
```

Finally run this command to start the backend server:

```bash
npm start
```

Now your backend server is up and running on port 4000.

### Frontend Setup

- Go to frontend directory:
  ```bash
  $ cd supply-chain-management/frontend
  ```
- Install Additional Depencies using this command.

  ```bash
  $ npm i
  ```

- Start the frontend server
  ```bash
    $ npm start
  ```
  Frontend server is now up and running on port 3000.

### Final Step

Now you can access the supply chain management web application from port 3000.

#Thanks.
