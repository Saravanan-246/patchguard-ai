// ============================================
// Severity Weights (normalized scale)
// ============================================
const SEVERITY_WEIGHTS = {
  low: 10,
  medium: 30,
  high: 60,
  critical: 90,
};

// ============================================
// Calculate System Risk
// ============================================
const calculateSystemRisk = (vulnerabilities = [], environment = "staging") => {
  if (!vulnerabilities.length) {
    return {
      riskScore: 0,
      status: "healthy",
    };
  }

  let cumulativeScore = 0;

  vulnerabilities.forEach((vuln) => {
    const severityKey = (vuln.severity || "").toLowerCase();
    let baseScore = SEVERITY_WEIGHTS[severityKey] || 0;

    // CVSS Influence (0–10 scaled to 0–25)
    if (typeof vuln.cvssScore === "number") {
      baseScore += (vuln.cvssScore / 10) * 25;
    }

    // Exploit availability impact
    if (vuln.exploitAvailable) {
      baseScore += 15;
    }

    // Age-based risk increase
    if (vuln.createdAt) {
      const daysOpen = Math.floor(
        (Date.now() - new Date(vuln.createdAt)) / (1000 * 60 * 60 * 24)
      );

      // Each day increases risk slightly (max +15)
      baseScore += Math.min(daysOpen * 0.5, 15);
    }

    cumulativeScore += baseScore;
  });

  // Average risk instead of stacking infinitely
  let riskScore = cumulativeScore / vulnerabilities.length;

  // Environment multiplier
  if (environment === "production") {
    riskScore *= 1.25;
  } else if (environment === "staging") {
    riskScore *= 1.1;
  }

  // Normalize to 0–100
  riskScore = Math.min(riskScore, 100);

  return {
    riskScore: Math.round(riskScore),
    status: getSystemStatus(riskScore),
  };
};

// ============================================
// Risk Status Mapping
// ============================================
const getSystemStatus = (score) => {
  if (score >= 80) return "critical";
  if (score >= 50) return "warning";
  return "healthy";
};

module.exports = {
  calculateSystemRisk,
};