const tokenService = require('./index.js');

// Create a new token
const createToken = async (req, res) => {
  try {
    const { name, symbol, icon, totalSupply, privateKey } = req.body;
    const token = await tokenService.createToken(name, symbol, icon, totalSupply, privateKey);
    res.json(token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating token' });
  }
};

// Mint new tokens and update the token supply
const mint = async (req, res) => {
  try {
    const { publicKey, amount, privateKey } = req.body;
    await tokenService.mint(publicKey, amount, privateKey);
    res.json({ message: 'Tokens minted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error minting tokens' });
  }
};

// Transfer tokens from one address to another
const transfer = async (req, res) => {
  try {
    const { fromPublicKey, toPublicKey, amount, privateKey } = req.body;
    await tokenService.transfer(fromPublicKey, toPublicKey, amount, privateKey);
    res.json({ message: 'Tokens transferred successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error transferring tokens' });
  }
};

// Get token information by address
const getTokenInfo = async (req, res) => {
  try {
    const { publicKey } = req.params;
    const token = await tokenService.getTokenInfo(publicKey);
    if (!token) {
      res.status(404).json({ message: 'Token not found' });
    } else {
      res.json(token);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting token information' });
  }
};

module.exports = {
  createToken,
  mint,
  transfer,
  getTokenInfo,
};
