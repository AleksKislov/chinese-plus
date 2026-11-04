function apiDecorator(cb) {
  return async function (req, res) {
    cb(req, res).catch((err) => {
      if (err.status) return res.status(err.status).json({ msg: err.message });
      console.log(err);
      res.status(500).send(`Server error: ${err}`);
    });
  };
}

module.exports = { apiDecorator };
