const System = require("../models/System");
const Vulnerability = require("../models/Vulnerability");
const { calculateCompliance } = require("../services/complianceEngine");

/* =========================================
   Create System
========================================= */
exports.createSystem = async (req, res, next) => {
  try {
    const { name, ipAddress, environment } = req.body;

    if (!name || !ipAddress || !environment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existing = await System.findOne({
      name,
      owner: req.user._id,
      isActive: true,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "System with this name already exists",
      });
    }

    const system = await System.create({
      name,
      ipAddress,
      environment,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: system,
    });

  } catch (error) {
    next(error);
  }
};

/* =========================================
   Get All Systems
========================================= */
exports.getSystems = async (req, res, next) => {
  try {
    const systems = await System.find({
      owner: req.user._id,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: systems.length,
      data: systems,
    });

  } catch (error) {
    next(error);
  }
};

/* =========================================
   Get Single System
========================================= */
exports.getSystemById = async (req, res, next) => {
  try {
    const system = await System.findOne({
      _id: req.params.id,
      owner: req.user._id,
      isActive: true,
    }).lean();

    if (!system) {
      return res.status(404).json({
        success: false,
        message: "System not found",
      });
    }

    res.json({
      success: true,
      data: system,
    });

  } catch (error) {
    next(error);
  }
};

/* =========================================
   Update System
========================================= */
exports.updateSystem = async (req, res, next) => {
  try {
    const allowedUpdates = ["name", "ipAddress", "environment"];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const system = await System.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id,
        isActive: true,
      },
      updates,
      { new: true, runValidators: true }
    );

    if (!system) {
      return res.status(404).json({
        success: false,
        message: "System not found",
      });
    }

    res.json({
      success: true,
      data: system,
    });

  } catch (error) {
    next(error);
  }
};

/* =========================================
   Soft Delete System
========================================= */
exports.deleteSystem = async (req, res, next) => {
  try {
    const system = await System.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id,
        isActive: true,
      },
      { isActive: false },
      { new: true }
    );

    if (!system) {
      return res.status(404).json({
        success: false,
        message: "System not found",
      });
    }

    res.json({
      success: true,
      message: "System deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

/* =========================================
   Dashboard Metrics (FIXED)
========================================= */
exports.getDashboardMetrics = async (req, res, next) => {
  try {
    const totalSystems = await System.countDocuments({
      owner: req.user._id,
      isActive: true,
    });

    const criticalVulns = await Vulnerability.countDocuments({
      owner: req.user._id,
      severity: "critical",
      status: "open",
      isActive: true,
    });

    const pendingPatches = await Vulnerability.countDocuments({
      owner: req.user._id,
      status: "open",
      isActive: true,
    });

    const compliance = await calculateCompliance();

    res.json({
      success: true,
      totalSystems,
      criticalVulns,
      pendingPatches,
      complianceScore: compliance.score,
    });

  } catch (error) {
    next(error);
  }
};