function apiDecorator(cb) {
  return async function (req, res) {
    cb(req, res).catch((err) => {
      console.log(err);
      res.status(500).send(`Server error: ${err}`);
    });
  };
}

module.exports = { apiDecorator };
