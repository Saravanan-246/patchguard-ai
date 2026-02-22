const mongoose = require("mongoose");

const patchSchema = new mongoose.Schema(
  {
    systemName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    // Use real Date instead of string window
    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startTime;
        },
        message: "End time must be after start time",
      },
    },

    status: {
      type: String,
      enum: ["scheduled", "pending", "in-progress", "completed", "failed"],
      default: "scheduled",
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/* ===============================
   Indexes (Performance Boost)
=============================== */
patchSchema.index({ systemName: 1 });
patchSchema.index({ startTime: 1 });

module.exports = mongoose.model("Patch", patchSchema);