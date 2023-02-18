const { MongoClient } = require('mongodb');
const axios = require('axios');
const crypto = require('crypto');
const config = require("../config.json");

const uri = <mongodb uri>;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = client.db("tokens");

// Define a schema for token information
const tokenSchema = {
  name: String,
  symbol: String,
  icon: String,
  totalSupply: Number,
  currentSupply: Number,
  transactionHistory: Array
};

// Create a new token
async function createToken(name, symbol, icon, totalSupply, privateKey) {
  await client.connect();
  const keypair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      passphrase: privateKey
    }
  });
  const publicKey = keypair.publicKey;
  const token = {
    name: name,
    symbol: symbol,
    icon: icon,
    totalSupply: totalSupply,
    currentSupply: totalSupply,
    transactionHistory: [],
    publicKey: publicKey
  };

  const result = await db.collection('tokens').insertOne(token);
  console.log(`Token ${name} created with ID ${result.insertedId}`);
  await client.close();
  return { address: publicKey, privateKey };
}

// Mint new tokens and update the token supply
async function mint(publicKey, amount, privateKey) {
  await client.connect();
  const token = await db.collection('tokens').findOne({ publicKey: publicKey });
  if (!token) {
    console.log('Token not found');
    await client.close();
    return;
  }

  const sign = crypto.createSign('RSA-SHA256');
  sign.write(amount.toString());
  sign.end();
  const signature = sign.sign({
    key: privateKey,
    passphrase: privateKey
  }, 'hex');

  // Call the Nano RPC to send the transaction
  const rpcResult = await axios.post(config.node, {
    action: 'send',
    wallet: 'my_wallet',
    source: 'my_account',
    destination: publicKey,
    amount: amount,
    signature: signature
  });

  token.currentSupply += amount;
  token.transactionHistory.push({
    from: 'mint',
    to: publicKey,
    amount: amount,
    txid: rpcResult.data.hash
  });
  await db.collection('tokens').updateOne({publicKey: publicKey}, {$set: token});
  await client.close();
}

// Transfer tokens from one address to another
async function transfer(fromPublicKey, toPublicKey, amount, privateKey) {
await client.connect();
const token = await db.collection('tokens').findOne({ publicKey: fromPublicKey });
if (!token) {
console.log('Token not found');
await client.close();
return;
}

if (token.currentSupply < amount) {
console.log('Insufficient balance');
await client.close();
return;
}

const sign = crypto.createSign('RSA-SHA256');
sign.write(`${fromPublicKey}${toPublicKey}${amount}`);
sign.end();
const signature = sign.sign({
key: privateKey,
passphrase: privateKey
}, 'hex');

// Call the Nano RPC to send the transaction
const rpcResult = await axios.post(config.node, {
action: 'send',
wallet: 'my_wallet',
source: fromPublicKey,
destination: toPublicKey,
amount: amount,
signature: signature
});

token.currentSupply -= amount;
token.transactionHistory.push({
from: fromPublicKey,
to: toPublicKey,
amount: amount,
txid: rpcResult.data.hash
});
await db.collection('tokens').updateOne({publicKey: fromPublicKey}, {$set: token});
await client.close();
}

// Get token information by address
async function getTokenInfo(publicKey) {
await client.connect();
const token = await db.collection('tokens').findOne({ publicKey: publicKey });
await client.close();
return token;
}

module.exports = {
createToken,
mint,
transfer,
getTokenInfo
};
