## Available Functions

```js
createToken(req, res)
This function creates a new token with the provided parameters.
```

Parameters
name - The name of the token.
symbol - The symbol of the token.
icon - The icon of the token.
totalSupply - The total supply of the token.
privateKey - The private key of the token.

```js
const { createToken } = require('../lib/main.js');

createToken({
  body: {
    name: 'My Token',
    symbol: 'MTK',
    icon: 'https://example.com/icon.png',
    totalSupply: 1000000,
    privateKey: 'my-private-key'
  }
}, res);
```
```js
mint(req, res)
```
This function mints new tokens and updates the token supply.


Parameters
publicKey - The public key of the token.
amount - The amount of tokens to mint.
privateKey - The private key of the token.

```js
const { mint } = require('../lib/main.js');

mint({
  body: {
    publicKey: 'my-public-key',
    amount: 1000,
    privateKey: 'my-private-key'
  }
}, res);
```

```js
transfer(req, res)
```
This function transfers tokens from one address to another.

Parameters
fromPublicKey - The public key of the sender.
toPublicKey - The public key of the recipient.
amount - The amount of tokens to transfer.
privateKey - The private key of the sender.

```js
const { transfer } = require('../lib/main.js');

transfer({
  body: {
    fromPublicKey: 'sender-public-key',
    toPublicKey: 'recipient-public-key',
    amount: 100,
    privateKey: 'sender-private-key'
  }
}, res);
getTokenInfo(req, res)
```
This function gets token information by address.

Parameters
publicKey - The public key of the token.

```js
const { getTokenInfo } = require('../lib/main.js');

getTokenInfo({
  params: {
    publicKey: 'token-public-key'
  }
}, res);
```
