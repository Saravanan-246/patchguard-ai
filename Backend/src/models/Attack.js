const mongoose = require("mongoose");

const attackSchema = new mongoose.Schema({
  system: { type: mongoose.Schema.Types.ObjectId, ref: "System" },
  type: String,
  stage: String, // reconnaissance, exploitation, privilege-escalation
  severity: String,
  status: { type: String, default: "active" },
  startedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attack", attackSchema);