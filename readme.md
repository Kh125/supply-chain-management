# Supply Chain Management using Hyperledger Fabric

## Design
<div style="display: flex;">
  <img src="https://github.com/user-attachments/assets/8c6b3657-018a-4c3e-840e-f2c986b25edc" alt="Dashboard" style="width: 49%; margin-right: 1%;" />
</div>

<div style="display: flex;">
  <img src="https://github.com/user-attachments/assets/d434b7e5-9354-4d5b-8355-79a9574fb58e" alt="Register" style="width: 49%; margin-right: 1%;" />
</div>


<div style="display: flex">
  <img src="https://github.com/user-attachments/assets/a8e23c4f-529a-4cd2-ae27-2861bed7dd80" alt="Login" style="width: 49%;" />
</div>

<div style="display: flex">
  <img src="https://github.com/user-attachments/assets/446de9ba-9267-4d09-b224-440fa0dc698e" alt="Profile" style="width: 49%;" />
</div>

<div style="display: flex">
  <img src="https://github.com/user-attachments/assets/3d7b5ae3-a24e-46cb-b030-098ddd57d791" alt="Services" style="width: 49%;" />
</div>

<div style="display: flex">
  <img src="https://github.com/user-attachments/assets/9ed360c4-48f4-4299-8f77-0449f2b5cbc5" alt="Create Token" style="width: 49%;" />
</div>


<div style="display: flex">
  <img src="https://github.com/user-attachments/assets/4812f903-e149-440c-86b5-21ac1b7d4810" alt="Product Details" style="width: 49%;" />
</div>


<div style="display: flex">
  <img src="https://github.com/user-attachments/assets/b17502cf-db60-43de-8369-0a68887d0bd2" alt="Product List" style="width: 49%;" />
</div>

<div style="display: flex">
  <img src="https://github.com/user-attachments/assets/76defeb7-e570-490f-aebd-0c66c52b2adb" alt="Product List" style="width: 49%;" />
</div>

<div style="display: flex">
  <img src="https://github.com/user-attachments/assets/e1975656-cc97-467e-a345-826cfbe2d394" alt="Product List" style="width: 49%;" />
</div>

<div style="display: flex">
  <img src="https://github.com/user-attachments/assets/b3f432e8-513f-46c0-bb5a-1281af85dab4" alt="Product Details" style="width: 49%;" />
</div>


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
