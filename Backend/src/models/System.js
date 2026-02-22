const mongoose = require("mongoose");

const systemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    ipAddress: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)$/.test(
            v
          );
        },
        message: "Invalid IP address format",
      },
    },

    environment: {
      type: String,
      enum: ["production", "staging", "development"],
      default: "development",
    },

    status: {
      type: String,
      enum: ["healthy", "warning", "critical"],
      default: "healthy",
    },

    riskScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastScan: {
      type: Date,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("System", systemSchema);