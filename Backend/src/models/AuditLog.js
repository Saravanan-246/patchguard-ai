const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },

    system: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "System",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    details: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);