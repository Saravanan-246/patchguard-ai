const express = require("express");
const router = express.Router();
const { simulateAttackAI } = require("../controllers/aiController");

router.post("/simulate-attack", simulateAttackAI);

module.exports = router;