const CryptoJS = require('crypto-js');

// intercept the req.body
const decryptRequest = (req, res, next) => {

  if (!req.body || !req.body.payload) {
    return next();
  }

  try {
    const bytes = CryptoJS.AES.decrypt(req.body.payload, process.env.AES_SECRET);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) throw new Error('Malformed encryption');

    // Mutate the request body with the raw data
    req.body = JSON.parse(decryptedString);
    next();
  } catch (error) {
    console.error(`Decryption Error: ${error.message}`);
    return res.status(400).json({ error: 'Invalid or malformed encrypted payload' });
  }
};

//override native res.json
const encryptResponse = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {

    if (data.error || data.payload) {
      return originalJson.call(this, data);
    }

    try {
      const stringifiedData = JSON.stringify(data);
      const encryptedPayload = CryptoJS.AES.encrypt(stringifiedData, process.env.AES_SECRET).toString();
      
      return originalJson.call(this, { payload: encryptedPayload });
    } catch (error) {
      console.error(`Encryption Error: ${error.message}`);
      return res.status(500).json({ error: 'Failed to encrypt response' });
    }
  };

  next();
};

module.exports = { decryptRequest, encryptResponse };