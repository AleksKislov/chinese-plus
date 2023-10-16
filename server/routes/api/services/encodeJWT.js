const jwt = require("jsonwebtoken");

function encodeJWT(id) {
  return new Promise((resolve, reject) => {
    jwt.sign({ user: { id } }, process.env.JWT_SECRET, { expiresIn: "30d" }, (err, token) => {
      if (err) return reject(err);
      else return resolve(token);
    });
  });
}

module.exports = { encodeJWT };
