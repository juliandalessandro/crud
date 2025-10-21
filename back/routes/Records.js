const express = require("express");
const router = express.Router();
const { records } = require("../models");

router.get("/", async (req, res) => {
    const listOfRecords = await records.findAll();
    res.json(listOfRecords);
});

module.exports = router;