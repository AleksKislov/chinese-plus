const jwt = require("jsonwebtoken");

function encodeJWT(id, expiresIn = "30d") {
  return new Promise((resolve, reject) => {
    jwt.sign({ user: { id } }, process.env.JWT_SECRET, { expiresIn }, (err, token) => {
      if (err) return reject(err);
      else return resolve(token);
    });
  });
}

module.exports = { encodeJWT };
