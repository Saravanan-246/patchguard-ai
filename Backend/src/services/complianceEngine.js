const Vulnerability = require("../models/Vulnerability");
const System = require("../models/System");

/* =========================================
   Compliance Calculator
========================================= */
const calculateCompliance = async () => {
  // Fetch all active vulnerabilities
  const vulnerabilities = await Vulnerability.find({ isActive: true });

  if (!vulnerabilities.length) {
    return {
      score: 100,
      grade: "A",
      status: "compliant",
    };
  }

  let totalWeight = 0;
  let patchedWeight = 0;

  const SEVERITY_WEIGHTS = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  vulnerabilities.forEach((vuln) => {
    const severity = (vuln.severity || "").toLowerCase();
    const weight = SEVERITY_WEIGHTS[severity] || 1;

    totalWeight += weight;

    if (vuln.status === "patched") {
      patchedWeight += weight;
    }
  });

  const score = Math.round((patchedWeight / totalWeight) * 100);

  return {
    score,
    grade: getComplianceGrade(score),
    status: score >= 80 ? "compliant" : "non-compliant",
  };
};

/* =========================================
   Grade Mapping
========================================= */
const getComplianceGrade = (score) => {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
};

module.exports = {
  calculateCompliance,
};