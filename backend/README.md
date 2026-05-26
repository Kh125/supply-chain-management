# Backend

| Path | Purpose |
|------|---------|
| `api/` | Express server on port 4000 |
| `chaincode/` | Go smart contract (`basic` on `mychannel`) |
| `network/` | Local 2-org Fabric network |
| `scripts/install-fabric.sh` | Install `bin/` + `config/` |
| `bin/`, `config/` | Fabric tooling (gitignored) |

## Network scripts (minimal set)

```
network/
  startNetwork.sh      # ./network.sh down && up createChannel -ca && deployCC
  network.sh           # up | down | deployCC | restart
  network.config
  scripts/
    utils.sh           # logging + help
    envVar.sh          # peer env
    createChannel.sh
    orderer.sh
    setAnchorPeer.sh
    configUpdate.sh
    deployCC.sh
    packageCC.sh
    ccutils.sh
  organizations/
    fabric-ca/registerEnroll.sh
    ccp-generate.sh
    ccp-template.json
  configtx/configtx.yaml
  compose/             # test-net + CA only
```

## Commands

```bash
./scripts/install-fabric.sh
cd network && ./startNetwork.sh
cd ../api && npm run dev
```
