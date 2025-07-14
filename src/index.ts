import { Hono } from "hono";
import { TronWeb } from "tronweb";

const app = new Hono();

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  headers: { "TRON-PRO-API-KEY": "" },
  privateKey: "your private key",
});

// console.log(tronWeb);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/createAccount", async (c) => {
  await tronWeb.createAccount().then((result) => {
    console.log(result);
    console.log(result.address.base58);
    console.log(result.address.hex);
  });
  return c.text("successfully");
});

app.get("/createRandom", async (c) => {
  const result = await tronWeb.createRandom();
  console.log(result);
  return c.json(result);
});

app.get("/sendTrxTransaction/:to/:number/:from", async (c) => {
  const to = c.req.param("to");
  const number = c.req.param("number");
  const nn = Number(number);
  const from = c.req.param("from");
  const tradeObj = await tronWeb.transactionBuilder.sendTrx(to, nn, from);
  const signedtxn = await tronWeb.trx.sign(tradeObj, tronWeb.defaultPrivateKey);
  const receipt = await tronWeb.trx.sendRawTransaction(signedtxn);
  // tronWeb.trx.broadcast(signedtxn);
  return c.json(receipt);
});

app.get("/getAccount/:address", async (c) => {
  const address = c.req.param("address");
  await tronWeb.trx.getAccount(address).then((result) => console.log(result));
  return c.text("successfully");
});

app.get("/getAccountResources/:address", async (c) => {
  const address = c.req.param("address");
  await tronWeb.trx
    .getAccountResources(address)
    .then((result) => console.log(result));
  return c.text("successfully");
});

app.get("/getApprovedList", async (c) => {
  await tronWeb.trx.getApprovedList({
    visible: true,
    signature: [
      "1fd210045f5bdcf375cd478cf46ff735f132281b990bc199acf1952bd438929d1d03e12de5ea7dcb89cff5b8cfc5d161661a5c1fe6a6a2422edb313b9139075300",
    ],
    txID: "ee188aaf5cf78729d2d14d4db698126da2d75ef78a43837dafd6e6f591d103a2",
    raw_data: {
      contract: [
        {
          parameter: {
            value: {
              amount: 125000000,
              owner_address: "TN9RRaXkCFtTXRso2GdTZxSxxwufzxLQPP",
              to_address: "TTSFjEG3Lu9WkHdp4JrWYhbGP6K1REqnGQ",
            },
            type_url: "type.googleapis.com/protocol.TransferContract",
          },
          type: "TransferContract",
        },
      ],
      ref_block_bytes: "c251",
      ref_block_hash: "5c685c92bf035e72",
      expiration: 1578299967000,
      timestamp: 1578299909600,
    },
    raw_data_hex:
      "0a02c25122085c685c92bf035e7240988c89d0f72d5a68080112640a2d747970652e676f6f676c65617069732e636f6d2f70726f746f636f6c2e5472616e73666572436f6e747261637412330a1541859009fd225692b11237a6ffd8fdba2eb7140cca121541bf97a54f4b829c4e9253b26024b1829e1a3b112018c0b2cd3b70e0cb85d0f72d",
  });

  return c.text("successfully");
});

app.get("/getBalance/:address", async (c) => {
  const address = c.req.param("address");
  await tronWeb.trx
    .getBalance(address)
    .then((result) => console.log(tronWeb.fromSun(result))); // trx
  return c.text("successfully");
});

app.get("/getBandwidth/:address", async (c) => {
  const address = c.req.param("address");
  await tronWeb.trx.getBandwidth(address).then((result) => console.log(result)); // bandwidth
  return c.text("successfully");
});

app.get("/getBandwidthPrices", async (c) => {
  await tronWeb.trx.getBandwidthPrices().then((result) => console.log(result));
  return c.text("successfully");
});

app.get("/getBlock", async (c) => {
  await tronWeb.trx.getBlock("latest").then((result) => console.log(result));
  return c.text("successfully");
});

app.get("/getBlockByHash/:hash", async (c) => {
  await tronWeb.trx
    .getBlockByHash("latest")
    .then((result) => console.log(result));
  return c.text("successfully");
});

app.get("/getBlockByNumber/:blockNumber", async (c) => {
  const blockNumber = c.req.param("blockNumber");
  const bn = Number(blockNumber);
  await tronWeb.trx.getBlockByNumber(bn).then((result) => console.log(result));
  return c.text("successfully");
});

app.get("/getBlockTransactionCount/:blockNumber", async (c) => {
  const blockNumber = c.req.param("blockNumber");
  const bn = Number(blockNumber);
  await tronWeb.trx
    .getBlockTransactionCount(bn)
    .then((result) => console.log(result));
  return c.text("successfully");
});

app.get("/getBrokerage/:address", async (c) => {
  const address = c.req.param("address");
  await tronWeb.trx.getBrokerage(address).then((result) => console.log(result));
  return c.text("successfully");
});

// resource: resource type, optional BANDWIDTH or ENERGY
app.get("/getCanDelegatedMaxSize/:address", async (c) => {
  const address = c.req.param("address");
  await tronWeb.trx
    .getCanDelegatedMaxSize(address, "BANDWIDTH")
    .then((result) => console.log(result));

  await tronWeb.trx
    .getCanDelegatedMaxSize(address, "ENERGY")
    .then((result) => console.log(result));

  return c.text("successfully");
});

app.get("/getCanWithdrawUnfreezeAmount/:address", async (c) => {
  const address = c.req.param("address");
  await tronWeb.trx
    .getCanWithdrawUnfreezeAmount(address, Date.now())
    .then((result) => console.log(result));
  return c.text("successfully");
});

app.get("/getConfirmedTransaction/:transactionID", async (c) => {
  const transactionID = c.req.param("transactionID");
  await tronWeb.trx
    .getConfirmedTransaction(transactionID)
    .then((result) => console.log(result));
  return c.text("successfully");
});

app.get("/getNodeInfo", async (c) => {
  const result = await tronWeb.trx.getNodeInfo();
  return c.json(result);
});

app.get("/listNodes", async (c) => {
  const result = await tronWeb.trx.listNodes();
  return c.json(result);
});

app.get("/getTransaction/:txId", async (c) => {
  const txId = c.req.param("txId");
  const result = await tronWeb.trx.getTransaction(txId);
  return c.json(result);
});

app.get("/getTransactionInfo/:txId", async (c) => {
  const txId = c.req.param("txId");
  const result = await tronWeb.trx.getTransactionInfo(txId);
  return c.json(result);
});

app.get("/listTokens", async (c) => {
  const result = await tronWeb.trx.listTokens();
  return c.json(result);
});

export default {
  port: 3000,
  fetch: app.fetch,
};
