function apiDecorator(cb) {
  return async function (req, res) {
    cb(req, res).catch((err) => {
      // console.error(err.message);
      res.status(500).send(`Server error: ${err.message}`);
    });
  };
}

module.exports = {
  apiDecorator,
};
