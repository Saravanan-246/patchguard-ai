const System = require("../models/System");
const { calculateCompliance } = require("../services/complianceEngine");

exports.getCompliance = async (req, res) => {
  try {
    const system = await System.findOne({
      _id: req.params.systemId,
      owner: req.user._id,
      isActive: true,
    });

    if (!system)
      return res.status(404).json({ message: "System not found" });

    const compliance = await calculateCompliance(system._id);

    res.json({
      systemId: system._id,
      compliancePercentage: compliance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};