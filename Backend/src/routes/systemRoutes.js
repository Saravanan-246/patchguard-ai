const express = require("express");
const router = express.Router();

const systemController = require("../controllers/systemController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

// Metrics
router.get("/metrics", systemController.getDashboardMetrics);

// CRUD
router.route("/")
  .post(systemController.createSystem)
  .get(systemController.getSystems);

router.route("/:id")
  .get(systemController.getSystemById)
  .put(systemController.updateSystem)
  .delete(systemController.deleteSystem);

module.exports = router;