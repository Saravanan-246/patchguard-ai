const Vulnerability = require("../models/Vulnerability");
const System = require("../models/System");
const AuditLog = require("../models/AuditLog");

const { calculateSystemRisk } = require("./riskEngine");
const { calculateCompliance } = require("./complianceEngine");
const { emitEvent } = require("../socket/socket");

/* ======================================================
   🔥 CORE EVENT: Recalculate Everything
====================================================== */
const recalculateAndBroadcast = async (systemId, actionType) => {
  const system = await System.findById(systemId);

  if (!system) return;

  const openVulns = await Vulnerability.find({
    system: systemId,
    status: "open",
    isActive: true,
  });

  // 1️⃣ Calculate Risk
  const riskResult = calculateSystemRisk(
    openVulns,
    system.environment
  );

  system.riskScore = riskResult.riskScore;
  system.status = riskResult.status;
  system.lastScan = new Date();

  await system.save();

  // 2️⃣ Calculate Compliance
  const compliance = await calculateCompliance();

  // 3️⃣ Audit Log
  await AuditLog.create({
    action: actionType,
    system: systemId,
    details: `Risk updated to ${riskResult.riskScore}`,
  });

  // 4️⃣ Emit Real-Time Events
  emitEvent("risk:updated", {
    systemId,
    riskScore: system.riskScore,
    status: system.status,
  });

  emitEvent("compliance:updated", compliance);
};

/* ======================================================
   Vulnerability Created
====================================================== */
const handleVulnerabilityCreated = async (vulnerability) => {
  await recalculateAndBroadcast(
    vulnerability.system,
    "VULNERABILITY_CREATED"
  );

  emitEvent("vulnerability:created", vulnerability);
};

/* ======================================================
   Vulnerability Patched
====================================================== */
const handleVulnerabilityPatched = async (vulnerability) => {
  await recalculateAndBroadcast(
    vulnerability.system,
    "VULNERABILITY_PATCHED"
  );

  emitEvent("vulnerability:patched", vulnerability);
};

module.exports = {
  handleVulnerabilityCreated,
  handleVulnerabilityPatched,
};