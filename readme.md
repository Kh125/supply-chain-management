# Supply Chain Management (Hyperledger Fabric)

React frontend + Express API + Hyperledger Fabric ledger for tracking products from manufacturer to consumer.

## Project structure

```
supply-chain-management/
├── frontend/                 # React UI
├── backend/
│   ├── api/                  # Express REST API (port 4000)
│   ├── chaincode/            # Go smart contract
│   ├── network/              # Fabric network (Docker)
│   │   ├── startNetwork.sh   # One command: down → up → channel → deploy
│   │   ├── network.sh        # up | down | deployCC | restart
│   │   ├── network.config
│   │   ├── scripts/          # channel + chaincode lifecycle only
│   │   ├── compose/          # Docker Compose (2 orgs + CA)
│   │   └── configtx/
│   ├── scripts/
│   │   └── install-fabric.sh # Download Fabric bin/config
│   ├── bin/                  # gitignored — peer, configtxgen, …
│   └── config/               # gitignored — core.yaml, …
├── docker-compose.yml        # API + frontend images (Fabric runs separately)
└── .github/workflows/ci.yml
```

### Roles

| UI role        | Fabric org | Can do on ledger |
|----------------|------------|------------------|
| `manufacturer` | Org1       | Create/update products, accept/ship/deliver |
| `consumer`     | Org2       | Browse products, place orders |

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Go (chaincode build during deploy)

## Quick start

### 1. Install Fabric binaries (once)

```bash
cd backend/scripts
chmod +x install-fabric.sh
./install-fabric.sh
```

### 2. Start Fabric network

```bash
cd backend/network
chmod +x startNetwork.sh
./startNetwork.sh
```

### 3. Start API

```bash
cd backend/api
npm install
npm run dev
```

### 4. Start frontend

```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000 — register, download your key file, then login.

### After restarting the Fabric network

`./startNetwork.sh` recreates CAs and issues **new** certificates. Old wallet files will not work on the ledger (errors like `creator org unknown` or `No valid responses from any peers`).

```bash
rm -rf backend/api/wallet backend/api/org2Wlt
```

Then **register again** in the UI (same username is fine on a fresh network) and log in with the new private key file.

## Docker (API + frontend only)

Fabric must still run on the host (or extend compose with peer containers):

```bash
cd backend/network && ./startNetwork.sh
cd ../.. && docker compose up --build
```

Frontend: http://localhost:3000 — API proxied at `/api/`.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs:

- Frontend `npm ci` + build + test
- API syntax check
- Chaincode `go build`
- Docker image builds

## Cleanup already done

Removed unused Fabric sample pieces: CI scripts folder, Org3/BFT/Couch/Podman/cryptogen/cfssl, Prometheus, extra `.sh` modes (`deployCCAAS`, BFT orderers, `prereq`, `cc` subcommands), duplicate CCP yaml, dead frontend token/wholesaler code, and stub npm packages (`crypto`, `body-parser`).

`backend/network/` now keeps only **9 scripts** needed for the 2-org CA + Raft flow.
