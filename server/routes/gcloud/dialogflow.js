const router = require("express").Router();

const { getDfAnswer } = require("../../src/api/services/gcloud");

router.get("/", getDfAnswer);

module.exports = router;
