const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Patch = require("../models/Patch");

/* =========================================
   Utility: Async Wrapper
========================================= */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* =========================================
   Utility: Validate ObjectId
========================================= */
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* =========================================
   GET ALL PATCHES
========================================= */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const patches = await Patch.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: patches.length,
      data: patches,
    });
  })
);

/* =========================================
   GET SINGLE PATCH
========================================= */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Patch ID",
      });
    }

    const patch = await Patch.findById(id).lean();

    if (!patch) {
      return res.status(404).json({
        success: false,
        message: "Patch not found",
      });
    }

    res.status(200).json({
      success: true,
      data: patch,
    });
  })
);

/* =========================================
   CREATE PATCH
========================================= */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { systemName, window, status } = req.body;

    if (!systemName?.trim() || !window?.trim()) {
      return res.status(400).json({
        success: false,
        message: "System name and maintenance window are required",
      });
    }

    const patch = await Patch.create({
      systemName: systemName.trim(),
      window: window.trim(),
      status: status || "scheduled",
    });

    res.status(201).json({
      success: true,
      message: "Patch created successfully",
      data: patch,
    });
  })
);

/* =========================================
   UPDATE PATCH
========================================= */
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Patch ID",
      });
    }

    const updatedPatch = await Patch.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedPatch) {
      return res.status(404).json({
        success: false,
        message: "Patch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patch updated successfully",
      data: updatedPatch,
    });
  })
);

/* =========================================
   DELETE PATCH
========================================= */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Patch ID",
      });
    }

    const deletedPatch = await Patch.findByIdAndDelete(id);

    if (!deletedPatch) {
      return res.status(404).json({
        success: false,
        message: "Patch not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Patch deleted successfully",
    });
  })
);

module.exports = router;