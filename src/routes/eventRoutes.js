const express = require("express");
const router = express.Router();

const {
    createEventHandler
} = require("../controllers/eventController");

router.post("/events", createEventHandler);

module.exports = router;