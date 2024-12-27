const jwt = require('jsonwebtoken');
const secret = 'mysecret';

function generateAuthToken(username) {
  return jwt.sign({ username }, secret, { expiresIn: '3600s' });
}

function validateAuthToken() {
  return (req, res, next) => {
    const token = req.query.token;

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send('You are not authorized');
      }
      req.username = decoded.username;
      next();
    });
  };
}

module.exports = { generateAuthToken, validateAuthToken };