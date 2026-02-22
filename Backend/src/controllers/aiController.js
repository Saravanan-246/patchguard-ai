const System = require("../models/System");
const Vulnerability = require("../models/Vulnerability");
const Attack = require("../models/Attack");
const { emitToSystem } = require("../socket/socket");

exports.simulateAttackAI = async (req, res) => {
  try {
    const { systemId, intensity } = req.body;

    const system = await System.findById(systemId);
    if (!system) {
      return res.status(404).json({ message: "System not found" });
    }

    const openVulns = await Vulnerability.find({
      system: systemId,
      status: "open",
    });

    if (!openVulns.length) {
      return res.json({ message: "System secure. No attack possible." });
    }

    // Create attack
    const attack = await Attack.create({
      system: systemId,
      type: "AI Simulated Attack",
      stage: "exploitation",
      severity: intensity || "high",
      status: "active",
    });

    emitToSystem(systemId, "attack:started", attack);

    /* ===== AI AUTO FIX ===== */
    if (intensity === "critical") {
      await Vulnerability.updateMany(
        { system: systemId, status: "open" },
        { status: "patched" }
      );

      attack.status = "mitigated";
      await attack.save();

      emitToSystem(systemId, "attack:resolved", {
        message: "AI auto-patched vulnerabilities",
      });
    }

    res.json({
      success: true,
      message: "AI simulation completed",
      attack,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "AI simulation failed" });
  }
};