const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getCompliance } = require("../controllers/complianceController");

router.use(protect);

router.get("/:systemId", getCompliance);

module.exports = router;